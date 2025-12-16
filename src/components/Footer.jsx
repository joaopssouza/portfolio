// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer" style={{ backgroundColor: 'var(--bg-alt)' }}>
      <div className="container">
        <ul className="contact-list">
          {/* Adicione seu telefone aqui */}
          <li><a href="tel:+5531986505863">+55 (31) 98650-5863</a></li>
          {/* Adicione seu e-mail aqui */}
          <li><a href="mailto:joaop0737@gmail.com">joaop0737@gmail.com</a></li>
          <li><a href="https://github.com/joaopssouza" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          {/* Adicione seu LinkedIn aqui */}
          <li><a href="https://www.linkedin.com/in/ap-joao-paulo/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
        <p className="copy">© {new Date().getFullYear()} João Paulo — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;