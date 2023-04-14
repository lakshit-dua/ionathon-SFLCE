const fs = require('fs');
const baseDir = "./public/logs";
const readline = require("readline");
    
class FileSearchHandler {
    constructor(socket, connector) {
        this.socket = socket;
        this.connector = connector;
        this.init();
        this.closingBraces = "";
    }

    init() {
        this.socket.on('getFile', (location, startIndex, count) => handleFileQuery(location, startIndex, count));
        this.socket.on("search", (path, fileName, searchTerm) => { this.handleFileSearch(path, fileName, searchTerm) });
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

    handleFileSearch(path, fileName, searchTerm) {
        let searchResultsDir = "./searchResults";
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
        });
    }

    sanitizeSearchTermEntry(term) {
        return term.replace(/[^a-z0-9_\-]/gi, '_').toLowerCase();
    }
}

module.exports = FileSearchHandler