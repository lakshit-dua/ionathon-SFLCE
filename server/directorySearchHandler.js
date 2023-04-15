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
            // fs.readdir((baseDir+"/"+location), (err, files) => {
            //     if(files) {
            //         files.forEach(file => {
            //             console.log(file);
            //             directory.push(file)
            //         });
            //     }
            //     self.connector.sendMessage("getPublicDirResp",{directory});
            //   });
                let files  = {
                    id: 'root',
                    name: 'Parent',
                    children: []
                };

                function ThroughDirectory(Directory, data=files) {
                    fs.readdirSync(Directory).forEach(File => {
                        const Absolute = path.join(Directory, File);
                        if (fs.statSync(Absolute).isDirectory()) {
                            const myResult = { name: File, id: Absolute, children:[] };
                            data.children.push(myResult);
                            return ThroughDirectory(Absolute, myResult)
                        }
                        else {
                            return data.children.push({name: File, id: Absolute});
                        }
                    });
                }
                ThroughDirectory(baseDir+"/"+location, files);
                console.log(files);
                self.connector.sendMessage("getPublicDirResp",{directory: files});
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