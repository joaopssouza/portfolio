// src/components/Modal.jsx
import React, { useEffect, useState, useRef } from 'react';

const Modal = ({ isOpen, onClose, media, onNext, onPrevious, hasNext, hasPrevious }) => {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imgDimensions, setImgDimensions] = useState({ naturalWidth: 0, naturalHeight: 0, displayWidth: 0, displayHeight: 0 });

  const imageRef = useRef(null);
  const zoomFactor = 1;
  const magnifierSize = 200;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight, width, height } = imageRef.current;
      setImgDimensions({ naturalWidth, naturalHeight, displayWidth: width, displayHeight: height });
    }
  };
  
  // Reseta as dimensões da imagem quando a mídia muda para evitar bugs
  useEffect(() => {
    setImgDimensions({ naturalWidth: 0, naturalHeight: 0, displayWidth: 0, displayHeight: 0 });
  }, [media]);


  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { top, left } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setShowMagnifier(true);
  const handleMouseLeave = () => setShowMagnifier(false);

  const backgroundX = -((mousePosition.x / imgDimensions.displayWidth) * imgDimensions.naturalWidth * zoomFactor - magnifierSize / 2);
  const backgroundY = -((mousePosition.y / imgDimensions.displayHeight) * imgDimensions.naturalHeight * zoomFactor - magnifierSize / 2);

  const magnifierStyle = {
    top: `${mousePosition.y - magnifierSize / 2}px`,
    left: `${mousePosition.x - magnifierSize / 2}px`,
    width: `${magnifierSize}px`,
    height: `${magnifierSize}px`,
    backgroundImage: `url(${media?.url})`,
    backgroundSize: `${imgDimensions.naturalWidth * zoomFactor}px ${imgDimensions.naturalHeight * zoomFactor}px`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`,
    display: showMagnifier && imgDimensions.naturalWidth > 0 ? 'block' : 'none',
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {hasPrevious && <button className="modal-nav prev" onClick={(e) => { e.stopPropagation(); onPrevious(); }}>&#10094;</button>}
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {media?.type === 'image' && (
          <div 
            className="image-zoom-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imageRef}
              src={media.url}
              alt="Visualização ampliada"
              onLoad={handleImageLoad}
            />
            <div className="magnifying-glass" style={magnifierStyle}></div>
          </div>
        )}
        
        {media?.type === 'video' && (
          <video key={media.url} className="modal-video" src={media.url} controls autoPlay />
        )}
      </div>

      {hasNext && <button className="modal-nav next" onClick={(e) => { e.stopPropagation(); onNext(); }}>&#10095;</button>}
    </div>
  );
};

export default Modal;