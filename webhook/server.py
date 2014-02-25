from subprocess import *
import os
from flask import Flask, request

app = Flask(__name__)


def check_output_and_error(*popenargs, **kwargs):
    if 'stdout' in kwargs or 'stderr' in kwargs:
        raise ValueError('stdout and stderr argument not allowed, it will be overridden.')
    process = Popen(stdout=PIPE, stderr=PIPE, *popenargs, **kwargs)
    output, err = process.communicate()
    retcode = process.poll()
    if retcode:
        cmd = kwargs.get("args")
        if cmd is None:
            cmd = popenargs[0]
        raise CalledProcessError(retcode, cmd, output=output + '\n\n' + err)
    if err.strip():
        output += ('\n\n' + err + '\n\n')
    return output


def _update(tag, cmds, **kwargs):
    git = [
        ["git", "fetch", "origin"],
        ["git", "fetch", "--tags", "origin"],
        ["git", "checkout", tag]
    ]

    returncode = 0
    output = ''

    try:
        for cmd in git + [cmds]:
            output += check_output_and_error(cmd, **kwargs)
    except CalledProcessError as e:
        output = e.message + '\n\n' + e.output
        returncode = e.returncode

    return returncode, output


def _update_to_response(updater):
    returncode, output = updater()
    if returncode != 0:
        return output, 400, {'X-Returncode': returncode}

    return output, 200


def update_web(tag):
    return _update(tag,
                   ["make", "dist"],
                   cwd="/home/dmp/dmp-backoffice-web",
                   env=dict(os.environ, DMP_HOME="/home/dmp/datamanagement-platform"))


def update_api(tag):
    return _update(tag,
                   ["bash", "restart.sh"],
                   cwd="/home/dmp/datamanagement-platform")


def update_doc(port):
    returncode = 0
    output = ''

    try:

        output += check_output_and_error(["git", "pull", "origin"], cwd="/home/dmp/api-docs/datamanagement-platform")
        output += check_output_and_error(["git", "submodule", "update"],
                                         cwd="/home/dmp/api-docs/datamanagement-platform")

        lsof = ''
        try:
            lsof = check_output(["lsof", "-i", ":" + str(port), "-Fp"]).strip()
        except CalledProcessError:
            pass

        if lsof:
            pid = int(lsof[1:])
            check_call(["kill", str(pid)])

        mvn_opts = ["-DskipTests=true", "-PSDVDMPDOCS",
                    "-Ddb.mysql.url=jdbc:mysql://localhost:3306/dmp_dev",
                    "-Ddb.mysql.username=dmp", "-Ddb.mysql.password=dmp_mysql"]
        output += check_output_and_error(["mvn"] + mvn_opts + ["clean", "install"],
                                         cwd="/home/dmp/api-docs/datamanagement-platform/")
        Popen(["mvn"] + mvn_opts + ["jetty:run-war"],
              cwd="/home/dmp/api-docs/datamanagement-platform/controller")
    except CalledProcessError as e:
        returncode = e.returncode
        output += '\n\n' + e.message + '\n\n' + e.output

    return returncode, output


@app.route("/web", methods=['POST'])
def trigger_web():
    return _update_to_response(lambda: update_web(
        request.args.get('tag', 'HEAD')))


@app.route("/api", methods=['POST'])
def trigger_api():
    return _update_to_response(lambda: update_api(
        request.args.get('tag', 'HEAD')))


@app.route("/doc", methods=['POST'])
def trigger_doc():
    return _update_to_response(lambda: update_doc(
        request.args.get('port', '8086')))


if __name__ == "__main__":
    import sys
    app.run(host='0.0.0.0', debug='-d' in sys.argv)
