import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AppContainer from './components/AppContainer/AppContainer';
import LoginDialog from './components/LoginDialog/LoginDialog';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);

  const handleUserLogin = (userData) => {
    setUser(userData);
  }
  
  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3030`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      {
        user ? (
          <AppContainer user={user} socket={socket}></AppContainer>
        ) : 
        <LoginDialog loginHandler={handleUserLogin}></LoginDialog>
      }
    </div>
  );
}

export default App;
