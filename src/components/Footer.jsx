// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <ul className="contact-list">
          {/* Adicione seu telefone aqui */}
          <li><a href="tel:+5562999999999">+55 (62) 99999-9999</a></li>
          {/* Adicione seu e-mail aqui */}
          <li><a href="mailto:joaopssouza.dev@gmail.com">joaopssouza.dev@gmail.com</a></li>
          <li><a href="https://github.com/joaopssouza" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          {/* Adicione seu LinkedIn aqui */}
          <li><a href="https://www.linkedin.com/in/joaopssouza/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
        <p className="copy">© {new Date().getFullYear()} João Paulo Souza — Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;