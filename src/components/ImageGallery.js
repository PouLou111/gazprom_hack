import React from 'react';
import { Grid, Card, CardMedia, CardActionArea } from '@mui/material';

const ImageGallery = ({ images, onSelect }) => (
  <Grid container spacing={2}>
    {images.map((image, index) => (
      <Grid item xs={3} key={index}>
        <Card>
          <CardActionArea onClick={() => onSelect(image)}>
            <CardMedia component="img" height="140" image={image.url} />
          </CardActionArea>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default ImageGallery;
