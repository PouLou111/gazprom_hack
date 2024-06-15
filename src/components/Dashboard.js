import React, { useState } from 'react';
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';
import ClientPage from './ClientPage';
import { clients as clientData } from '../db.json';
import axios from 'axios';

const Dashboard = () => {
  const [clientId, setClientId] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [clientData, setClientData] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Убедитесь, что данные загружены из db.json
    if (!clientData || !clientData.length) {
      console.error('Данные clients не загружены');
      return;
    }
  
    // Найти клиента по ID
    const client = clientData.find((c) => c.id === clientId);
    if (client) {
      setClientData({
        id: clientId,
        images: client.images,
      });
    } else {
      console.error(`Client with ID ${clientId} not found.`);
    }
  };
  

  return (
    <Container className="dashboard-container">
      <Typography variant="h4" gutterBottom>Client Dashboard</Typography>
      <TextField
        className="form-field"
        label="Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal" className="form-field">
        <InputLabel>Image Size</InputLabel>
        <Select value={imageSize} onChange={(e) => setImageSize(e.target.value)}>
          <MenuItem value="1280x1024">1280x1024</MenuItem>
          <MenuItem value="1024x1080">1024x1080</MenuItem>
          <MenuItem value="800x600">800x600</MenuItem>
          <MenuItem value="640x480">640x480</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      {clientData && <ClientPage clientData={clientData} />}
    </Container>
  );
};

export default Dashboard;
