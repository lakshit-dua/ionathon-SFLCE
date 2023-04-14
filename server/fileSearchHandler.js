const fs = require('fs');
const baseDir = "./public/logs";
    
class FileSearchHandler {
    constructor(socket, connector) {
        this.socket = socket;
        this.connector = connector;
        this.init();
    }

    init() {
        this.socket.on('getFile', (location, startIndex, count) => handleFileQuery(location, startIndex, count));
    }

    handleFileQuery(location, startIndex, count) {
        const self = this;
        try {
          const input = fs.createReadStream(baseDir+"/"+location);
          const rl = readline.createInterface({ input })
          let cursor = 1;
          const content = [];
            rl.on('line', function(line) {
              if (cursor > startIndex && cursor <= startIndex+count) {
                  content.push(line);
                  console.log(line);
              }
              cursor++;
              if (cursor === startIndex+count) {
                  rl.close();
                  input.close();
                  self.connector.sendMessage({content});
              }
            });
        } catch(err) {
            self.connector.sendMessage({err});
        }
    }
}

module.exports = FileSearchHandler