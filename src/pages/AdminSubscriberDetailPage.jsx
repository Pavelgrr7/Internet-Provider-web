// src/pages/AdminSubscriberDetailPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { FaArrowLeft, FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import CreateContractModal from '../components/modal/CreateCotractModal';

import '../styles/AdminDetailPage.css';
import ConfirmDialog from "../components/common/ConfirmDialog.jsx";
import EditContractModal from "../components/common/EditContractModal.jsx";
import toast from "react-hot-toast";
import ContractForm from "../components/modal/ContractForm.jsx";
import Modal from "../components/modal/Modal.jsx";

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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null); // Храним контракт для редактирования/удаления

    const [isAddContractModalOpen, setIsAddContractModalOpen] = useState(false);

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
    }, [subscriber]);

    const handleToggleContract = (contractId) => {
        setExpandedContractId(prevId => (prevId === contractId ? null : contractId));
    };
    const handleEditContractClick = (contract) => {
        setSelectedContract(contract);
        setIsEditModalOpen(true);
    };

    const handleSaveChanges = async (contractId, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/contracts/${contractId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Ошибка обновления договора');

            const updatedContract = await response.json();

            // Обновляем состояние subscriber иммутабельно
            setSubscriber(prevSubscriber => {
                // Создаем новый массив договоров, заменяя в нем обновленный
                const newContracts = prevSubscriber.contracts.map(c =>
                    c.id === contractId ? updatedContract : c
                );

                // Возвращаем новую копию объекта subscriber с новым массивом договоров
                return {
                    ...prevSubscriber,
                    contracts: newContracts
                };
            });

            setIsEditModalOpen(false); // Закрываем модальное окно

        } catch (error) {
            console.error("Ошибка при сохранении изменений:", error);
        }
    };

    const handleAddContractSubmit = async (contractData) => {
        const fullContractData = {
            ...contractData,
            subscriberId: subscriber.id
        };

        try {
            const response = await fetch('http://127.0.0.1:8080/api/contracts', { // Используем тот же эндпоинт, что и для создания первого договора
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(fullContractData)
            });
            if (!response.ok) throw new Error('Ошибка создания договора');

            const newContract = await response.json();

            // Обновляем список договоров на странице
            setSubscriber(prev => ({
                ...prev,
                contracts: [...prev.contracts, newContract]
            }));

            setIsAddContractModalOpen(false); // Закрываем окно
            toast.success("Новый договор успешно добавлен!");

        } catch (error) {
            console.error(error);
            toast.error("Не удалось добавить договор.");
        }
    };

    // const handleDeleteConfirm = async (contractId) => {
    //     console.log("Удаление контракта:", contractId);
    //     try {
    //         const response = await fetch(`http://127.0.0.1:8080/api/contracts/{contractId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Bearer ${user.token}`,
    //             },
    //         });
    //         if (!response.ok) throw new Error('Ошибка удаление отчета');
    //         setSubscriber(prev => ({
    //             ...prev,
    //             contracts: prev.contracts.filter( c =>
    //             c.id !== contractId
    //             ),
    //         }));
    //
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const handleDeleteConfirm = async () => {
        console.log("Удаление контракта:", selectedContract);
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/contracts/${selectedContract.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!response.ok) throw new Error('Ошибка удаления');

            const result = await response.json();

            if (result.subscriberDeleted) {
                // Если абонент был удален, показываем уведомление и перенаправляем
                toast.success("Договор и абонент были успешно удалены.");
                navigate(-1); // Возвращаемся к списку
            } else {
                // Если удален только договор, просто обновляем список договоров на странице
                toast.success("Договор успешно расторгнут.");
                setSubscriber(prev => ({
                    ...prev,
                    contracts: prev.contracts.filter(c => c.id !== contractId)
                }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Не удалось удалить договор.");
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
            <div className="detail-page-grid">
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
                <button
                    className="btn btn-primary"
                    style={{marginBottom: '1rem'}}
                    onClick={() => setIsAddContractModalOpen(true)}
                >
                    <FaPlus />
                </button>

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
                                                            <span>{service.serviceName}: </span>
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
                                        <button onClick={() => handleEditContractClick(contract)} className="btn btn-secondary">Редактировать</button>
                                        <button onClick={() => setIsDeleteModalOpen(true)} className="btn btn-danger">Расторгнуть</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            </div>
            <Modal isOpen={isAddContractModalOpen} onClose={() => setIsAddContractModalOpen(false)}>
                <ContractForm
                    onCancel={() => setIsAddContractModalOpen(false)}
                    onSubmit={handleAddContractSubmit}
                />
            </Modal>
            <CreateContractModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                subscriberId={subscriber.id}
                onContractCreated={handleContractCreated}
            />
            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Подтвердите удаление"
            >
                <p>Вы уверены, что хотите расторгнуть контракт?</p>
                <p>Это действие необратимо.</p>
                <p>Если это был единственный договор абонента, он так же будет удалён</p>
            </ConfirmDialog>
            <EditContractModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                contract={selectedContract}
                onSave={handleSaveChanges}
            />
        </div>
    );
};

export default AdminSubscriberDetailPage;