// src/components/ProjectCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, isLCP }) => {
  // URLs dos placeholders que você especificou para cada tema
  const DARK_PLACEHOLDER = 'https://placehold.co/400x215/0d1117/388bfd/';
  const LIGHT_PLACEHOLDER = 'https://placehold.co/400x215/f6f8fa/0a5cc9/';

  // 1. Estado para armazenar o tema atual.
  // Ele lê o valor inicial do localStorage para já carregar com o tema correto.
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // 2. Efeito que observa mudanças no tema da página.
  useEffect(() => {
    // A função do observer é chamada sempre que uma mutação ocorre no HTML.
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        // Verificamos se o atributo modificado foi o 'data-theme'.
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          // Atualiza o estado interno do card com o novo tema.
          setTheme(mutation.target.getAttribute('data-theme'));
        }
      }
    });

    // Inicia a observação no elemento <html>, focado em mudanças de atributos.
    observer.observe(document.documentElement, { attributes: true });

    // Função de limpeza: para o observador quando o componente é desmontado para evitar leaks de memória.
    return () => {
      observer.disconnect();
    };
  }, []); // O array vazio assegura que o efeito rode apenas na montagem do componente.

  // Adiciona transformações à URL da imagem para otimização
  const getOptimizedImageUrl = (url) => {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }
    return url.replace('/upload/', '/upload/w_400,q_auto,f_auto/');
  };

  // 3. Lógica para decidir qual URL de imagem usar.
  const getImageUrlToDisplay = () => {
    // Se o projeto tem uma imagem, a otimiza e retorna.
    if (project.imageUrl) {
      return getOptimizedImageUrl(project.imageUrl);
    }
    // Se não tem, retorna o placeholder correspondente ao tema atual do estado.
    return theme === 'light' ? LIGHT_PLACEHOLDER : DARK_PLACEHOLDER;
  };

  const imageUrlToDisplay = getImageUrlToDisplay();

  // Função para formatar a data
  const formattedDate = new Date(project.publicationDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className="card">
      <Link to={project.projectUrl}>
        <div className="card-media-container">
          {/* Usa a URL final (otimizada, placeholder dark ou placeholder light) */}
          <img 
            src={imageUrlToDisplay} 
            alt={`Prévia ${project.title}`} 
            fetchPriority={isLCP ? "high" : "auto"} 
            className="card-miniature" 
          />
        </div>
      </Link>
      <div className="card-body">
        <div className="card-header">
          <h3 className="card-title">{project.title}</h3>
        </div>
        {project.publicationDate && <time className="card-date">{formattedDate}</time>}
        <p className="card-text">{project.description}</p>
        <div className="card-actions">
          <Link className="btn" to={project.projectUrl}>Ver página</Link>
          {project.codeUrl && (
            <a className="btn btn-outline" target="_blank" rel="noopener noreferrer" href={project.codeUrl}>Código</a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;