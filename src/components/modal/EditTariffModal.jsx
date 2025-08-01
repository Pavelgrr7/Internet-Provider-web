import React, { useState, useEffect } from 'react';
import '../../styles/EditTariffModal.css';
import Modal from '../modal/Modal.jsx';

const EditTariffModal = ({ isOpen, onClose, tariff, onSave, onDeleteService, onChangeService, onAddService}) => {
    const [formData, setFormData] = useState({});

    const [activeTab, setActiveTab] = useState('main');

    const [availableServices, setAvailableServices] = useState([]);

    // Когда компонент получает новый тариф для редактирования, обновляем состояние формы
    useEffect(() => {
        if (tariff) {
            setFormData({
                name: tariff.name || '',
                declaredSpeed: tariff.declaredSpeed || '',
                installationFee: tariff.installationFee || 0,
                ipAddressType: tariff.ipAddressType || 'Динамический',
                startDate: tariff.startDate || '',
            });
            setAvailableServices(tariff.availableServices || []);
            setActiveTab('main');
        }
    }, [tariff]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(tariff.id, formData);
    };

    if (!isOpen) return null;

    const handleEditService = (serviceId) => {
        console.log("Редактировать услугу", serviceId);
        onChangeService(tariff.id, serviceId)
    }

    const handleDeleteService = async (serviceId) => {
        console.log("Удалить услугу", serviceId);
        onDeleteService(tariff.id, serviceId);
    }

    const handleAddService = (serviceName, serviceCost) => {
        console.log("Добавить услугу", serviceName);
        onAddService(tariff.id, serviceName, serviceCost)
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Редактирование тарифа: {tariff.name}</h2>

            <div className="modal-tabs">
                <button
                    className={`tab-button ${activeTab === 'main' ? 'active' : ''}`}
                    onClick={() => setActiveTab('main')}
                >
                    Основные свойства
                </button>
                <button
                    className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
                    onClick={() => setActiveTab('services')}
                >
                    Доступные услуги ({availableServices.length})
                </button>
            </div>

            <div className="modal-tab-content">
                {activeTab === 'main' && (
                    <form onSubmit={handleSubmit} id="editTariffForm">
                            <div className="form-group">
                                <label htmlFor="name">Название</label>
                                <input id="name" type="text" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="declaredSpeed">Скорость (Мбит/с</label>
                                <input id="declaredSpeed" type="text" value={formData.declaredSpeed} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="installationFee">Стоимость (руб/мес)</label>
                                <input id="installationFee" type="number" value={formData.installationFee} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="installationFee">Тип IP-адреса</label>
                                <input id="ipAddressType" type="text" value={formData.ipAddressType} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="installationFee">Дата начала действия</label>
                                <input id="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={onClose} className="btn btn-secondary">Отмена</button>
                                <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                            </div>
                    </form>
                )}

                {activeTab === 'services' && (
                    <div className="services-management">
                        <ul className="services-list-modal">
                            {availableServices.map(service => (
                                <li key={service.serviceId}>
                                    <span>{service.serviceName} ({service.cost.toFixed(2)} руб.)</span>
                                    <button onClick={() => handleDeleteService(service.serviceId)} className="btn btn-delete">Удалить</button>
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-primary" onClick={handleAddService}>Добавить услугу</button>
                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn btn-secondary">Отмена</button>
                            <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                        </div>
                    </div>
                )}
            </div>

            {/*<div className="form-actions">*/}
            {/*    <button type="button" onClick={onClose} className="btn btn-secondary">Отмена</button>*/}
            {/*    <button type="submit" form="editTariffForm" className="btn btn-primary">Сохранить изменения</button>*/}
            {/*</div>*/}
        </Modal>
    );
};

export default EditTariffModal;