import React from 'react';
import CustomButton from './CustomButton';

function ClientPage({ clientData, onLogout }) {
  const { id, gender, age, images } = clientData;

  const handleImageSelect = (image) => {
    // Закомментируйте этот блок для имитации запроса на сервер
    /*
    fetch(`http://localhost:8080/save-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, image }),
    });
    */

    // Имитация сохранения изображения для демонстрации
    console.log(`Image ${image} selected for client ${id}`);
  };

  return (
    <div className="client-page">
      <h2>Client Page</h2>
      <p>ID: {id}</p>
      <p>Gender: {gender}</p>
      <p>Age: {age}</p>
      <div className="images">
        {images.map((image, index) => (
          <img
            key={index}
            src={`images/${image}`}
            alt={`Client ${id}`}
            onClick={() => handleImageSelect(image)}
            className="client-image"
          />
        ))}
      </div>
      <CustomButton onClick={onLogout}>Logout</CustomButton>
    </div>
  );
}

export default ClientPage;
