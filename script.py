import time
import urllib.request
from contextlib import closing
from flask import Flask, request, send_from_directory, send_file, Response
import codecs
import queue

app = Flask(__name__)

opTypes = {
    "ReturnFile": "1",
    "Interactive": "2"
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

@app.route("/api/initialize", methods=['GET'])
def initializeFileFetch():
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
    userInfo = request.get_json(force=True)
    opType = userInfo['opType']
    if opType == opTypes['ReturnFile']:
        fetchFile(userInfo)
        return send_file('/ionathon/repo/output.txt')
    elif opType == opTypes['Interactive']:
        return generate(userInfo)