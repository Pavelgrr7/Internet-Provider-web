// src/components/CreateTariffModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import Modal from './Modal';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/EditTariffModal.css';

const CreateTariffModal = ({ isOpen, onClose, onCreate }) => {
    const { user } = useContext(AuthContext);

    // Начальные пустые значения для формы
    const initialFormData = {
        name: '',
        declaredSpeed: '',
        installationFee: 0,
        ipAddressType: 'Динамический',
        startDate: new Date().toISOString().split('T')[0],
        serviceIds: [], // Массив для хранения ID выбранных услуг
    };

    const [formData, setFormData] = useState(initialFormData);
    const [activeTab, setActiveTab] = useState('main');

    // Состояние для списка ВСЕХ услуг в системе
    const [allServices, setAllServices] = useState([]);

    // Загружаем все существующие услуги при открытии окна
    useEffect(() => {
        if (isOpen) {
            const fetchAllServices = async () => {
                const response = await fetch('http://127.0.0.1:8080/api/services',
                    {
                        method: 'GET',
                        headers:
                            { 'Authorization': `Bearer ${user.token}`}
                    });
                const data = await response.json();
                setAllServices(data);
            };
            fetchAllServices();
            // Сбрасываем форму при каждом открытии
            setFormData(initialFormData);
            setActiveTab('main');
        }
    }, [isOpen, user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Обработчик для чекбоксов услуг
    const handleServiceToggle = (serviceId) => {
        setFormData(prev => {
            const serviceIds = prev.serviceIds.includes(serviceId)
                ? prev.serviceIds.filter(id => id !== serviceId) // Убрать ID
                : [...prev.serviceIds, serviceId]; // Добавить ID
            return { ...prev, serviceIds };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData); // Передаем весь объект formData
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Создание нового тарифа</h2>

            <div className="modal-tabs">
                <button className={`tab-button ${activeTab === 'main' ? 'active' : ''}`} onClick={() => setActiveTab('main')}>
                    Основные свойства
                </button>
                <button className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
                    Доступные услуги
                </button>
            </div>

            <div className="modal-tab-content">
                <form onSubmit={handleSubmit} id="createTariffForm">
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
                        </form>
                    )}

                    {activeTab === 'services' && (
                        <div className="services-selection">
                            <h4>Выберите услуги, которые будут доступны для этого тарифа:</h4>
                            <ul className="services-list-modal checkbox-list">
                                {allServices.map(service => (
                                    <li key={service.serviceId}>
                                        <input
                                            type="checkbox"
                                            id={`service-${service.serviceId}`}
                                            checked={formData.serviceIds.includes(service.serviceId)}
                                            onChange={() => handleServiceToggle(service.serviceId)}
                                        />
                                        <label htmlFor={`service-${service.serviceId}`}>
                                            {service.serviceName} ({service.cost.toFixed(2)} руб.)
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <button type="button" className="btn btn-secondary">Создать новую услугу</button>
                        </div>
                    )}
                </form>
            </div>

            <div className="form-actions">
                <button type="button" onClick={onClose} className="btn btn-secondary">Отмена</button>
                <button type="submit" form="createTariffForm" className="btn btn-primary">Создать тариф</button>
            </div>
        </Modal>
    );
};

export default CreateTariffModal;