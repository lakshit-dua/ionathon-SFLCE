import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import FilePreview from "./components/FilePreview/FilePreview";

function App() {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3030`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      { socket ? (
        <div className="container">
          <FilePreview socket={socket} />
        </div>
        
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
}

export default App;
