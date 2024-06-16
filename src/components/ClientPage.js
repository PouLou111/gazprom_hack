import React, { useState } from 'react';

const ClientPage = ({ clientInfo, onLogout }) => {
  const [images, setImages] = useState(clientInfo.images);

  const handleGenerateClick = () => {
    fetch(`http://localhost:8080/generateImages?id=${clientInfo.id}&format=${clientInfo.format}&channel=${clientInfo.channel}`, {
      method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
      setImages(data.images);
    })
    .catch(() => console.error('Error fetching images'));

    // // Для тестирования
    // const mockImages = [
    //   'image1.jpg',
    //   'image2.jpg',
    //   'image3.jpg',
    //   'image4.jpg'
    // ];
    // setImages(mockImages);
  };

  return (
    <div className="client-page">
      <h2>Client Page</h2>
      <div>ID: {clientInfo.id}</div>
      <div>Gender: {clientInfo.gender}</div>
      <div>Age: {clientInfo.age}</div>
      <div>Image Format: {clientInfo.format}</div>
      <div>Communication Channel: {clientInfo.channel}</div>
      <button onClick={handleGenerateClick}>Generate Images</button>
      <div className="images">
        {images.map((image, index) => (
          <img
            key={index}
            src={`/images/${image}`} // Обновите путь в зависимости от реального расположения изображений
            alt={`Client ${clientInfo.id}`}
            className="client-image"
          />
        ))}
      </div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default ClientPage;
