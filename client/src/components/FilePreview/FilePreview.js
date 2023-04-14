import React, { useEffect, useState } from 'react';
import './FilePreview.css';

function Messages(props) {
  const [fileContent, setFileContent] = useState([]);

  const getFile = () => {
    props.socket.emit("getPublicDir", "");
    props.socket.emit("getPublicDir", "client-folder");
  }

  useEffect(() => {
    const messageListener = (message) => {
        setFileContent(() => {
            console.log(message);
            const lines = message?.directory?.map((line, index) => { return {line, key: index } })
        return lines;
      });
    };  
  
    props.socket.on('message', messageListener);

    return () => {
      props.socket.off('message', messageListener);
    };
  }, [props.socket]);

  return (
    <div className="message-list">
     <button onClick={getFile}>Check</button>
     <div className='file-display'>
     { fileContent.map((line) => 
                <span>
                   {line.line}
                </span>
            )}
     </div>
    </div>
  );
}

export default Messages;