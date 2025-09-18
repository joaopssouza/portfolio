// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Footer from '../components/Footer.jsx';
import Pagination from '../components/Pagination.jsx';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;

  useEffect(() => {
    // Busca os projetos da nossa nova API
    fetch('/api/projects.json')
      .then(res => res.json())
      .then(data => {
        // Ordena os projetos pela data de publicação, do mais recente para o mais antigo
        const sortedProjects = data.sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
        setProjects(sortedProjects);
      })
      .catch(err => console.error("Failed to fetch projects:", err));
  }, []);
  // 3. Lógica da paginação
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  // Fatia o array de projetos para pegar apenas os da página atual
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  // Calcula o número total de páginas
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // 4. Função para mudar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Opcional: Rola a tela para o topo da seção de projetos
    const projectsSection = document.getElementById('projetos');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <>
      <Header />
      <main>
        {/* Seção Sobre Mim */}
        <section id="sobre" className="section">
          <div className="container">
            <h2>Sobre mim</h2>
            <div className="sobre-conteudo">
              <img
                src="https://res.cloudinary.com/dhqdkgtee/image/upload/w_200,q_auto,f_auto/v1757854155/119147905_jmprxw.jpg"
                alt="Foto de João Paulo"
                className="profile-img"
              />
              <div className="sobre-texto">
                <p>
                  Olá! Sou o <strong>João Paulo</strong>, Mineiro apaixonado por tecnologia e desenvolvimento web, Tenho experiência com HTML, CSS e JavaScript, React, GO. Estou cursando Superior em Engenharia de Software e Técnico de Informática para Internet.
                </p>
                <p>
                  Acredito que a gente lida com a vida de forma lógica. Fora do código, gosto de corrida de rua, cultura POP e conhecer novas culturas — cada experiência me torna um desenvolvedor mais criativo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Projetos */}
        <section id="projetos" className="section">
          <div className="container">
            <h2>Projetos</h2>
            <div className="cards-grid">
              {currentProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} isLCP={index === 0 && currentPage === 1} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;