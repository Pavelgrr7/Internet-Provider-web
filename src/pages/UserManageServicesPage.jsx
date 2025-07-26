// src/pages/UserManageServicesPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Modal from '../components/Modal';
import { FaChevronDown, FaChevronUp, FaPlus, FaTrash } from 'react-icons/fa';
import '../styles/ManageServicesPage.css';

const UserManageServicesPage = () => {
    const { user } = useContext(AuthContext);
    const [contracts, setContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояние для аккордеона: храним ID открытой строки
    const [expandedRowId, setExpandedRowId] = useState(null);

    // Состояния для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ availableServices: [], contract: null });
    const [isModalLoading, setIsModalLoading] = useState(false);

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

    // Обработчик клика по строке для раскрытия/скрытия
    const handleRowClick = (contractId) => {
        setExpandedRowId(prevId => (prevId === contractId ? null : contractId));
    };

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

                    // Если это НАШ договор, создаем его новую копию
                    return {
                        ...contract,
                        services: contract.services.filter(service => service.serviceId !== serviceId)
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

                    const updatedContract = {
                        ...contract,
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

    return (
        <>
            <h1>Управление услугами</h1>
            <div className="table-container">
                <table className="content-table">
                    <thead>
                    <tr>
                        <th>Номер договора</th>
                        <th>Тариф</th>
                        <th>Ежемесячный платёж</th>
                        <th>Подключено услуг</th>
                        {/*<th></th> /!* Пустая колонка для иконки *!/*/}
                    </tr>
                    </thead>
                    <tbody>
                    {contracts.map(contract => (
                        <React.Fragment key={contract.id}>
                            <tr className="main-row" onClick={() => handleRowClick(contract.id)}>
                                <td>{contract.contractNumber}</td>
                                <td>{contract.tariffName}</td>
                                <td>{contract.monthlyFee}</td>
                                <td>{contract.services.length}</td>
                                <td className="expand-icon">
                                    {expandedRowId === contract.id ? <FaChevronUp /> : <FaChevronDown />}
                                </td>
                            </tr>
                            {expandedRowId === contract.id && (
                                <tr className="details-row">
                                    <td colSpan="4">
                                        <div className="details-content">
                                            <h4>Подключенные услуги:</h4>
                                            <ul className="services-list">
                                                {contract.services.length > 0 ? (
                                                    contract.services.map(service => (
                                                        <li key={service.serviceId}>
                                                            <span>{service.serviceName} ({service.cost} руб.)</span>
                                                            <button onClick={() => handleDisconnectService(contract.id, service.serviceId)} className="btn-disconnect">
                                                                <FaTrash />
                                                            </button>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>Нет подключенных услуг</li>
                                                )}
                                            </ul>
                                            <button onClick={() => handleOpenAddModal(contract)} className="btn-add-service">
                                                <FaPlus /> Добавить услугу
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
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
        </>
    );
};

export default UserManageServicesPage;