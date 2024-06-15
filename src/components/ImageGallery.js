import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardActionArea } from '@mui/material';

const ImageGallery = ({ images, onSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSelect = (image) => {
    setSelectedImage(image);
    onSelect(image);
  };

  return (
    <Grid container spacing={2} className="image-gallery">
      {images.map((image, index) => (
        <Grid item xs={3} key={index}>
          <Card>
            <CardActionArea onClick={() => handleSelect(image)}>
              <CardMedia
                component="img"
                height="140"
                image={`/images/${image}`}
                alt={`Image ${index + 1}`}
                className={selectedImage === image ? 'selected' : ''}
              />
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ImageGallery;
