
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#0d1117',
            color: '#c9d1d9',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '0', color: '#58a6ff' }}>404</h1>
            <h2 style={{ marginBottom: '20px' }}>Página não encontrada</h2>
            <p style={{ marginBottom: '30px', color: '#8b949e' }}>A página que você está procurando não existe ou foi movida.</p>
            <Link to="/" className="btn" style={{
                padding: '10px 20px',
                backgroundColor: '#58a6ff',
                color: '#0d1117',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
            }}>
                Voltar para o Início
            </Link>
        </div>
    );
};

export default NotFound;
