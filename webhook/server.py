from subprocess import CalledProcessError, check_output, STDOUT
from flask import Flask, request

app = Flask(__name__)


def _update(tag, cmds, **kwargs):
    git = [
        ["git", "fetch", "origin"],
        ["git", "fetch", "--tags", "origin"],
        ["git", "checkout", tag]
    ]

    kws = dict(stderr=STDOUT, **kwargs)

    returncode = 0
    output = ''

    try:
        for cmd in git + [cmds]:
            output += check_output(cmd, **kws)
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
                   cwd="/home/dmp/dmp-backoffice-web")


def update_api(tag):
    return _update(tag,
                   ["bash", "restart.sh"],
                   cwd="/home/dmp/datamanagement-platform")


@app.route("/web", methods=['POST'])
def trigger_web():
    return _update_to_response(lambda: update_web(
        request.args.get('tag', 'HEAD')))


@app.route("/api", methods=['POST'])
def trigger_api():
    return _update_to_response(lambda: update_api(
        request.args.get('tag', 'HEAD')))


if __name__ == "__main__":
    app.run(host='0.0.0.0')
