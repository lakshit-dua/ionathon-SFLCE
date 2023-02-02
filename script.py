import time
import urllib.request
from contextlib import closing
from flask import Flask, request, send_from_directory, send_file, Response, make_response
from flask_cors import CORS, cross_origin
import codecs
import queue

app = Flask(__name__)
app.debug = True
CORS(app)

opTypes = {
    "ReturnFile": 1,
    "Interactive": 2
}


class MessageAnnouncer:
    def __init__(self):
        self.listeners = []

    def listen(self):
        q = queue.Queue(maxsize=5)
        self.listeners.append(q)
        return q

    def announce(self, msg):
        for i in reversed(range(len(self.listeners))):
            try:
                self.listeners[i].put_nowait(msg)
            except queue.Full:
                del self.listeners[i]


def writeToOutput(pat, loc, username, password, fileName):
    open('output.txt', 'w').close()
    output = open('output.txt', 'a')
    with closing(urllib.request.urlopen(f'ftp://{username}:{password}@{loc}/{fileName}')) as r:
        for i, line in enumerate(r):
            lineString = codecs.decode(line, errors='ignore')
            if pat in lineString:
                output.write(lineString)
    output.close()


def fetchFile(userInfo):
    pat = userInfo['pattern']
    loc = userInfo['ftpLocation']
    username = userInfo['ftpUsername']
    password = userInfo['ftpPassword']
    fileName = userInfo['ftpFileName']
    writeToOutput(pat, loc, username, password, fileName)


def returner(userInfo):
    fetchFile(userInfo)
    return send_file('/ionathon/repo/output.txt', as_attachment=True)


@app.route("/api/initialize", methods=['POST'])
def initializeFileFetch():
    userInfo = request.get_json(force=True)
    opType = userInfo['opType']
    print(opType)
    response = "response"
    if (opType == opTypes['ReturnFile']):
        return returner(userInfo)
    else:
        response = make_response(generate(userInfo))
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = True
    # return returner(userInfo), { "Access-Control-Allow-Origin": "*" } if opType == opTypes['ReturnFile'] else generate(userInfo), { "Access-Control-Allow-Origin": "*" }
    return response


def generate(userInfo):
    yield "Starting...\n"
    pat = userInfo['pattern']
    loc = userInfo['ftpLocation']
    username = userInfo['ftpUsername']
    password = userInfo['ftpPassword']
    fileName = userInfo['ftpFileName']
    with closing(urllib.request.urlopen(f'ftp://{username}:{password}@{loc}/{fileName}')) as r:
        for i, line in enumerate(r):
            lineString = codecs.decode(line, errors='ignore')
            if pat in lineString:
                yield lineString
