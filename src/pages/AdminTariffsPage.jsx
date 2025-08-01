// src/pages/AdminTariffsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import EditTariffModal from '../components/modal/EditTariffModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import '../styles/AdminTablePage.css';

const AdminTariffsPage = () => {
    const { user } = useContext(AuthContext);
    const [tariffs, setTariffs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //  Состояния для управления модальными окнами
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTariff, setSelectedTariff] = useState(null); // Храним тариф для редактирования/удаления

    useEffect(() => {
        const fetchTariffs = async () => {
            if (!user) return;

            try {
                const response = await fetch('http://127.0.0.1:8080/api/tariffs', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                setTariffs(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTariffs();
    }, [user]);

    const handleEditClick = (tariff) => {
        setSelectedTariff(tariff);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (tariff) => {
        setSelectedTariff(tariff);
        setIsDeleteModalOpen(true);
    };

    const handleSaveChanges = async (tariffId, updatedData) => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/tariffs/${tariffId}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error('Ошибка обновления');

            const updatedTariff = await response.json();
            // Иммутабельно обновляем список
            setTariffs(prev => prev.map(t => (t.id === tariffId ? updatedTariff : t)));
            setIsEditModalOpen(false); // Закрываем окно

        } catch (error) { console.error(error); }
    };

    const handleDeleteServiceFromTariff = async (tariffId, serviceId) => {
        if (!window.confirm("Вы уверены, что хотите убрать эту услугу из тарифа?")) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/tariffs/${tariffId}/services/${serviceId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });

            if (!response.ok) throw new Error('Ошибка удаления услуги');

            setTariffs(prevTariffs =>
                prevTariffs.map(t => {
                    if (t.id !== tariffId) return t;

                    return {
                        ...t,
                        availableServices: t.availableServices.filter(s => s.id !== serviceId),
                        availableServicesCount: t.availableServicesCount - 1
                    };
                })
            );

            // Важно: также нужно обновить selectedTariff, чтобы модальное окно тоже обновилось
            setSelectedTariff(prev => ({
                ...prev,
                availableServices: prev.availableServices.filter(s => s.id !== serviceId)
            }));

        } catch (error) {
            console.error(error);
        }
    };

    const handleAddNewServiceToTariff = async (tariffId, serviceName, serviceCost) => {
        try {
            const request = JSON.stringify({ serviceName: serviceName,
                serviceCost: serviceCost });
            const response = await fetch(`http://127.0.0.1:8080/api/services`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json' },
                body: request
            });
            console.log(request);

            if (!response.ok) throw new Error('Ошибка добавления услуги');
            const newService  = await response.json();

            setTariffs(prevTariffs =>
                prevTariffs.map(t => {
                    if (t.id !== tariffId) return t;

                    return {
                        ...t,
                        availableServices: t.availableServices.add(newService),
                        availableServicesCount: t.availableServicesCount + 1
                    };
                })
            );

            // Важно: также нужно обновить selectedTariff, чтобы модальное окно тоже обновилось
            setSelectedTariff(prev => ({
                ...prev,
                availableServices: prev.availableServices.add(newService),
            }));

        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeService = async (tariffId, serviceId) => {

    };


    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/tariffs/${selectedTariff.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!response.ok) throw new Error('Ошибка удаления');

            // Иммутабельно удаляем из списка
            setTariffs(prev => prev.filter(t => t.id !== selectedTariff.id));
            setIsDeleteModalOpen(false); // Закрываем окно

        } catch (error) { console.error(error); }
    };



    if (isLoading) {
        return <div className="loading-message">Загрузка списка тарифов...</div>;
    }

    if (error) {
        return <div className="error-message">Ошибка: {error}</div>;
    }

    return (
        <>
            {/* <div className="admin-page-container"> */}
            <h1>Управление тарифами</h1>
            <p>Здесь отображен список всех действующих тарифов компании.</p>

            <div className="table-container">
                <table className="content-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>
                            <text>Скорость</text>
                        </th>
                        <th>Стоимость (в месяц)</th>
                        <th>Тип IP</th>
                        <th>Дата начала действия</th>
                        <th>Доступно услуг</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tariffs.map(tariff => (
                        <tr key={tariff.id}>
                            <td>{tariff.id}</td>
                            <td>{tariff.name}</td>
                            <td>{tariff.declaredSpeed}</td>
                            <td>{tariff.installationFee} руб.</td>
                            <td>{tariff.ipAddressType}</td>
                            <td>{tariff.startDate}</td>
                            <td>{tariff.availableServices.length}</td>
                            <td>
                                <button
                                    className="btn-action btn-edit"
                                    onClick={() => handleEditClick(tariff)}
                                >
                                    Изменить
                                </button>
                                <button
                                    className="btn-action btn-delete"
                                    onClick={() => handleDeleteClick(tariff)}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <EditTariffModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                tariff={selectedTariff}
                onSave={handleSaveChanges}
                onDeleteService={(serviceId) => handleDeleteServiceFromTariff(selectedTariff.id, serviceId)}
                onAddService={(serviceName, serviceCost) => handleAddNewServiceToTariff(selectedTariff.id, serviceName, serviceCost)}
                onChangeService={() => handleChangeService}
            />

            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Подтвердите удаление"
            >
                <p>Вы уверены, что хотите удалить тариф <strong>"{selectedTariff?.name}"</strong>?</p>
                <p>Это действие необратимо.</p>
            </ConfirmDialog>
        </>
    );
};

export default AdminTariffsPage;