import React, { useState } from 'react';
import { Button } from '@mui/material';
import clientData from '../db.json'; // Указывайте правильный относительный путь в зависимости от структуры проекта


const ImageUploader = ({ clientId }) => {
  const [images, setImages] = useState([]);
  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

  // Эмуляция загрузки изображений
  const fetchImages = async () => {
    try {
      // Предполагается, что clientData имеет структуру, подобную db.json
      const client = clientData.clients.find(client => client.id === clientId);
      if (client) {
        setImages(client.images);
      } else {
        console.error(`Client with ID ${clientId} not found.`);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={fetchImages}>
        Load Saved Images
      </Button>
      <div>
        {images.length > 0 ? (
          images.map((image, index) => (
            <img key={index} src={`/images/${image}`} alt={`client-${clientId}-image-${index}`} />
          ))
        ) : (
          <p>No images loaded</p>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

