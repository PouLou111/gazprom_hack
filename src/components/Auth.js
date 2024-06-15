import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const Auth = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // if (login.length > 80 || password.length > 25) {
    //   setError('Login or password exceeds maximum length.');
    //   return;
    // }

    // try {
    //   // Симулируем успешную авторизацию
    //   await axios.head(`http://localhost:8080/login/password`, { auth: { username: login, password: password } });
    //   navigate('/dashboard');
    // } catch (err) {
    //   setError('Invalid login or password.');
    // }
    // Симулируем успешную авторизацию
    navigate('/dashboard');

  };

  return (
    <div className="auth-container">
      <Typography variant="h4" gutterBottom>Login</Typography>
      <TextField
        className="form-field"
        label="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        className="form-field"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {error && <Typography className="error-message">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default Auth;
