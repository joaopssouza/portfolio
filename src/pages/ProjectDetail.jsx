// src/pages/ProjectDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects.js';
import ThemeToggle from '../components/ThemeToggle.jsx';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Projeto não encontrado!</h2>
        <Link to="/" className="btn">Voltar para a Home</Link>
      </div>
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-wrap">
          <h1 className="logo">João Paulo</h1>
          <nav className="nav">
            <Link to="/#projetos">← Voltar</Link>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      <main>
        <section className="section">
          <div className="container">
            <h2>{project.title}</h2>
            <p className="muted" dangerouslySetInnerHTML={{ __html: project.details.fullDescription }}></p>
            
            <div className="cards-grid" style={{ marginTop: '24px' }}>
              {project.details.images.map((image, index) => (
                <img key={index} className="card-img" src={image} alt={`Imagem ${index + 1} do projeto`} />
              ))}
              {project.details.videos.map((video, index) => (
                <video key={index} className="card-img" src={video} controls></video>
              ))}
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <a className="btn btn-outline" href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                Ver código no GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProjectDetail;