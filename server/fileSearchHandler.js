const fs = require('fs');
const baseDir = "./public/logs";
const readline = require("readline");
let searchResultsDir = "./searchResults";
    
class FileSearchHandler {
    constructor(socket, connector) {
        this.socket = socket;
        this.connector = connector;
        this.init();
        this.closingBraces = "";
    }

    init() {
        this.socket.on('getFile', (location, startIndex, endIndex) => { this.handleFileQuery(location, startIndex, endIndex) });
        this.socket.on("search", (path, fileName, searchTerm) => { this.handleFileSearch(path, fileName, searchTerm) });
        this.socket.on("readFileBlock", (path, fileName, blockIndex, searchTerm, blockCount) => { this.handleFileBlockRead(path, fileIndex, blockIndex, searchTerm, blockCount); });
    }

    handleFileQuery(location, startIndex, endIndex) {
        const count = endIndex - startIndex;
        const self = this;
        try {
          const input = fs.createReadStream(baseDir+"/"+location);
          const rl = readline.createInterface({ input })
          let cursor = 1;
          const content = [];
            rl.on('line', function(line) {
              if (cursor > startIndex && cursor <= startIndex+count) {
                  content.push(line);
              }
              cursor++;
              if (cursor === startIndex+count) {
                  rl.close();
                  input.close();
                  self.connector.sendMessage("getFileResp", {content});
              }
            });
            input.on('end', () => {
                self.connector.sendMessage("getFileResp", {content});
                rl.close();
                input.close();
            })
        } catch(err) {
            self.connector.sendMessage("getFileResp",{err});
        }
    }

    handleFileSearch(path, fileName, searchTerm) {
        const self = this;
        let searchTermCleanEntryName = this.sanitizeSearchTermEntry(searchTerm);
        fs.unlinkSync(`${searchResultsDir}/${searchTermCleanEntryName}.json`);
        const jsonWriteStream = fs.createWriteStream(`${searchResultsDir}/${searchTermCleanEntryName}.json`, { 
          flags: "a" 
        });
        const baseJsonContent = `{ "term": "${searchTerm}", "results": {`;
        this.closingBraces = "}}";
        jsonWriteStream.write(baseJsonContent);
        const fileSearchStream = fs.createReadStream(baseDir+path+"/"+fileName);
        jsonWriteStream.write(`"${this.sanitizeSearchTermEntry(fileName)}": [`);
        this.closingBraces = "]" + this.closingBraces;
        fileSearchStream.setEncoding("UTF8");
        let lineNumber = 0;
        const rl = readline.createInterface({ input: fileSearchStream });
        let visited = false;
        rl.on('line', (line) => {
            //only writing the single line currently when I get a hit
          lineNumber++
          console.log("ch: " + line);
          const lineIndex = line.indexOf(searchTerm);
          if (lineIndex !== -1) {
            let content = `[
                {
                  "line": "${lineNumber}",
                  "text": "${line}",
                  "index": "${lineIndex}"
                }
            ]`;
            if (visited) {
                content = "," + content;
            } else {
                visited = true;
            }
            jsonWriteStream.write(content);
          }
        });
        fileSearchStream.on("end", () => {
            console.log("Closing file");
            jsonWriteStream.write(this.closingBraces);
            rl.close();
            fileSearchStream.close();
            jsonWriteStream.close();
            const jsonRead = fs.readFileSync(searchResultsDir + "/" + searchTermCleanEntryName + ".json", {
                encoding: "UTF8"
            });
            self.connector.sendMessage("searchResp", {jsonRead});
        });
    }

    handleFileBlockRead(path, fileIndex, blockIndex, searchTerm, blockCount) {
        let searchTermCleanEntryName = this.sanitizeSearchTermEntry(searchTerm);
        const jsonRead = fs.readFileSync(searchResultsDir + "/" + searchTermCleanEntryName + ".json", {
            encoding: "UTF8"
        });

        const blocksToReturn = {};

        const searchObject = JSON.parse(jsonRead);
        const numberOfFilesSearched = Object.keys(searchObject.results).length;
        const fileName = Object.keys(searchObject.results)[fileIndex];
        const numberOfFileSearchResults = searchObject.results[fileName].length;
        const results = [];
        let currBlockCount = 0;
        if (blockIndex <= results[fileName].length) {
            // First we append the remaining blocks from that file
            for (let idx = blockIndex; idx <= results[fileName].length; idx++) {
                if (currBlockCount <= blockCount) {
                    if (!Array.isArray(blocksToReturn[fileName])) {
                        blocksToReturn[fileName] = [];
                    }
                    blocksToReturn[fileName].append(results[fileName][idx]);
                    currBlockCount++;
                } else {
                    break;
                }
            }
            if (fileIndex + 1 < Object.keys(searchObject.results).length) {
                for (let index = fileIndex + 1; index < Object.keys(searchObject.results).length; index++) {
                    if (currBlockCount <= blockCount) {
                        const fileKey = Object.keys(searchObject.results)[index];
                        if (currBlockCount + searchObject.results[fileKey].length >= blockCount) {
                            for (let fileIndex = 0; fileIndex <= (blockCount - currBlockCount); fileIndex++) {
                                blocksToReturn[fileName].append(results[fileName][fileIndex]);
                            }
                        } else {
                            if (!Array.isArray(blocksToReturn[fileName])) {
                                blocksToReturn[fileName] = [];
                            }
                            blocksToReturn[fileName].append(...results[fileName]);
                            currBlockCount++;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        this.connector.sendMessage("searchResp", {jsonRead: blocksToReturn});
    }

    sanitizeSearchTermEntry(term) {
        return term.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    }
}

module.exports = FileSearchHandler