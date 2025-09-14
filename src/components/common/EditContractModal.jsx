import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';

const EditContractModal = ({ isOpen, onClose, contract, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (contract) {
            setFormData({
                contractNumber: contract.contractNumber || '',
                serviceAddress: contract.serviceAddress || '',
            });
        }
    }, [contract]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Вызываем родительскую функцию сохранения
        onSave(contract.id, formData);
    };

    if (!isOpen || !contract) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <h2>Редактирование договора №{contract.contractNumber}</h2>

                <div className="form-group">
                    <label htmlFor="contractNumber">Номер договора</label>
                    <input id="contractNumber" type="text" value={formData.contractNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="serviceAddress">Адрес предоставления услуги</label>
                    <input id="serviceAddress" type="text" value={formData.serviceAddress} onChange={handleInputChange} />
                </div>

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary">Отмена</button>
                    <button type="submit" className="btn btn-primary">Сохранить</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditContractModal;