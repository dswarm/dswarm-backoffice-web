import json
import requests

from flask import Flask, request

app = Flask(__name__)


def err(msg, *args, **kwargs):
    m = msg.format(*args, **kwargs)
    print m
    return m, 400


@app.route("/hook", methods=['POST'])
def trigger():
    git_data = json.loads(request.data.replace('\n', '\\n'))
    if u'ref' in git_data and u'total_commits_count' in git_data:
        branch = request.args.get('branch', 'dev')
        if git_data[u'ref'].endswith(branch):
            if git_data['total_commits_count'] > 0:
                url = request.args['url']
                job = request.args['job']
                token = request.args['token']
                cause = request.args['cause']

                print "calling", url, "for", job, "because", cause

                requests.post(url,
                              params=dict(job=job, token=token, cause=cause))
                return "", 200
            else:
                return err("no new commits")
        else:
            return err("not in branch {}", branch)
    else:
        return err("invalid gitlab data")


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5050)
