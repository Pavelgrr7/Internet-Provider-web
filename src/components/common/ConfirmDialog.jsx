import React from 'react';
import Modal from '../modal/Modal';
import '../../styles/ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, children }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="confirm-dialog">
                <h2>{title}</h2>
                <div className="confirm-content">
                    {children}
                </div>
                <div className="form-actions">
                    <button onClick={onClose} className="btn btn-secondary">Отмена</button>
                    <button onClick={onConfirm} className="btn btn-danger">Продолжить</button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;