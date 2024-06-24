import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import '../styles.css';

const ClientForm = ({ onClientInfoReceived, backgroundColor, setBackgroundColor, clientId, setClientId }) => {
  const [imageFormat, setImageFormat] = useState('1280x1024');
  const [error, setError] = useState('');

  const handleClientIdChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setClientId(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (clientId === '') {
      setError('Client ID is required');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/info?client_id=${clientId}`, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        onClientInfoReceived({ ...data, format: imageFormat, backgroundColor });
      } else {
        setError('Error fetching client info');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  return (
    <div className="client-form-container">
      <form className="client-form" onSubmit={handleSubmit}>
        <h2>Client Form</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={handleClientIdChange}
          required
        />
        <select value={imageFormat} onChange={(e) => setImageFormat(e.target.value)}>
          <option value="1280x1024">1280x1024</option>
          <option value="1024x1080">1024x1080</option>
          <option value="800x600">800x600</option>
          <option value="640x480">640x480</option>
        </select>
        <div className="color-picker-container">
          <label>Choose Background Color:</label>
          <div className="color-picker">
            <SketchPicker
              color={backgroundColor}
              onChangeComplete={(color) => setBackgroundColor(color.hex)}
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ClientForm;

