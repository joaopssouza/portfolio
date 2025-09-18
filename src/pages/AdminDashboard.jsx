// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal'; // Usaremos o componente Modal existente
import ProjectForm from '../components/ProjectForm'; // Importamos nosso novo formulário

const styles = {
  dashboardContainer: { maxWidth: '1200px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', backgroundColor: '#161b22', color: '#c9d1d9', borderRadius: '12px', border: '1px solid #30363d' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #30363d' },
  headerTitle: { color: '#58a6ff', margin: 0 },
  button: { display: 'inline-block', border: '1px solid #30363d', cursor: 'pointer', backgroundColor: '#21262d', color: '#c9d1d9', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', transition: 'all .2s ease' },
  buttonPrimary: { backgroundColor: '#58a6ff', color: '#0d1117', borderColor: '#58a6ff' },
  projectTable: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  tableHead: { borderBottom: '1px solid #30363d', textAlign: 'left' },
  tableCell: { padding: '12px 8px', verticalAlign: 'middle' },
  tableRow: { borderBottom: '1px solid #30363d' },
  actionsCell: { display: 'flex', gap: '10px' }
};


const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = () => {
    setIsLoading(true);
    fetch('/api/projects.json')
      .then(res => res.json())
      .then(data => {
        setProjects(data); // A API já está retornando ordenado
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Falha ao buscar projetos:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project = null) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleSaveProject = async (projectData) => {
    const isEditing = !!projectData._id;
    const url = '/api/projects';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao salvar o projeto.');
      }
      
      closeModal();
      fetchProjects(); // Recarrega a lista de projetos
      alert(`Projeto ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);

    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      alert(`Erro: ${error.message}`);
    }
  };
  
  const handleDeleteProject = async (project) => {
    const confirmation = prompt(`Para excluir, digite o ID do projeto: "${project.id}"`);
    if (confirmation === project.id) {
      try {
        const response = await fetch(`/api/projects?_id=${project._id}`, { method: 'DELETE' });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error);
        
        fetchProjects(); // Recarrega a lista
        alert('Projeto excluído com sucesso!');
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert(`Erro ao excluir: ${error.message}`);
      }
    } else if (confirmation !== null) {
      alert('O ID digitado não corresponde. A exclusão foi cancelada.');
    }
  };
  
  // O componente Modal precisa ser adaptado para conteúdo genérico, não apenas mídia
  const renderModalContent = () => (
    <div style={{ background: '#161b22', padding: '25px', borderRadius: '12px', width: '90vw', maxWidth: '800px' }}>
      <h2 style={{ color: '#58a6ff', marginTop: 0, marginBottom: '20px' }}>
        {selectedProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
      </h2>
      <ProjectForm 
        projectToEdit={selectedProject}
        onSave={handleSaveProject}
        onCancel={closeModal}
      />
    </div>
  );

  if (isLoading) {
    return <div style={styles.dashboardContainer}><h2>Carregando projetos...</h2></div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Painel de Administração</h1>
        <button onClick={() => openModal()} style={{ ...styles.button, ...styles.buttonPrimary }}>
          Adicionar Projeto
        </button>
      </header>

      <main>
        <h2>Meus Projetos</h2>
        <table style={styles.projectTable}>
           <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableCell}>Título</th>
              <th style={styles.tableCell}>Data de Publicação</th>
              <th style={styles.tableCell}>ID</th>
              <th style={styles.tableCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{project.title}</td>
                <td style={styles.tableCell}>
                  {new Date(project.publicationDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </td>
                <td style={styles.tableCell}>{project.id}</td>
                <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                  <button onClick={() => openModal(project)} style={styles.button}>
                    Editar
                  </button>
                  <button onClick={() => handleDeleteProject(project)} style={styles.button}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeModal}>&times;</button>
                {renderModalContent()}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;