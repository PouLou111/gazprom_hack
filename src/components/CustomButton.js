import React from 'react';
import './CustomButton.css';

const CustomButton = ({ children, ...props }) => {
  return (
    <button className="custom-button" {...props}>
      {children}
    </button>
  );
};

export default CustomButton;
