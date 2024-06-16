import React, { useState } from 'react';
import Auth from './components/Auth';
import ClientForm from './components/ClientForm';
import ClientPage from './components/ClientPage';
import './styles.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);

  const handleAuthSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setClientInfo(null);
  };

  const handleClientInfoReceived = (info) => {
    setClientInfo(info);
  };

  return (
    <div className="app">
      {!authenticated ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : clientInfo ? (
        <ClientPage clientInfo={clientInfo} onLogout={handleLogout} />
      ) : (
        <ClientForm onClientInfoReceived={handleClientInfoReceived} />
      )}
    </div>
  );
}

export default App;
