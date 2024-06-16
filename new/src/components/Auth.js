import React, { useState } from 'react';
import '../styles.css';

function Auth({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login.length > 80 || password.length > 25) {
      setError('Login or password is too long.');
      return;
    }

    // Закомментируйте этот блок для имитации запроса на сервер
    /*
    fetch(`http://localhost:8080/login`, {
      method: 'HEAD',
      headers: {
        'Authorization': `Basic ${btoa(`${login}:${password}`)}`
      }
    }).then(response => {
      if (response.ok) {
        onLogin({ login, password });
      } else {
        setError('Invalid credentials');
      }
    });
    */

    // Имитация успешной аутентификации для демонстрации
    onLogin({ login, password });
  };

  return (
    <div className="auth">
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
