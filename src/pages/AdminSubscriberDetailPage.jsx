// src/pages/AdminSubscriberDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { FaArrowLeft, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';
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

    const [expandedContractId, setExpandedContractId] = useState(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleContractCreated = (newContract) => {
        console.log("Создан новый договор");
        setSubscriber(prev => ({
            ...prev,
            contracts: [...prev.contracts, newContract]
        }));
    };

    useEffect(() => {
        if (subscriber && subscriber.contracts && subscriber.contracts.length > 0) {
            setExpandedContractId(subscriber.contracts[0].id);
        }
    }, [subscriber]); // Запускаем, когда данные абонента загрузятся

    const handleToggleContract = (contractId) => {
        setExpandedContractId(prevId => (prevId === contractId ? null : contractId));
    };

    const handleEditContract = (contractId) => {
        // Перенаправляем на страницу управления этим договором,
        // которую вы уже сделали для абонентов
        navigate(`/dashboard/manage-contract/${contractId}`);
    };

    const handleDeleteContract = (contractId) => {
        // Здесь будет логика для открытия модального окна подтверждения удаления
        if (window.confirm(`Вы уверены, что хотите удалить договор №${contractId}?`)) {
            console.log("Удаляем договор:", contractId);
            // ... fetch-запрос DELETE /api/contracts/{contractId} ...
            // и обновление состояния
        }
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
                {/*<button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{marginBottom: '1rem'}}>*/}
                {/*    <FaPlus /> Новый договор*/}
                {/*</button>*/}
                {/*<table className="content-table">*/}
                {/*    <thead>*/}
                {/*    <tr><th>Номер</th><th>Адрес</th><th>Дата подписания</th></tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {subscriber.contracts.map(contract => (*/}
                {/*        <tr key={contract.id}>*/}
                {/*            <td>*/}
                {/*                /!* Ссылка на страницу управления этим конкретным договором *!/*/}
                {/*                <Link to={`/dashboard/manage-contract/${contract.id}`}>{contract.contractNumber}</Link>*/}
                {/*            </td>*/}
                {/*            <td>{contract.serviceAddress}</td>*/}
                {/*            <td>{new Date(contract.signingDate).toLocaleDateString()}</td>*/}
                {/*        </tr>*/}
                {/*    ))}*/}
                {/*    </tbody>*/}
                {/*</table>*/}

                <div className="contracts-accordion">
                    {subscriber.contracts.map(contract => (
                        <div key={contract.id} className="accordion-item">
                            <div
                                className="accordion-header"
                                onClick={() => handleToggleContract(contract.id)}
                            >
                                <div className="header-main-info">
                                    <strong>Договор №{contract.contractNumber}</strong>
                                </div>
                                <div className="header-summary">
                                    <span className="total-fee">{contract.monthlyFee.toFixed(2)} руб./мес.</span>
                                    <span className="expand-icon">
                                        {expandedContractId === contract.id ? <FaChevronUp /> : <FaChevronDown />}
                                    </span>
                                </div>
                            </div>

                            {expandedContractId === contract.id && (
                                <div className="accordion-content">
                                    <div className="contract-details-grid">
                                        <div className="detail-section">
                                            <h4>Тариф</h4>
                                            <p>{contract.tariffName} ({contract.monthlyFee.toFixed(2)} руб.)</p>
                                        </div>
                                        <div className="detail-section">
                                            <h4>Адрес</h4>
                                            <p>{contract.serviceAddress}</p>
                                            <h4>Подключенные услуги ({contract.services.length})</h4>
                                            <ul className="details-services-list">
                                                {contract.services.length > 0 ? (
                                                    contract.services.map(service => (
                                                        <li key={service.id}>
                                                            <span>{service.serviceName}</span>
                                                            <span>{service.cost.toFixed(2)} руб.</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>Нет подключенных услуг</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="contract-actions">
                                        <button onClick={() => handleEditContract(contract.id)} className="btn btn-secondary">Управлять</button>
                                        <button onClick={() => handleDeleteContract(contract.id)} className="btn btn-danger">Расторгнуть</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>


            {/*    <div className="table-wrapper"> /!* Добавляем обертку для возможной прокрутки *!/*/}
            {/*        <table className="content-table">*/}
            {/*            <thead>*/}
            {/*            <tr>*/}
            {/*                <th>Номер</th>*/}
            {/*                <th>Адрес</th>*/}
            {/*                <th>Дата подписания</th>*/}
            {/*                <th className="actions-column">Действия</th>*/}
            {/*            </tr>*/}
            {/*            </thead>*/}
            {/*            <tbody>*/}
            {/*            {subscriber.contracts.map(contract => (*/}
            {/*                <tr key={contract.id}>*/}
            {/*                    <td>{contract.contractNumber}</td>*/}
            {/*                    <td>{contract.serviceAddress}</td>*/}
            {/*                    <td>{new Date(contract.signingDate).toLocaleDateString()}</td>*/}
            {/*                    <td className="actions-cell"> /!* Ячейка с кнопками *!/*/}
            {/*                        <button*/}
            {/*                            onClick={() => handleEditContract(contract.id)}*/}
            {/*                            className="btn-icon btn-action-edit"*/}
            {/*                            title="Управлять договором"*/}
            {/*                        >*/}
            {/*                            <FaEdit />*/}
            {/*                        </button>*/}
            {/*                        <button*/}
            {/*                            onClick={() => handleDeleteContract(contract.id)}*/}
            {/*                            className="btn-icon btn-action-delete"*/}
            {/*                            title="Удалить договор"*/}
            {/*                        >*/}
            {/*                            <FaTrash />*/}
            {/*                        </button>*/}
            {/*                    </td>*/}
            {/*                </tr>*/}
            {/*            ))}*/}
            {/*            </tbody>*/}
            {/*        </table>*/}
            {/*    </div>*/}
            {/*</div>*/}
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