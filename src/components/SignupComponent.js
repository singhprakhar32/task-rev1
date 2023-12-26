// SignupComponent.jsx
import React, { useState } from 'react';
import SignupForm from './SignUpForm';
import { BACKGROUND_IMAGE } from '../utils/constants';
const SignupComponent = () => {
  const [formType, setFormType] = useState('signup');

  const containerStyle = {
    backgroundImage: `url(${BACKGROUND_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const formContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    padding: '20px',
    borderRadius: '15px',
    maxWidth: '400px', 
    width: '90%', 
  };

  const handleToggle = () => {
    setFormType((prevFormType) => (prevFormType === 'signup' ? 'login' : 'signup'));
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <SignupForm formType={formType} onToggle={handleToggle} />
      </div>
    </div>
  );
};

export default SignupComponent;
