// src/components/CreateContractModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import Modal from './Modal.jsx';

const CreateContractModal = ({ isOpen, onClose, subscriberId, onContractCreated }) => {
    const { user } = useContext(AuthContext);

    const today = new Date().toISOString().split('T')[0];


    // Состояние для загрузки списка тарифов
    const [tariffs, setTariffs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Загружаем список тарифов, когда модальное окно открывается
    useEffect(() => {
        if (!isOpen || !user?.token) {
            return;
        }

        if (isOpen) {
            const fetchTariffs = async () => {
                console.log(`user is : `, user)

                const response = await fetch('http://127.0.0.1:8080/api/tariffs', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (!response.ok) {

                    const errorData = await response.json();
                    console.error("Сервер вернул ошибку:", errorData);
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                setTariffs(data);
                console.log("Полученные тарифы: ",data);
            };
            fetchTariffs();
        }
    }, [isOpen, user]);

    const [formData, setFormData] = useState({
        contractNumber: '',
        subscriberId:'',
        tariffId: '',
        serviceAddress: '',
        serviceStartDate: today,
        signingDate: today,
        monthlyFee: 0,
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevData => ({ ...prevData, [id]: value }));
    };

    const handleTariffChange = (e) => {
        const newTariffId = e.target.value;
        const selectedTariff = tariffs.find(tariff => tariff.id == newTariffId);

        setFormData(prevData => ({
            ...prevData,
            tariffId: newTariffId,
            monthlyFee: selectedTariff ? selectedTariff.installationFee : 0
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const requestBody = {
            subscriberId,
            tariffId: formData.tariffId,
            contractNumber: formData.contractNumber,
            serviceAddress: formData.serviceAddress,
            signingDate: new Date().toISOString().split('T')[0],
            serviceStartDate: new Date().toISOString().split('T')[0],
            monthlyFee: formData.monthlyFee,
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/api/contracts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody) // Отправляем данные из состояния
            });
            console.log(requestBody);
            if (!response.ok) throw new Error('Ошибка при создании договора');

            const createdContract = await response.json();
            onContractCreated(createdContract); // "Сообщаем" родительскому компоненту об успехе
            onClose(); // Закрываем окно

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <h2>Новый договор</h2>


                <div className="form-group">
                    <label htmlFor="contractNumber">Номер договора</label>
                    {/* Привязываем инпуты к состоянию formData */}
                    <input id="contractNumber" type="text" value={formData.contractNumber} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="serviceAddress">Адрес предоставления услуги</label>
                    <input id="serviceAddress" type="text" value={formData.serviceAddress} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="tariffId">Тариф</label>
                    <select id="tariffId" value={formData.tariffId} onChange={handleTariffChange} required>
                        <option value="" disabled>Выберите тариф...</option>
                        {tariffs.map(t => <option key={t.id} value={t.id}>{t.name} ({t.installationFee} руб.)</option>)}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="signingDate">Дата подписания:</label>
                    <input
                        id="signingDate"
                        type="date"
                        value={formData.signingDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="serviceStartDate">Дата начала действия:</label>
                    <input
                        id="serviceStartDate"
                        type="date"
                        value={formData.serviceStartDate}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Отображаем стоимость из состояния */}
                <p><strong>Ежемесячная плата (стоимость тарифа):</strong> {formData.monthlyFee} руб.</p>

                {error && <p className="error-message">{error}</p>}

                <div className="form-actions">
                    <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isLoading}>Отмена</button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Сохранение...' : 'Создать договор'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateContractModal;