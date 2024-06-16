import React, { useState } from 'react';
import CustomButton from './CustomButton';

function ClientForm({ onSubmit }) {
  const [clientId, setClientId] = useState('');
  const [productType, setProductType] = useState('');
  const [imageSize, setImageSize] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Закомментируйте этот блок для имитации запроса на сервер
    /*
    const response = await fetch(
      `http://localhost:8080/client?clientId=${clientId}&productType=${productType}&imageSize=${imageSize}`
    );
    const data = await response.json();
    onSubmit(data);
    */

    // Имитация получения данных клиента для демонстрации
    onSubmit({ id: clientId, gender: 'Male', age: 30, images: ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg'] });
  };

  return (
    <div className="client-form-container">
      <form onSubmit={handleSubmit} className="client-form">
        <h2>Enter Client Data</h2>
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          placeholder="Client ID"
          required
        />
        <input
          type="text"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          placeholder="Product Type"
          required
        />
        <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} required>
          <option value="" disabled>Select Image Size</option>
          <option value="1280x1024">1280x1024</option>
          <option value="1024x1080">1024x1080</option>
          <option value="800x600">800x600</option>
          <option value="640x480">640x480</option>
        </select>
        <CustomButton type="submit">Submit</CustomButton>
      </form>
    </div>
  );
}

export default ClientForm;
