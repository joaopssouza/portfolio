// src/components/Header.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const element = document.querySelector(targetId);
    if (element) {
      // Offset para compensar o header fixo/flutuante
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="site-header">
      <div className="container header-wrap">
        <h1 className="logo" alt="Meu nome">João
          <span className="highlight-name"> Paulo</span>
        </h1>
        <button
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a href="#home" className="nav-link active" onClick={(e) => handleNavClick(e, '#home')}>Home</a>
          <a href="#sobre" className="nav-link" onClick={(e) => handleNavClick(e, '#sobre')}>Sobre</a>
          <a href="#projetos" className="nav-link" onClick={(e) => handleNavClick(e, '#projetos')}>Projetos</a>
          <a href="#contato" className="nav-link" onClick={(e) => handleNavClick(e, '#contato')}>Contato</a>
          <a href="/admin/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>Painel de Controle</a>
          {/* ThemeToggle dentro do menu em mobile para facilitar layout */}
          <div className="mobile-only-theme">
            <ThemeToggle />
          </div>
        </nav>

        {/* ThemeToggle mantém-se no header em desktop */}
        <div className="desktop-only-theme">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;