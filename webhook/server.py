from collections import deque
import multiprocessing
import subprocess

from flask import Flask
app = Flask(__name__)

UPDATES_WEB = False
updates_web = deque()

UPDATES_API = False
updates_api = deque()


def update_web():
    if UPDATES_WEB:
        updates_web.appendleft(True)

    else:

        try:
            t = updates_web.pop()
            if t is True:
                multiprocessing.Process(
                    target=subprocess.call,
                    args=(["make", "upgrade", "dist"],),
                    kwargs={"cwd": "/home/dmp/dmp-backoffice-web"}).start()

        except IndexError:
            pass


def update_api():
    if UPDATES_API:
        updates_api.appendleft(True)

    else:

        try:
            t = updates_api.pop()
            if t is True:
                multiprocessing.Process(
                    target=subprocess.call,
                    args=(["bash", "restart.sh"],),
                    kwargs={"cwd": "/home/dmp/datamanagement-platform"}).start()

        except IndexError:
            pass


@app.route("/unstable", methods=['POST'])
def trigger():
    updates_web.appendleft(True)
    update_web()

    updates_api.appendleft(True)
    update_api()

    return "Upgrade running\n"


if __name__ == "__main__":
    app.run(host='0.0.0.0')

