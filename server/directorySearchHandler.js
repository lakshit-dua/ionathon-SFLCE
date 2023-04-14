const fs = require('fs');
const baseDir = "./public/logs"

class DirectorySearchHandler {
    constructor(socket, connector) {
        this.socket = socket;
        this.connector = connector;
        this.init();
    }

    init() {
        this.socket.on('getPublicDir', (location) => this.handlePublicDirQuery(location));
    }

    handlePublicDirQuery(location) {
        const self = this;
        try {
            const directory = [];
            fs.readdir((baseDir+"/"+location), (err, files) => {
                if(files) {
                    files.forEach(file => {
                        console.log(file);
                        directory.push(file)
                    });
                }
                self.connector.sendMessage({directory});
              });
        } catch(err) {
            console.log(err)
            self.connector.sendMessage({err});
        }
    }
}

module.exports = DirectorySearchHandler