// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';


const ProjectCard = ({ project, isLCP }) => {
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

  const optimizedImageUrl = getOptimizedImageUrl(project.imageUrl);

  return (
    <article className="card">
      {/* Usamos a nova URL otimizada */}
      <Link to={project.projectUrl}>
        <div className="card-media-container">
          <img src={optimizedImageUrl} alt={`Prévia ${project.title}`} fetchpriority={isLCP ? "high" : "auto"} className="card-miniature" />
        </div>
      </Link>
      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
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