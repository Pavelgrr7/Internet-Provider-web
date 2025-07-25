import React from 'react';
import '../styles/Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        // .modal-overlay - это затемняющий фон
        <div className="modal-overlay" onClick={onClose}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <button className="modal-close-btn" onClick={onClose}>
                </button>

                {children}

            </div>
        </div>
    );
};

export default Modal;