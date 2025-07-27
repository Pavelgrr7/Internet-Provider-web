// src/pages/AdminSubscriberDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa';
import CreateContractModal from '../components/modal/CreateCotractModal';

import '../styles/AdminDetailPage.css';

// Маленький переиспользуемый компонент для редактируемого поля
const EditableField = ({ label, value, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSave = () => {
        onSave(currentValue);
        setIsEditing(false);
    };

    return (
        <div className="detail-field">
            <strong className="field-label">{label}:</strong>
            {isEditing ? (
                <div className="edit-controls">
                    <input
                        type="text"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                    />
                    <button onClick={handleSave} className="btn-icon"><FaSave /></button>
                    <button onClick={() => setIsEditing(false)} className="btn-icon"><FaTimes /></button>
                </div>
            ) : (
                <div className="view-controls">
                    <span className="field-value">{value}</span>
                    <button onClick={() => { setIsEditing(true); setCurrentValue(value); }} className="btn-icon btn-edit">
                        <FaEdit />
                    </button>
                </div>
            )}
        </div>
    );
};


const AdminSubscriberDetailPage = () => {
    const { subscriberId } = useParams();
    const { user } = useContext(AuthContext);

    const [subscriber, setSubscriber] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const handleGoBack = () => {
        // -1 это "вернуться на одну страницу назад в истории браузера"
        navigate(-1);
    };

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleContractCreated = (newContract) => {
        console.log("Создан новый договор");
        setSubscriber(prev => ({
            ...prev,
            contracts: [...prev.contracts, newContract]
        }));
    };

    // Загрузка данных об абоненте
    useEffect(() => {
        const fetchSubscriber = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/users/subscribers/${subscriberId}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();

                setSubscriber(data);
                console.log(`Получены данные о пользователе: `, data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubscriber();
    }, [subscriberId, user]);

    // Общая функция для обновления поля
    const handleUpdateField = async (fieldName, value) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/users/subscribers/${subscriberId}/${fieldName}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json' },
                body: JSON.stringify({ value })
            });
            if (!response.ok) throw new Error('Ошибка обновления');

            // Обновляем состояние на клиенте для мгновенного отображения
            setSubscriber(prev => ({ ...prev, [fieldName]: value }));
        } catch (error) {
            console.error(`Ошибка при обновлении ${fieldName}:`, error);
        }
    };

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!subscriber) return <div>Абонент не найден.</div>;

    return (
        <div className="admin-detail-page">
            <button onClick={handleGoBack} className="btn-back">
                <FaArrowLeft />
                К списку абонентов
            </button>

            <h1>Карточка абонента</h1>

            <div className="detail-card">
                <h2>Личные данные</h2>
                <p><strong>ID:</strong> {subscriber.id}</p>
                <EditableField label="ФИО" value={subscriber.fullName} onSave={(val) => handleUpdateField('fullname', val)} />
                <EditableField label="Паспорт" value={subscriber.passportSeriesNumber} onSave={(val) => handleUpdateField('passport', val)} />
                <EditableField label="Телефон" value={subscriber.phoneNumber} onSave={(val) => handleUpdateField('phone', val)} />
                <EditableField label="Email" value={subscriber.email} onSave={(val) => handleUpdateField('email', val)} />
                <EditableField label="Логин" value={subscriber.login} onSave={(val) => handleUpdateField('login', val)} />
            </div>

            <div className="detail-card">
                <h2>Договоры ({subscriber.contracts.length})</h2>
                <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{marginBottom: '1rem'}}>
                    <FaPlus /> Новый договор
                </button>
                <table className="content-table">
                    <thead>
                    <tr><th>Номер</th><th>Адрес</th><th>Дата подписания</th></tr>
                    </thead>
                    <tbody>
                    {subscriber.contracts.map(contract => (
                        <tr key={contract.id}>
                            <td>
                                {/* Ссылка на страницу управления этим конкретным договором */}
                                <Link to={`/dashboard/manage-contract/${contract.id}`}>{contract.contractNumber}</Link>
                            </td>
                            <td>{contract.serviceAddress}</td>
                            <td>{new Date(contract.signingDate).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <CreateContractModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                subscriberId={subscriber.id}
                onContractCreated={handleContractCreated}
            />
        </div>

    );
};

export default AdminSubscriberDetailPage;