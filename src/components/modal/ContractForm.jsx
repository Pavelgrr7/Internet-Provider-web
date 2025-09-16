// src/components/ContractForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

// onBack - для кнопки "Назад" в визарде
const ContractForm = ({ onCancel, onSubmit, onBack, initialData = {} }) => {
    const { user } = useContext(AuthContext);

    // Начальное состояние формы
    const [formData, setFormData] = useState({
        contractNumber: initialData?.contractNumber || '',
        serviceAddress: initialData?.serviceAddress || '',
        tariffId: initialData?.tariffId || '',
        serviceIds: initialData?.serviceIds || [],
        signingDate: initialData?.signingDate || new Date().toISOString().split('T')[0],
        serviceStartDate: initialData?.serviceStartDate || new Date().toISOString().split('T')[0],
    });

    const [tariffs, setTariffs] = useState([]);


    const [availableServices, setAvailableServices] = useState([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);

    useEffect(() => {
        if (user?.token) {
            const fetchTariffs = async () => {
                    const response = await fetch(`http://127.0.0.1:8080/api/tariffs`, {
                        headers: {'Authorization': `Bearer ${user.token}`}
                    });
                    const data = await response.json();
                    setTariffs(data);
            };
            fetchTariffs();
            const tariffId = formData.tariffId;
            if (tariffId) {
                setIsLoadingServices(true);
                const fetchServices = async () => {
                    const response = await fetch(`http://127.0.0.1:8080/api/tariffs/${tariffId}/available-services`, {
                        headers: { 'Authorization': `Bearer ${user.token}` }
                    });
                    const data = await response.json();
                    setAvailableServices(data);
                    setIsLoadingServices(false);
                };
                fetchServices();
            } else {
                setAvailableServices([]);
            }
        }
    }, [formData.tariffId, user]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleTariffChange = (e) => {
        const newTariffId = e.target.value;
        setFormData(prev => ({
            ...prev,
            tariffId: newTariffId,
            serviceIds: []
        }));
    };

    const handleServiceToggle = (serviceId) => {
        console.log(`--- handleServiceToggle ---`);
        console.log(`Тип serviceId: ${typeof serviceId}, Значение: ${serviceId}`);

        setFormData(prev => {
            console.log(`Старый массив serviceIds:`, prev.serviceIds);
            const currentServiceIds = prev.serviceIds || [];
            const newServiceIds = currentServiceIds.includes(serviceId)
                ? currentServiceIds.filter(id => id !== serviceId)
                : [...currentServiceIds, serviceId];

            console.log(`Новый массив serviceIds:`, newServiceIds);
            return { ...prev, serviceIds: newServiceIds };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // все данные формы
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Шаг 2: Данные договора</h2>
            <p className="form-info">Номер договора будет сгенерирован автоматически.</p>

            <div className="form-group">
                <label htmlFor="serviceAddress">Адрес</label>
                <input id="serviceAddress" type="text" value={formData.serviceAddress} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="tariffId">Тариф</label>
                <select id="tariffId" value={formData.tariffId} onChange={handleTariffChange} required>
                    <option value="" disabled>Выберите тариф...</option>
                    {tariffs.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
            {formData.tariffId && (
                <div className="form-group services-selection-group">
                    <label>Дополнительные услуги</label>
                    {isLoadingServices ? (
                        <p>Загрузка услуг...</p>
                    ) : availableServices.length > 0 ? (
                        <div className="checkbox-list">
                            {availableServices.map(service => {
                                const isChecked = formData.serviceIds.includes(service.serviceId);
                                if (isChecked) {
                                    console.log(`Чекбокс для услуги ID ${service.serviceId} (${service.serviceName}) отмечен. Проверка: formData.serviceIds (${JSON.stringify(formData.serviceIds)}) включает ${service.serviceId}? -> ${isChecked}`);
                                }

                                return (
                                <div key={service.serviceId}>
                                    <input
                                        type="checkbox"
                                        id={`service-${service.serviceId}`}
                                        checked={formData.serviceIds.includes(service.serviceId)}
                                        onChange={() => handleServiceToggle(service.serviceId)}
                                    />
                                    <label htmlFor={`service-${service.serviceId}`}>
                                        {service.serviceName} ({service.cost} руб.)
                                    </label>
                                </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="form-info">К выбранному тарифу нельзя подключить доп. услуги.</p>
                    )}
                </div>
            )}
            <div className="form-group">
                <label htmlFor="signingDate">Дата подписания</label>
                <input id="signingDate" type="date" value={formData.signingDate} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="serviceStartDate">Начало предоставления услуги</label>
                <input id="serviceStartDate" type="date" value={formData.serviceStartDate} onChange={handleInputChange} required />
            </div>
            <div className="form-actions">
                {onBack && <button type="button" onClick={onBack} className="btn btn-tertiary">Назад</button>}
                <button type="button" onClick={onCancel} className="btn btn-secondary">Отмена</button>
                <button type="submit" className="btn btn-primary">Завершить</button>
            </div>
        </form>
    );
};

export default ContractForm;