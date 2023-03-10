// const uuidv4 = require('uuid').v4;
const fs = require('fs');
const readline = require("readline");

const messages = new Set();
const users = new Map();


class Connection {
  constructor(io, socket) {
    this.socket = socket;
    this.io = io;

    socket.on('getFile', (fileLocation, index, length) => this.sendFile(fileLocation, index, length));
    socket.on('message', (value) => this.handleMessage(value));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }
  
  sendMessage(message) {
    this.io.sockets.emit('message', message);
  }
  
  getMessages() {
    messages.forEach((message) => this.sendMessage(message));
  }

  sendFile(fileLocation, index, length) {
    const self = this;
    const input = fs.createReadStream(fileLocation);
    const rl = readline.createInterface({ input })
    let cursor = 1;
    const content = [];
      rl.on('line', function(line) {
        if (cursor > index && cursor <= index+length) {
            content.push(line);
            console.log(line);
        }
        cursor++;
        if (cursor === index+length) {
            rl.close();
            input.close();
            self.sendMessage({content});
        }
      });
  }

  handleMessage(value) {
    const input = fs.createReadStream("index.html");
    const rl = readline.createInterface({ input })
    const cursor = 5;
    const content = [];
      rl.on('line', function(line) {
        if (cursor++ === n) {
          rl.close()
          input.close()
        } else {
            content.push(line);
            console.log(line)
        }
      })
    this.sendMessage({content});

  }

  disconnect() {
    // users.delete(this.socket);
  }
}

function filesHandler(io) {
  io.on('connection', (socket) => {
    new Connection(io, socket);   
  });
};

module.exports = filesHandler;