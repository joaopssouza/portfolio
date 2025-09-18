// src/pages/ProjectDetail.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle.jsx';
import Modal from '../components/Modal.jsx';
import Footer from '../components/Footer.jsx';


const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null); // Inicia como nulo
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    // Busca todos os projetos da API
    fetch('/api/projects.json')
      .then(res => res.json())
      .then(allProjects => {
        // Encontra o projeto específico pelo ID da URL
        const foundProject = allProjects.find(p => p.id === id);
        setProject(foundProject);
        setIsLoading(false); // Finaliza o carregamento
      })
      .catch(err => {
        console.error("Failed to fetch project details:", err);
        setIsLoading(false); // Finaliza o carregamento mesmo com erro
      });
  }, [id]);

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

  // Função para otimizar as URLs de mídia do Cloudinary
  const getOptimizedMediaUrl = (url, type) => {
    if (!url || !url.includes('cloudinary')) return url;

    // Transformações para imagens (largura, qualidade e formato automáticos)
    const imageTransformations = 'w_600,q_auto,f_auto';
    // Transformações para vídeos (qualidade e formato automáticos)
    const videoTransformations = 'q_auto,f_auto';

    if (type === 'image') {
      return url.replace('/upload/', `/upload/${imageTransformations}/`);
    }
    if (type === 'video') {
      return url.replace('/upload/', `/upload/${videoTransformations}/`);
    }
    return url;
  };


  // 1. Mostra "Carregando..." enquanto o fetch está em andamento
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><h2>Carregando projeto...</h2></div>;
  }

  // 2. Após o fetch, se o projeto não foi encontrado, mostra a mensagem de erro
  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Projeto não encontrado!</h2>
        <Link to="/" className="btn">Voltar para a Home</Link>
      </div>
    );
  }

  const formattedDate = new Date(project.publicationDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const currentMedia = media[currentIndex];

  // 3. Se tudo correu bem, renderiza a página do projeto
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h2>{project.title}</h2>
              {project.publicationDate && <time className="card-date" style={{ fontSize: '1rem', marginTop: '10px' }}>{formattedDate}</time>}
            </div>
            <p className="muted" dangerouslySetInnerHTML={{ __html: project.details.fullDescription }}></p>
            <div className="cards-grid" id="card-detail" style={{ marginTop: '24px' }}>
              {media.map((item, index) => (
                <div key={index} className="card-media-container" onClick={() => openModal(index)}>
                  {item.type === 'image' ? (
                    <img className="card-img" src={getOptimizedMediaUrl(item.url, 'image')} alt={`Mídia ${index + 1} do projeto`} />
                  ) : (
                    <video className="card-video" src={getOptimizedMediaUrl(item.url, 'video')}></video>
                  )}
                  <div className="overlay">
                    <span>{item.type === 'image' ? '🔎' : '▶'}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.codeUrl && <a className="btn" href={project.codeUrl} target="_blank" rel="noopener noreferrer">Ver código no GitHub</a>}
              {project.linkPreview && <a className="btn" href={project.linkPreview} target="_blank" rel="noopener noreferrer">Ver página</a>}
              {project.details.pdfUrl && <a className="btn btn-outline" href={project.details.pdfUrl} target="_blank" rel="noopener noreferrer">Ver Relatório Completo (PDF)</a>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={closeModal} media={currentMedia} onNext={goToNext} onPrevious={goToPrevious} hasNext={currentIndex < media.length - 1} hasPrevious={currentIndex > 0} />}
    </>
  );
};

export default ProjectDetail;