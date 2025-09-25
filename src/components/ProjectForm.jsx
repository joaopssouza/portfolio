// src/components/ProjectForm.jsx
import React, { useState, useEffect } from 'react';

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '75vh', overflowY: 'auto', padding: '10px' },
  label: { fontWeight: '600', marginBottom: '4px', color: '#c9d1d9' },
  input: { width: '100%', padding: '10px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#c9d1d9', borderRadius: '6px' },
  textarea: { minHeight: '120px', resize: 'vertical' },
  button: { cursor: 'pointer', backgroundColor: '#58a6ff', color: '#0d1117', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '1rem' },
  fileInput: { fontSize: '0.9rem' },
  fieldGroup: { border: '1px solid #30363d', borderRadius: '8px', padding: '16px' },
  mediaPreviewContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' },
  mediaThumbnail: { position: 'relative', width: '100px', height: '100px' },
  media: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' },
  pdfThumbnail: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#21262d', color: '#c9d1d9', fontSize: '0.8rem', textAlign: 'center', padding: '5px', boxSizing: 'border-box' },
  deleteButton: { position: 'absolute', top: '-5px', right: '-5px', background: '#da3633', color: 'white', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }
};

const initialProjectState = {
  id: '', title: '', description: '', imageUrl: '', projectUrl: '', codeUrl: '',
  publicationDate: '', linkPreview: '',
  details: { fullDescription: '', images: [], videos: [], pdfUrl: '' }
};

// Função para extrair o public_id da URL do Cloudinary
const getPublicIdFromUrl = (url) => {
    try {
        const regex = /\/upload\/(?:v\d+\/)?(?:portifolio\/projects\/)?([^\.]+)/;
        const match = url.match(regex);
        return match ? `portifolio/projects/${match[1]}` : null;
    } catch {
        return null;
    }
};

const ProjectForm = ({ projectToEdit, onSave, onCancel }) => {
  const [project, setProject] = useState(initialProjectState);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      const initialData = {
        ...initialProjectState,
        ...projectToEdit,
        details: { ...initialProjectState.details, ...(projectToEdit.details || {}) }
      };
      setProject(initialData);
    } else {
      setProject(initialProjectState);
    }
    setMediaFiles([]);
    setPdfFile(null);
    setMediaToDelete([]);
  }, [projectToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('details.')) {
      const detailField = name.split('.')[1];
      setProject(prev => ({ ...prev, details: { ...prev.details, [detailField]: value } }));
    } else {
      setProject(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaChange = (e) => setMediaFiles(Array.from(e.target.files));
  const handlePdfChange = (e) => setPdfFile(e.target.files[0]);

  const handleDeleteMedia = (urlToDelete, mediaType) => {
    const publicId = getPublicIdFromUrl(urlToDelete);
    if (publicId) {
      setMediaToDelete(prev => [...prev, publicId]);
    }

    if (mediaType === 'image') {
      setProject(prev => ({ ...prev, details: { ...prev.details, images: prev.details.images.filter(url => url !== urlToDelete) }}));
    } else if (mediaType === 'video') {
      setProject(prev => ({ ...prev, details: { ...prev.details, videos: prev.details.videos.filter(url => url !== urlToDelete) }}));
    } else if (mediaType === 'pdf') {
      setProject(prev => ({ ...prev, details: { ...prev.details, pdfUrl: '' }}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let uploadedMediaUrls = { images: project.details.images || [], videos: project.details.videos || [] };
    let uploadedPdfUrl = project.details.pdfUrl || '';

    const filesToUpload = [...mediaFiles];
    if (pdfFile) filesToUpload.push(pdfFile);

    if (filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach(file => formData.append('media', file));

      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Falha no upload das mídias.');
        
        // *** AJUSTE AQUI: Processar a nova resposta da API ***
        data.urls.forEach(fileInfo => {
          if (fileInfo.resourceType === 'video') {
            uploadedMediaUrls.videos.push(fileInfo.url);
          } else { // Imagens e PDFs são tratados como 'image' pelo Cloudinary
            if (fileInfo.url.endsWith('.pdf')) {
                uploadedPdfUrl = fileInfo.url;
            } else {
                uploadedMediaUrls.images.push(fileInfo.url);
            }
          }
        });

      } catch (error) {
        console.error("Erro no upload:", error);
        alert(`Ocorreu um erro ao enviar as mídias: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
    }

    const finalProjectData = {
      ...project,
      details: {
        ...project.details,
        images: uploadedMediaUrls.images,
        videos: uploadedMediaUrls.videos,
        pdfUrl: uploadedPdfUrl,
      },
      mediaToDelete,
    };
    
    onSave(finalProjectData);
    setIsSubmitting(false);
  };
  
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* Grupos de campos existentes */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>ID (Slug)</label>
        <input style={styles.input} type="text" name="id" value={project.id} onChange={handleChange} required placeholder="ex: meu-projeto-incrivel" />
        <label style={styles.label}>Título</label>
        <input style={styles.input} type="text" name="title" value={project.title} onChange={handleChange} required />
        <label style={styles.label}>Data de Publicação</label>
        <input style={styles.input} type="date" name="publicationDate" value={project.publicationDate.split('T')[0]} onChange={handleChange} required />
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

      {/* Seção de Mídias Atualizada */}
      <div style={styles.fieldGroup}>
        <label style={styles.label}>Descrição Completa (HTML permitido)</label>
        <textarea style={{...styles.input, ...styles.textarea}} name="details.fullDescription" value={project.details.fullDescription} onChange={handleChange} />
        
        <label style={styles.label}>Adicionar Imagens e Vídeos</label>
        <input style={{...styles.input, ...styles.fileInput}} type="file" multiple onChange={handleMediaChange} accept="image/*,video/*" />
        <small>As novas mídias serão adicionadas às existentes.</small>

        <label style={styles.label} htmlFor="pdf-upload">Enviar Relatório (PDF)</label>
        <input id="pdf-upload" style={{...styles.input, ...styles.fileInput}} type="file" onChange={handlePdfChange} accept=".pdf" />
        {project.details.pdfUrl && !pdfFile && <small>O envio de um novo arquivo substituirá o PDF existente.</small>}

        {/* Preview das Mídias */}
        <div style={styles.mediaPreviewContainer}>
          {project.details.images.map(url => (
            <div key={url} style={styles.mediaThumbnail}>
              <img src={url.replace('/upload/', '/upload/w_100,h_100,c_fill/')} alt="Preview" style={styles.media} />
              <button type="button" onClick={() => handleDeleteMedia(url, 'image')} style={styles.deleteButton}>X</button>
            </div>
          ))}
          {project.details.videos.map(url => (
            <div key={url} style={styles.mediaThumbnail}>
              <video src={url.replace('/upload/', '/upload/w_100,h_100,c_fill,so_0/')} style={styles.media} />
              <button type="button" onClick={() => handleDeleteMedia(url, 'video')} style={styles.deleteButton}>X</button>
            </div>
          ))}
          {project.details.pdfUrl && (
            <div style={{...styles.mediaThumbnail, ...styles.pdfThumbnail}}>
              <span>📄</span>
              <span style={{wordBreak: 'break-word'}}>{project.details.pdfUrl.split('/').pop()}</span>
              <button type="button" onClick={() => handleDeleteMedia(project.details.pdfUrl, 'pdf')} style={styles.deleteButton}>X</button>
            </div>
          )}
        </div>
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