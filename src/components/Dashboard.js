import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ClientPage from './ClientPage';

const Dashboard = () => {
  const [clientId, setClientId] = useState('');
  const [imageType, setImageType] = useState('');
  const [imageSize, setImageSize] = useState('');
  const [clientData, setClientData] = useState(null);

  const handleSubmit = () => {
    axios.get(`http://localhost:8080/client/${clientId}?type=${imageType}&size=${imageSize}`)
      .then(response => {
        setClientData(response.data);
      })
      .catch(error => {
        console.error('Error fetching client data:', error);
      });

    // // Для тестирования без сервера
    // setClientData({
    //   id: clientId,
    //   gender: 'Male',
    //   age: 30,
    //   images: [
    //     { url: 'https://via.placeholder.com/150' },
    //     { url: 'https://via.placeholder.com/150' },
    //     { url: 'https://via.placeholder.com/150' },
    //     { url: 'https://via.placeholder.com/150' },
    //   ],
    // });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Client Dashboard</Typography>
      <TextField
        label="Client ID"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Image Type</InputLabel>
        <Select value={imageType} onChange={(e) => setImageType(e.target.value)}>
          <MenuItem value="type1">Type 1</MenuItem>
          <MenuItem value="type2">Type 2</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Image Size</InputLabel>
        <Select value={imageSize} onChange={(e) => setImageSize(e.target.value)}>
          <MenuItem value="1280x1024">1280x1024</MenuItem>
          <MenuItem value="1024x1080">1024x1080</MenuItem>
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
