import React, { useState } from 'react';
import '../styles.css';

function Auth({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (login.length > 80 || password.length > 25) {
      setError('Login or password is too long.');
      return;
    }

    const authHeader = `Basic ${btoa(`${login}:${password}`)}`;

    try {
      const response = await fetch(`http://localhost:8000/authorize`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader
        }
      });

      if (response.ok) {
        onLogin({ login, password });
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  return (
    <div className="auth-form">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Auth;

