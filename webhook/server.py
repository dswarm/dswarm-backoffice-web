import multiprocessing
import subprocess

from flask import Flask
app = Flask(__name__)


@app.route("/unstable", methods=['POST'])
def trigger():
    p1 = multiprocessing.Process(
        target=subprocess.call,
        args=(["make", "upgrade", "dist"],),
        kwargs={"cwd": "/home/dmp/dmp-backoffice-web"})

    p2 = multiprocessing.Process(
        target=subprocess.call,
        args=(["bash", "restart.sh"],),
        kwargs={"cwd": "/home/dmp/datamanagement-platform"})

    p1.start()
    p2.start()

    return "Upgrade running"


if __name__ == "__main__":
    app.run(host='0.0.0.0')

