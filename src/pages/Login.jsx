// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0d1117' },
  form: { padding: '40px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d', width: '100%', maxWidth: '400px' },
  title: { color: '#58a6ff', textAlign: 'center', marginBottom: '24px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '8px', marginBottom: '16px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#58a6ff', color: '#0d1117', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  error: { color: '#f85149', textAlign: 'center', marginTop: '16px' }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        navigate('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Falha no login.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Admin Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuário"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Entrar</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;