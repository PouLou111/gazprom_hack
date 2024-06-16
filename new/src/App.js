import React, { useState } from 'react';
import Auth from './components/Auth';
import ClientForm from './components/ClientForm';
import ClientPage from './components/ClientPage';
import './styles.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientData, setClientData] = useState(null);

  const handleLogin = (loginData) => {
    // Закомментируйте этот блок для имитации запроса на сервер
    /*
    fetch(`http://localhost:8080/login`, {
      method: 'HEAD',
      headers: {
        'Authorization': `Basic ${btoa(`${loginData.login}:${loginData.password}`)}`
      }
    }).then(response => {
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
    });
    */
    // Имитация успешной аутентификации для демонстрации
    setIsAuthenticated(true);
  };

  const handleClientDataSubmit = (clientData) => {
    // Убедитесь, что массив images содержит правильные имена файлов
    const updatedClientData = {
      ...clientData,
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'],
    };
    setClientData(updatedClientData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setClientData(null);
  };

  return (
    <div className="app">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} />
      ) : !clientData ? (
        <ClientForm onSubmit={handleClientDataSubmit} />
      ) : (
        <ClientPage clientData={clientData} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
