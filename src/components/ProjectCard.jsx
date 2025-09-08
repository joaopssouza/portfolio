// src/components/ProjectCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';


const ProjectCard = ({ project }) => {
  return (
    <article className="card">
      <Link to={project.projectUrl}>
        <div className="card-media-container">
            <img src={project.imageUrl} alt={`Prévia ${project.title}`} className="card-miniature" />
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