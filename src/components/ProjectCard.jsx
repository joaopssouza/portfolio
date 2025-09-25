// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';


const ProjectCard = ({ project, isLCP }) => {
    // URLs dos placeholders para cada tema
  const DARK_PLACEHOLDER = 'https://placehold.co/400x215/0d1117/388bfd/';
  const LIGHT_PLACEHOLDER = 'https://placehold.co/400x215/f6f8fa/0a5cc9/';

  // Adiciona transformações à URL da imagem para otimização
  const getOptimizedImageUrl = (url) => {
    if (!url || !url.includes('cloudinary')) {
      return url; // Retorna a URL original se não for do Cloudinary
    }
    // "upload/" é o ponto onde inserimos as transformações
    // w_400: largura de 400px
    // q_auto: qualidade automática (ótima compressão)
    // f_auto: formato automático (entrega WebP/AVIF se o navegador suportar)
    return url.replace('/upload/', '/upload/w_400,q_auto,f_auto/');
  };

  // Lógica para decidir qual URL de imagem usar
  const getImageUrlToDisplay = () => {
    // Se o projeto tem uma imagem, otimiza e a retorna
    if (project.imageUrl) {
      return getOptimizedImageUrl(project.imageUrl);
    }
    // Se não tem, retorna o placeholder correspondente ao tema atual
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
      {/* Usamos a nova URL otimizada */}
      <Link to={project.projectUrl}>
        <div className="card-media-container">
          <img src={imageUrlToDisplay}alt={`Prévia ${project.title}`} fetchPriority={isLCP ? "high" : "auto"} className="card-miniature" />
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