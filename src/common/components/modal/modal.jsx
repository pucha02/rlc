import React from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={className}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
}

export default Modal;
