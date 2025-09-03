// src/components/Header.jsx
import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="site-header">
      <div className="container header-wrap">
        <h1 className="logo">João Paulo</h1>
        <nav className="nav">
          <a href="#sobre">Sobre</a>
          <a href="#projetos">Projetos</a>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;