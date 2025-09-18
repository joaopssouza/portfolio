// src/components/ProjectForm.jsx
import React, { useState, useEffect } from 'react';

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto', padding: '10px' },
  label: { fontWeight: '600', marginBottom: '4px', color: '#c9d1d9' },
  input: { width: '100%', padding: '10px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px' },
  textarea: { minHeight: '120px', resize: 'vertical' },
  button: { cursor: 'pointer', backgroundColor: '#58a6ff', color: '#0d1117', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem' },
  fileInput: { fontSize: '0.9rem' },
  fieldGroup: { border: '1px solid #30363d', borderRadius: '8px', padding: '16px' }
};

const initialProjectState = {
  id: '', title: '', description: '', imageUrl: '', projectUrl: '', codeUrl: '',
  publicationDate: '', linkPreview: '',
  details: { fullDescription: '', images: [], videos: [], pdfUrl: '' }
};

const ProjectForm = ({ projectToEdit, onSave, onCancel }) => {
  const [project, setProject] = useState(initialProjectState);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      // Garante que a estrutura de 'details' exista para evitar erros
      const initialData = {
        ...initialProjectState,
        ...projectToEdit,
        details: {
          ...initialProjectState.details,
          ...(projectToEdit.details || {})
        }
      };
      setProject(initialData);
    } else {
      setProject(initialProjectState);
    }
  }, [projectToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const detailField = name.split('.')[1];
      setProject(prev => ({
        ...prev,
        details: { ...prev.details, [detailField]: value }
      }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let uploadedMediaUrls = { images: project.details.images || [], videos: project.details.videos || [] };

    // 1. Faz o upload de novas mídias se houver
    if (mediaFiles.length > 0) {
      const formData = new FormData();
      mediaFiles.forEach(file => formData.append('media', file));

      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
        
        if (!data.success) throw new Error('Falha no upload das mídias.');

        // Separa as URLs por tipo (ex: .mp4, .webm para vídeo)
        data.urls.forEach(url => {
          const isVideo = ['.mp4', '.webm', '.mov'].some(ext => url.endsWith(ext));
          if (isVideo) {
            uploadedMediaUrls.videos.push(url);
          } else {
            uploadedMediaUrls.images.push(url);
          }
        });

      } catch (error) {
        console.error("Erro no upload:", error);
        alert("Ocorreu um erro ao enviar as mídias. Verifique o console.");
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Prepara o payload final do projeto
    const finalProjectData = {
      ...project,
      details: {
        ...project.details,
        images: uploadedMediaUrls.images,
        videos: uploadedMediaUrls.videos,
      }
    };
    
    // 3. Salva o projeto
    onSave(finalProjectData);
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>ID (Slug)</label>
        <input style={styles.input} type="text" name="id" value={project.id} onChange={handleChange} required placeholder="ex: meu-projeto-incrivel" />
        
        <label style={styles.label}>Título</label>
        <input style={styles.input} type="text" name="title" value={project.title} onChange={handleChange} required />
        
        <label style={styles.label}>Data de Publicação</label>
        <input style={styles.input} type="date" name="publicationDate" value={project.publicationDate} onChange={handleChange} required />

        <label style={styles.label}>Descrição Curta (para o card)</label>
        <textarea style={{...styles.input, ...styles.textarea}} name="description" value={project.description} onChange={handleChange} required />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>URL da Imagem Principal (Capa)</label>
        <input style={styles.input} type="url" name="imageUrl" value={project.imageUrl} onChange={handleChange} placeholder="https://res.cloudinary.com/..." />
        
        <label style={styles.label}>URL do Código (GitHub)</label>
        <input style={styles.input} type="url" name="codeUrl" value={project.codeUrl} onChange={handleChange} />
        
        <label style={styles.label}>URL da Página (Preview)</label>
        <input style={styles.input} type="url" name="linkPreview" value={project.linkPreview} onChange={handleChange} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Descrição Completa (HTML permitido)</label>
        <textarea style={{...styles.input, ...styles.textarea}} name="details.fullDescription" value={project.details.fullDescription} onChange={handleChange} />
        
        <label style={styles.label}>URL do PDF</label>
        <input style={styles.input} type="url" name="details.pdfUrl" value={project.details.pdfUrl} onChange={handleChange} />

        <label style={styles.label}>Adicionar Imagens e Vídeos</label>
        <input style={{...styles.input, ...styles.fileInput}} type="file" multiple onChange={handleMediaChange} accept="image/*,video/*" />
        <small>As mídias existentes serão mantidas. As novas serão adicionadas.</small>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button type="button" onClick={onCancel} style={{...styles.button, backgroundColor: '#30363d', color: '#c9d1d9' }}>Cancelar</button>
        <button type="submit" style={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Projeto'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;