import { useEffect } from 'react';
import './FormModal.css';

const FormModal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div 
        className={`form-modal form-modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-modal-header">
          <h2 className="form-modal-title">{title}</h2>
          <button className="form-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="form-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormModal;
