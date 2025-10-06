// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, isLCP }) => {
  // Adiciona transformações à URL da imagem para otimização
  const getOptimizedImageUrl = (url) => {
    if (!url || !url.includes('cloudinary')) {
      return url;
    }
    return url.replace('/upload/', '/upload/w_400,q_auto,f_auto/');
  };

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
          {/* Renderização Condicional:
            - Se 'project.imageUrl' existir, renderiza a tag <img>.
            - Caso contrário, renderiza o <div> com a classe do placeholder.
          */}
          {project.imageUrl ? (
            <img
              src={getOptimizedImageUrl(project.imageUrl)}
              alt={`Prévia ${project.title}`}
              fetchPriority={isLCP ? "high" : "auto"}
              className="card-miniature"
            />
          ) : (
            <div className="card-placeholder">
              <span>400 × 215</span>
            </div>
          )}
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