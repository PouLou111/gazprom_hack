import React, { useState } from 'react';
import { Button, Typography, Container } from '@mui/material';
import ImageGallery from './ImageGallery';
import axios from 'axios';

const ClientPage = ({ clientData }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleSaveImage = async () => {
    try {
      await axios.post(`http://localhost:8080/client/${clientData.id}/save`, { image: selectedImage });
      alert('Image saved successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="client-page">
      <Typography variant="h5">Client ID: {clientData.id}</Typography>
      <ImageGallery images={clientData.images} onSelect={handleImageSelect} />
      {selectedImage && (
        <Button variant="contained" color="primary" onClick={handleSaveImage}>
          Save Selected Image
        </Button>
      )}
      <Button variant="contained" color="secondary" onClick={() => window.location.reload()}>
        Select Another Client
      </Button>
      <Button variant="contained" color="default" onClick={() => window.location.href = '/'}>
        Logout
      </Button>
    </Container>
  );
};

export default ClientPage;
