import React, { useState } from 'react';

const ClientForm = ({ onClientInfoReceived }) => {
  const [clientId, setClientId] = useState('');
  const [imageFormat, setImageFormat] = useState('1280x1024');
  const [communicationChannel, setCommunicationChannel] = useState('email');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Закомментированная часть для реального запроса на получение информации о клиенте
    // fetch(`http://localhost:8080/info?id=${clientId}`, {
    //   method: 'GET',
    // })
    // .then(response => response.json())
    // .then(data => {
    //   onClientInfoReceived({ ...data, format: imageFormat, channel: communicationChannel });
    // })
    // .catch(() => console.error('Error fetching client info'));

    // Для тестирования
    const mockData = {
      id: clientId,
      gender: 'Male',
      age: 30,
      images: [
      ],
      format: imageFormat,
      channel: communicationChannel
    };
    onClientInfoReceived(mockData);
  };

  return (
    <div className="client-form-container">
      <form className="client-form" onSubmit={handleSubmit}>
        <h2>Client Form</h2>
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          required
        />
        <select value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}>
          <option value="1280x1024">1280x1024</option>
          <option value="1024x1080">1024x1080</option>
          <option value="800x600">800x600</option>
          <option value="640x480">640x480</option>
        </select>
        <select value={communicationChannel} onChange={(e) => setCommunicationChannel(e.target.value)}>
          <option value="email">Email</option>
          <option value="push">Push Notification</option>
          <option value="banner">Banner on Website</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ClientForm;
