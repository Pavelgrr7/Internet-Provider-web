// src/pages/UserManageServicesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/ManageContractPage.css';

const ManageContractPage = () => {
    const { user } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //Состояния для смены тарифа
    const [isChangingTariff, setIsChangingTariff] = useState(false); // Показываем ли форму смены
    const [availableTariffs, setAvailableTariffs] = useState([]); // Список доступных тарифов
    const [selectedTariffId, setSelectedTariffId] = useState('');

    // Состояние для аккордеона: храним ID открытой строки
    // const [expandedRowId, setExpandedRowId] = useState(null);

    // Состояния для модального окна доп. услуг
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ availableServices: [], contract: null });
    const [isModalLoading, setIsModalLoading] = useState(false);

    // Состояния для модального окна подтверждения смены тарифа
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [tariffChangePreview, setTariffChangePreview] = useState({ servicesToDisconnect: [] });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserContracts = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8080/api/contracts/my/detailed`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                const contractsData = await response.json();
                setContracts(contractsData);
                console.log(`Получены данные по контрактам. количество записей: ${contractsData.length}`);
                console.log(contractsData);
            } catch (e) {
                setError("Ошибка загрузки доступных услуг");
                console.error(e);
            } finally {
                setIsLoading(false);
            }

        };
        fetchUserContracts();
    }, [user]);

    useEffect(() => {
        if (isChangingTariff) {

            console.log(`Зарос на получение тарифов, ${user.token}`)

            const fetchAvailableTariffs = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8080/api/tariffs/available-for-change', {
                        headers: {'Authorization': `Bearer ${user.token}`}
                    });

                    if (!response.ok) {
                        throw new Error(`Ошибка сети: ${response.status}`);
                    }

                    const data = await response.json();
                    setAvailableTariffs(data);
                } catch (e) {
                    console.error(e);
                }
            };
            fetchAvailableTariffs();
        }
    }, [isChangingTariff, user]);

    const handlePreviewTariffChange = async (contractId) => {
        if (!selectedTariffId) return;

        setIsSubmitting(true);
        try {
            // 1. Делаем запрос на "предпросмотр"
            const response = await fetch(
                `http://127.0.0.1:8080/api/contracts/${contractId}/change-tariff-preview?newTariffId=${selectedTariffId}`,
                { headers: { 'Authorization': `Bearer ${user.token}` } }
            );
            if (!response.ok) throw new Error('Ошибка при получении данных для смены тарифа');
            const previewData = await response.json();
            setTariffChangePreview(previewData);

            // 2. Решаем, что делать дальше
            if (previewData.servicesToDisconnect.length > 0) {
                // Если есть отключаемые услуги, показываем подтверждающий диалог
                setIsConfirmModalOpen(true);
            } else {
                // Если отключать нечего, сразу отправляем запрос на смену
                await confirmTariffChange(contractId, selectedTariffId);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmTariffChange = async (contractId, newTariffId) => {
        setIsSubmitting(true);
        try {
            console.log(`контракт: ${contractId}, новый тариф: ${newTariffId}`);
            const response = await fetch(`http://127.0.0.1:8080/api/contracts/${contractId}/tariff`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tariffId: newTariffId })
            });


            if (!response.ok) throw new Error('Ошибка при смене тарифа');

            const updatedContract = await response.json();

            console.log("ПОЛУЧЕН ОБНОВЛЕННЫЙ КОНТРАКТ С СЕРВЕРА:", updatedContract);
            console.log("Его услуги:", updatedContract.services);

            setContracts(prevContracts => {
                const newContracts = prevContracts.map(c =>
                    c.id === contractId ? updatedContract : c
                );
                console.log("НОВОЕ СОСТОЯНИЕ 'contracts' ПОСЛЕ ОБНОВЛЕНИЯ:", newContracts);
                return newContracts;
            });
            setIsConfirmModalOpen(false);
            setSelectedTariffId('');
            setIsChangingTariff(false);

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // // Обработчик клика по строке для раскрытия/скрытия
    // const handleRowClick = (contractId) => {
    //     setExpandedRowId(prevId => (prevId === contractId ? null : contractId));
    // };

    // Открытие модального окна и загрузка доступных услуг
    const handleOpenAddModal = async (contract) => {
        setIsModalOpen(true);
        setIsModalLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/tariffs/available-for-contract/${contract.id}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const availableServices = await response.json();
            setModalData({ availableServices, contract });
        } catch (e) {
            console.error("Ошибка загрузки доступных услуг", e);
        } finally {
            setIsModalLoading(false);
        }
    };

    const handleDisconnectService = async (contractId, serviceId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/contracts/${contractId}/services/${serviceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            // 1. Просто проверяем, что запрос прошел успешно
            if (!response.ok) {
                // Можно получить текст ошибки, если сервер его отправляет
                const errorText = await response.text();
                throw new Error(`Ошибка на сервере: ${response.status} ${errorText}`);
            }

            console.log(`Услуга ${serviceId} успешно отключена от договора ${contractId}`);

            setContracts(currentContracts => {
                return currentContracts.map(contract => {
                    // Если это не тот договор, который мы меняли, возвращаем его как есть
                    if (contract.id !== contractId) {
                        return contract;
                    }

                    const deletedService = contract.services.find(service => service.serviceId)
                    // Если это НАШ договор, создаем его новую копию
                    return {
                        ...contract,
                        monthlyFee: contract.monthlyFee - deletedService.cost,
                        services: contract.services.filter( service => service !== deletedService)
                    };
                });
            });

        } catch (e) {
            console.error("Ошибка отключения услуги", e);
        }
    };

    const handleConnectService = async (contractId, serviceId) => {
        const newService = modalData.availableServices.find(s => s.serviceId === serviceId);
        if (!newService) {
            console.error("Не удалось найти добавляемую услугу в списке доступных.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/contracts/${contractId}/services`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ serviceId: serviceId })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ошибка на сервере: ${response.status} ${errorText}`);
            }

            console.log(`Услуга ${serviceId} успешно подключена к договору ${contractId}`);

            setContracts(currentContracts => {
                console.log("Обновляем состояние 'contracts'. Текущее состояние:", currentContracts);

                const newContracts = currentContracts.map(contract => {
                    if (contract.id !== contractId) {
                        return contract;
                    }

                    // Нашли нужный договор, обновляем его
                    console.log(`Найден нужный договор для обновления: ID=${contract.id}`);
                    console.log("Его старые услуги:", contract.services);
                    console.log("Добавляем новую услугу:", newService);

                    //:cry:
                    const newFee = 1 * parseFloat(contract.monthlyFee).toFixed(2) + 1 * parseFloat(newService.cost).toFixed(2);
                    const updatedContract = {
                        ...contract,
                        monthlyFee: newFee.toString(),
                        services: [...contract.services, newService]
                    };

                    console.log("Новый объект договора:", updatedContract);
                    return updatedContract;
                });

                console.log("Новый массив всех контрактов:", newContracts);
                return newContracts;
            });

            // Шаг 4: Обновляем состояние модального окна, чтобы убрать оттуда добавленную услугу
            setModalData(prevModalData => ({
                ...prevModalData,
                availableServices: prevModalData.availableServices.filter(s => s.serviceId !== serviceId)
            }));

            // Шаг 5: Закрываем модальное окно (можно с небольшой задержкой для UX)
            setTimeout(() => setIsModalOpen(false), 300);
            setIsModalOpen(false);


        } catch (e) {
            console.error("Ошибка подключения услуги", e);
        }
    };

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    const contract = contracts[0];
    if (!contract) return <div>Нет активных договоров для управления.</div>;

    return (
        <>
            <div className="manage-contract-container">
                <h1>Управление договором №{contract.contractNumber}</h1>

                {/* --- БЛОК 1: УПРАВЛЕНИЕ ТАРИФОМ --- */}
                <div className="management-section">
                    <h2>Текущий тариф</h2>
                    <div className="current-tariff-info">
                        <strong>{contract.tariffName}</strong>
                        <span>{contract.monthlyFee} руб./мес.</span>
                    </div>

                    {!isChangingTariff ? (
                        <button onClick={() => setIsChangingTariff(true)} className="btn btn-secondary">
                            Изменить тариф
                        </button>
                    ) : (
                        <div className="change-tariff-form">
                            <select
                                value={selectedTariffId}
                                onChange={e => setSelectedTariffId(e.target.value)}
                            >
                                <option value="" disabled>Выберите новый тариф...</option>
                                {availableTariffs.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => handlePreviewTariffChange(contract.id)}
                                className="btn btn-primary"
                                disabled={isSubmitting} // Блокируем кнопку во время запроса
                            >{isSubmitting ? 'Проверка...' : 'Подтвердить'}</button>
                            <button onClick={() => setIsChangingTariff(false)} className="btn btn-tertiary">Отмена</button>
                        </div>
                    )}
                </div>

                {/* --- БЛОК 2: УПРАВЛЕНИЕ УСЛУГАМИ (ИСПРАВЛЕННЫЙ) --- */}
                <div className="management-section">
                    <h2>Подключенные услуги ({contract.services.length})</h2>

                    {/* Используем <ul>, как и положено для списка */}
                    <ul className="services-list">
                        {contract.services.length > 0 ? (
                            // Итерируемся по УСЛУГАМ текущего договора, а не по всем договорам
                            contract.services.map(service => (
                                // Дочерним элементом <ul> должен быть <li>
                                <li key={service.id}> {/* Убедитесь, что у услуги есть id */}
                                    <span>{service.serviceName} ({service.cost.toFixed(2)} руб.)</span>
                                    <button
                                        onClick={() => handleDisconnectService(contract.id, service.serviceId)}
                                        className="btn-disconnect"
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li>Нет подключенных услуг</li>
                        )}
                    </ul>

                    {/* Кнопка для добавления новых услуг */}
                    <button onClick={() => handleOpenAddModal(contract)} className="btn-add-service">
                        <FaPlus /> Добавить услугу
                    </button>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {isModalLoading ? <p>Загрузка...</p> : (
                    <div>
                        <h3>Доступные услуги для тарифа "{modalData.contract?.tariffName}"</h3>
                        <ul className="services-list modal-services">
                            {modalData.availableServices.map(service => (
                                <li key={service.id}>
                                    <span>{service.serviceName} ({service.cost} руб.)</span>
                                    <button onClick={() => handleConnectService(modalData.contract.id, service.serviceId)} className="btn-connect">
                                        Подключить
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Modal>
            <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)}>
                <h2>Подтвердите смену тарифа</h2>
                <p>При переходе на новый тариф следующие подключенные услуги будут **автоматически отключены**, так как они недоступны:</p>
                <ul className="disconnected-services-list">
                    {tariffChangePreview.servicesToDisconnect.map(service => (
                        <li key={service.id}>{service.serviceName}</li>
                    ))}
                </ul>
                <p>Вы уверены, что хотите продолжить?</p>
                <div className="modal-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsConfirmModalOpen(false)}
                        disabled={isSubmitting}
                    >
                        Отмена
                    </button>
                    <button
                        className="btn btn-danger"
                        onClick={() => confirmTariffChange(contract.id, selectedTariffId)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Выполняется...' : 'Да, сменить тариф'}
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ManageContractPage;