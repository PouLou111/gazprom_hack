import React, { useState } from 'react';
import Auth from './components/Auth';
import ClientForm from './components/ClientForm';
import ClientPage from './components/ClientPage';
import './styles.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('ClientForm');
  const [backgroundColor, setBackgroundColor] = useState('#005BAC'); // Состояние для хранения цвета фона
  const [clientId, setClientId] = useState(''); // Состояние для хранения клиентского ID
  const [images, setImages] = useState([]); // Состояние для хранения сгенерированных изображений
  const [selectedImage, setSelectedImage] = useState(null); // Состояние для хранения выбранного изображения

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleClientInfoReceived = (info) => {
    setClientInfo(info);
    setActiveTab('ClientPage');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setClientInfo(null);
    setActiveTab('ClientForm');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app">
      <div className="header">
        <img src="https://static.tildacdn.com/tild3337-6161-4636-b135-633238663835/__.svg" alt="Газпромбанк" />
      </div>
      {!authenticated ? (
        <div className="auth-container">
          <Auth onLogin={handleLogin} />
        </div>
      ) : (
        <div>
          <div className="tabs">
            <button
              onClick={() => handleTabChange('ClientForm')}
              className={activeTab === 'ClientForm' ? 'active' : ''}
            >
              Client Form
            </button>
            <button
              onClick={() => handleTabChange('ClientPage')}
              className={activeTab === 'ClientPage' ? 'active' : ''}
            >
              Client Page
            </button>
          </div>
          <div className="content-container">
            {activeTab === 'ClientForm' ? (
              <ClientForm 
                onClientInfoReceived={handleClientInfoReceived} 
                backgroundColor={backgroundColor} 
                setBackgroundColor={setBackgroundColor} 
                clientId={clientId} 
                setClientId={setClientId} 
              />
            ) : (
              <ClientPage 
                clientInfo={clientInfo} 
                onLogout={handleLogout} 
                images={images} 
                setImages={setImages} 
                selectedImage={selectedImage} 
                setSelectedImage={setSelectedImage} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

