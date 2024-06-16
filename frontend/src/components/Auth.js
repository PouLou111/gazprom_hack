import React, { useState } from 'react';

const Auth = ({ onAuthSuccess }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Закомментированная часть для реального запроса на авторизацию
    // const headers = new Headers();
    // headers.append('Authorization', 'Basic ' + btoa(`${login}:${password}`));
    
    // fetch('http://localhost:8080/login/password', {
    //   method: 'HEAD',
    //   headers: headers
    // })
    // .then(response => {
    //   if (response.ok) {
    //     onAuthSuccess();
    //   } else {
    //     setError('Invalid login or password');
    //   }
    // })
    // .catch(() => setError('Server error'));

    // Для тестирования
    if (login === 'test' && password === 'password') {
      onAuthSuccess();
    } else {
      setError('Invalid login or password');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          maxLength={80}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={25}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Auth;
