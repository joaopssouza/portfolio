// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 1. Importar o Link

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0d1117' },
  wrapper: { width: '100%', maxWidth: '400px' },
  form: { padding: '40px', backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #30363d' },
  title: { color: '#58a6ff', textAlign: 'center', marginBottom: '24px', marginTop: 0 },
  input: { width: '100%', padding: '12px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '8px', marginBottom: '16px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#58a6ff', color: '#0d1117', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  error: { color: '#f85149', textAlign: 'center', marginTop: '16px', minHeight: '1.2em' },
  // 2. Estilo para o link de retorno
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '24px',
    color: '#8b949e', // Cor --muted do seu CSS
    textDecoration: 'none',
    transition: 'color .2s ease'
  }
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
      <div style={styles.wrapper}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <h1 style={styles.title}>Admin Login</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            style={styles.input}
            required
            autoComplete="username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            style={styles.input}
            required
            autoComplete="current-password"
          />
          <button type="submit" style={styles.button}>Entrar</button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
        {/* 3. Link adicionado aqui */}
        <Link to="/" style={styles.backLink} onMouseOver={e => e.currentTarget.style.color = '#58a6ff'} onMouseOut={e => e.currentTarget.style.color = '#8b949e'}>
          ← Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default Login;