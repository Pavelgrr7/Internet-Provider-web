// src/pages/AdminTariffsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminTablePage.css';

const AdminTariffsPage = () => {
    const { user } = useContext(AuthContext);
    const [tariffs, setTariffs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Обработчики для кнопок (пока что просто заглушки)
    const handleEditClick = (tariffId) => {
        console.log(`Нажата кнопка "Изменить" для тарифа с ID: ${tariffId}`);
        // todo модальное окно
    };

    const handleArchiveClick = (tariffId) => {
        console.log(`Нажата кнопка "Архивировать" для тарифа с ID: ${tariffId}`);
        // todo модальное окно
    };


    if (isLoading) {
        return <div className="loading-message">Загрузка списка тарифов...</div>;
    }

    if (error) {
        return <div className="error-message">Ошибка: {error}</div>;
    }

    return (
        <div className="admin-page-container">
            <h1>Управление тарифами</h1>
            <p>Здесь отображен список всех действующих тарифов компании.</p>

            <div className="table-container">
                <table className="content-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Скорость</th>
                        <th>Плата за установку</th>
                        <th>Тип IP</th>
                        <th>Дата начала действия</th>
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
                            <td>
                                <button
                                    className="btn-action btn-edit"
                                    onClick={() => handleEditClick(tariff.id)}
                                >
                                    Изменить
                                </button>
                                <button
                                    className="btn-action btn-archive"
                                    onClick={() => handleArchiveClick(tariff.id)}
                                >
                                    Архивировать
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTariffsPage;