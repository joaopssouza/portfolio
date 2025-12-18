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

const ProjectForm = ({ projectToEdit, onSave, onCancel }) => {
  const [project, setProject] = useState(initialProjectState);
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (projectToEdit) {
      setProject({ ...initialProjectState, ...projectToEdit, details: { ...initialProjectState.details, ...(projectToEdit.details || {}) } });
    } else {
      setProject(initialProjectState);
    }
    setNewMediaFiles([]);
    setUploadProgress(0);
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

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file: file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : (file.type === 'application/pdf' ? 'pdf' : 'image')
    }));
    setNewMediaFiles(prev => [...prev, ...previews]);
  };

  const handleDeleteMedia = async (urlToDelete, mediaType, isNew = false) => {
    if (isNew) {
      setNewMediaFiles(files => files.filter(f => f.url !== urlToDelete));
      URL.revokeObjectURL(urlToDelete);
      return;
    }

    if (!projectToEdit._id || !confirm('Deseja excluir esta mídia permanentemente do servidor? A ação não pode ser desfeita.')) {
      return;
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: projectToEdit._id,
          mediaUrlToRemove: urlToDelete,
          mediaType: mediaType
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      if (mediaType === 'pdf') {
        setProject(p => ({ ...p, details: { ...p.details, pdfUrl: '' } }));
      } else {
        const field = mediaType === 'image' ? 'images' : 'videos';
        setProject(p => ({ ...p, details: { ...p.details, [field]: p.details[field].filter(url => url !== urlToDelete) } }));
      }
      alert('Mídia excluída com sucesso!');
    } catch (error) {
      console.error("Erro ao excluir mídia:", error);
      alert(`Falha ao excluir a mídia: ${error.message}`);
    }
  };

  // Função auxiliar para upload direto (Client-Side) com XHR para progresso
  const uploadFileToCloudinary = (file, projectId, onProgress) => {
    return new Promise(async (resolve, reject) => {
      try {
        const isVideo = file.type.startsWith('video/');
        const fileType = isVideo ? 'video' : 'image';

        // 1. Obter assinatura
        const signResponse = await fetch('/api/sign-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folder: `portifolio/projects/${projectId}`,
            type: fileType
          })
        });

        if (!signResponse.ok) throw new Error('Falha ao obter permissão de upload');

        const { signature, timestamp, apiKey, cloudName, eager } = await signResponse.json();

        // 2. Preparar FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', `portifolio/projects/${projectId}`);

        if (eager) {
          formData.append('eager', eager);
          formData.append('eager_async', 'true');
        }
        formData.append('resource_type', 'auto');

        // 3. Upload via XMLHttpRequest para monitorar progresso
        const xhr = new XMLHttpRequest();
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'auto'}/upload`;

        xhr.open('POST', cloudinaryUrl, true);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            onProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error?.message || 'Erro no upload para Cloudinary'));
          }
        };

        xhr.onerror = () => reject(new Error('Erro de rede no upload'));

        xhr.send(formData);

      } catch (err) {
        reject(err);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    let projectDataForSave = JSON.parse(JSON.stringify(project));

    try {
      if (newMediaFiles.length > 0) {
        const targetProjectId = projectDataForSave.id;

        // Gerenciamento de progresso múltiplo
        const totalFiles = newMediaFiles.length;
        const progressValues = new Array(totalFiles).fill(0);

        const updateOverallProgress = (index, value) => {
          progressValues[index] = value;
          const total = progressValues.reduce((acc, curr) => acc + curr, 0);
          setUploadProgress(total / totalFiles);
        };

        const uploadPromises = newMediaFiles.map((media, index) =>
          uploadFileToCloudinary(media.file, targetProjectId, (percent) => updateOverallProgress(index, percent))
        );

        const uploadResults = await Promise.all(uploadPromises);

        // Preenche info no form apenas após sucesso
        setUploadProgress(100); // Garante 100% no final

        uploadResults.forEach(data => {
          const secureUrl = data.secure_url;
          const isPdf = data.format === 'pdf' || data.original_filename?.endsWith('.pdf');
          const isVideo = data.resource_type === 'video';

          if (isVideo) {
            // Salva a versão .webm que foi gerada pela transformação eager
            const webmUrl = secureUrl.replace(/\.[^/.]+$/, ".webm");
            projectDataForSave.details.videos.push(webmUrl);
          } else if (isPdf) {
            projectDataForSave.details.pdfUrl = secureUrl;
          } else {
            projectDataForSave.details.images.push(secureUrl);
          }
        });

        setNewMediaFiles([]);
      }

      projectDataForSave.projectUrl = `/projeto/${projectDataForSave.id}`;
      await onSave(projectDataForSave);

    } catch (error) {
      console.error("Erro processando projeto:", error);
      alert(`Ocorreu um erro: ${error.message}`);
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allMediaPreviews = [
    ...project.details.images.map(url => ({ url, type: 'image', isNew: false })),
    ...project.details.videos.map(url => ({ url, type: 'video', isNew: false })),
    ...(project.details.pdfUrl ? [{ url: project.details.pdfUrl, type: 'pdf', isNew: false }] : []),
    ...newMediaFiles.map(f => ({ ...f, isNew: true }))
  ];

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.fieldGroup}>
        <label style={styles.label}>ID (Slug)</label>
        <input style={styles.input} type="text" name="id" value={project.id} onChange={handleChange} required placeholder="ex: meu-projeto-incrivel" />
        <label style={styles.label}>Título</label>
        <input style={styles.input} type="text" name="title" value={project.title} onChange={handleChange} required />
        <label style={styles.label}>Data de Publicação</label>
        <input style={styles.input} type="date" name="publicationDate" value={project.publicationDate.split('T')[0]} onChange={handleChange} required />
        <label style={styles.label}>Descrição Curta (para o card)</label>
        <textarea style={{ ...styles.input, ...styles.textarea }} name="description" value={project.description} onChange={handleChange} required />
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
        <textarea style={{ ...styles.input, ...styles.textarea }} name="details.fullDescription" value={project.details.fullDescription} onChange={handleChange} />

        <label style={styles.label}>Adicionar Imagens, Vídeos e PDF</label>
        <input style={{ ...styles.input, ...styles.fileInput }} type="file" multiple onChange={handleMediaChange} accept="image/*,video/*,application/pdf" />

        <div style={styles.mediaPreviewContainer}>
          {allMediaPreviews.map(media => (
            <div key={media.url} style={styles.mediaThumbnail}>
              {media.type === 'image' && <img src={media.url} alt="Preview" style={styles.media} crossOrigin="anonymous" />}
              {media.type === 'video' && <video src={media.url} style={styles.media} />}
              {media.type === 'pdf' && (
                <div style={{ ...styles.mediaThumbnail, ...styles.pdfThumbnail }}>
                  <span>📄</span>
                  <span style={{ wordBreak: 'break-word' }}>{media.isNew ? media.file.name : media.url.split('/').pop()}</span>
                </div>
              )}
              <button type="button" onClick={() => handleDeleteMedia(media.url, media.type, media.isNew)} style={styles.deleteButton}>X</button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px', flexDirection: 'column' }}>
        {isSubmitting && (
          <div style={{ width: '100%', background: '#21262d', borderRadius: '4px', overflow: 'hidden', height: '10px' }}>
            <div
              style={{
                width: `${uploadProgress}%`,
                background: '#58a6ff',
                height: '100%',
                transition: 'width 0.2s ease'
              }}
            />
            <div style={{ color: '#8b949e', fontSize: '0.8rem', textAlign: 'right', marginTop: '4px' }}>
              {Math.round(uploadProgress)}%
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel} style={{ ...styles.button, backgroundColor: '#30363d', color: '#c9d1d9' }}>Cancelar</button>
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Salvar Projeto'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProjectForm;