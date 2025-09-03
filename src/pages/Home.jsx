// src/pages/Home.jsx
import React from 'react';
import Header from '../components/Header.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Footer from '../components/footer.jsx';
import { projects } from '../data/projects.js';

const Home = () => {
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
                src="https://avatars.githubusercontent.com/u/119147905?v=4"
                alt="Foto de João Paulo Souza"
                className="profile-img"
              />
              <div className="sobre-texto">
                <p>
                  Olá! Sou o <strong>João Paulo Souza</strong>, desenvolvedor Full Stack apaixonado por tecnologia, educação e projetos open source.
                </p>
                <p>
                  Trabalho principalmente com <strong>Node.js</strong>, <strong>React</strong> e <strong>TypeScript</strong>. Sempre buscando novos conhecimentos para aprimorar minhas habilidades e contribuir em projetos desafiadores.
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
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;