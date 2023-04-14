const fs = require('fs');
const Zip = require('node-7z-forall');
const path = require('path');
const baseDir = "./public/logs"

class DirectorySearchHandler {
    constructor(socket, connector) {
        this.socket = socket;
        this.connector = connector;
        this.init();
    }

    init() {
        this.socket.on('getPublicDir', (location) => this.handlePublicDirQuery(location));
        this.socket.on('getArchiveList', (location) => this.handleArchiveListRequest(location));
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
                self.connector.sendMessage("getPublicDirResp",{directory});
              });
        } catch(err) {
            console.log(err)
            self.connector.sendMessage("getPublicDirResp",{err});
        }
    }

    handleArchiveListRequest(location) {
        const path2 = path.join(__dirname, baseDir+"/"+location);
        let entries = [];
        console.log(path2);
        Zip.list(path2).progress((entry) => {
            entries = entries.concat(entry);
        }).then(() =>{
            console.log(entries);
            this.connector.sendMessage("getArchiveListResp", {entries});
        }).catch(err => {
            console.log(err);
            this.connector.sendMessage("getArchiveListResp",{err});
        });
    }
}

module.exports = DirectorySearchHandler