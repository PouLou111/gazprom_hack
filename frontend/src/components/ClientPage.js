import React, { useState, useEffect } from 'react';
import '../styles.css';

const ClientPage = ({ clientInfo, onLogout, images, setImages, selectedImage, setSelectedImage }) => {
  const [finalImage, setFinalImage] = useState(null);
  const [error, setError] = useState('');
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('http://localhost:8000/output_remover');
        if (response.ok) {
          const data = await response.json();
          setImages(data.images);
        }
      } catch (error) {
        setError('Network error');
      }
    };

    fetchImages();
  }, [setImages, fetchTrigger]);

  const handleGenerateClick = async () => {
    try {
      const response = await fetch('http://localhost:8000/process_image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            sizeX: parseInt(clientInfo.format.split('x')[0]),
            sizeY: parseInt(clientInfo.format.split('x')[1]),
            user: {
              gender: clientInfo.gender,
            },
            format: clientInfo.product_type,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const validImages = data.processed_images.filter(image => image && image.trim() !== '');
        setImages(validImages);
        setFinalImage(null);
        setFetchTrigger(fetchTrigger + 1); // Trigger re-fetching images
      } else {
        setError('Error generating images: ' + response.statusText);
      }
    } catch (error) {
      setError('Error generating images: ' + error.message);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleAddBackground = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/add_background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          sizeX: parseInt(clientInfo.format.split('x')[0]),
          sizeY: parseInt(clientInfo.format.split('x')[1]),
          backgroundColor: clientInfo.backgroundColor,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFinalImage(data.final_image);
      } else {
        setError('Error adding background: ' + response.statusText);
      }
    } catch (error) {
      setError('Error adding background: ' + error.message);
    }
  };

  const handleSaveImage = () => {
    if (!finalImage) {
      setError('No final image to save');
      return;
    }

    const link = document.createElement('a');
    link.href = `http://localhost:8000/download/${finalImage}`;
    link.download = finalImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="client-page">
      <div className="client-page-left">
        <div className="client-info">
          <h2>Client Page</h2>
          <div>ID: {clientInfo.id}</div>
          <div>Gender: {clientInfo.gender}</div>
          <div>Product Type: {clientInfo.product_type}</div>
          <div>Image Format: {clientInfo.format}</div>
          <button onClick={handleGenerateClick}>Generate Images</button>
          {error && <div className="error">{error}</div>}
          <div className="images">
            {images.length > 0 ? (
              images.map((image, index) => (
                <img
                  key={`${image}-${fetchTrigger}`} // Ensure unique key for each re-fetch
                  src={`http://localhost:8000/output_remover/${image}?timestamp=${new Date().getTime()}`}
                  alt={`Client ${clientInfo.id}`}
                  className={`client-image ${selectedImage === image ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(image)}
                />
              ))
            ) : (
              <p>No images generated yet.</p>
            )}
          </div>
          <button onClick={handleAddBackground} className="add-background-button" disabled={!selectedImage}>Add Background</button>
          <button onClick={handleSaveImage} className="save-image-button" disabled={!finalImage}>Save Image</button>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="client-page-right">
        <h3>Final Image</h3>
        <div className="final-image-container">
          {finalImage ? (
            <img src={`http://localhost:8000/output_final/${finalImage}?timestamp=${new Date().getTime()}`} alt="Final" className="final-image" />
          ) : (
            <p>No final image generated yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientPage;

