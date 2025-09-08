// src/pages/ProjectDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects.js';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Modal from '../components/Modal.jsx';

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  // Combina imagens e vídeos em uma única lista de mídias
  const media = useMemo(() => {
    if (!project) return [];
    const images = project.details.images.map(url => ({ type: 'image', url }));
    const videos = project.details.videos.map(url => ({ type: 'video', url }));
    return [...images, ...videos];
  }, [project]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNext = () => {
    if (currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // Efeito para escutar eventos do teclado (setas)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;
      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, currentIndex]);


  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Projeto não encontrado!</h2>
        <Link to="/" className="btn">Voltar para a Home</Link>
      </div>
    );
  }

  const currentMedia = media[currentIndex];

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
              {media.map((item, index) => (
                <div key={index} className="card-media-container" onClick={() => openModal(index)}>
                  {item.type === 'image' ? (
                    <img className="card-img" src={item.url} alt={`Mídia ${index + 1} do projeto`} />
                  ) : (
                    <video className="card-video" src={item.url}></video>
                  )}
                  <div className="overlay">
                    <span>{item.type === 'image' ? '🔎' : '▶'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.codeUrl && (
                <a className="btn" href={project.codeUrl} target="_blank" rel="noopener noreferrer">
                  Ver código no GitHub
                </a>
              )}
              {project.linkPreview && (
                <a className="btn" href={project.linkPreview} target="_blank" rel="noopener noreferrer">
                  Ver página
                </a>
              )}
              {project.details.pdfUrl && (
                <a className="btn btn-outline" href={project.details.pdfUrl} target="_blank" rel="noopener noreferrer">
                  Ver Relatório Completo (PDF)
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          media={currentMedia}
          onNext={goToNext}
          onPrevious={goToPrevious}
          hasNext={currentIndex < media.length - 1}
          hasPrevious={currentIndex > 0}
        />
      )}
    </>
  );
};

export default ProjectDetail;