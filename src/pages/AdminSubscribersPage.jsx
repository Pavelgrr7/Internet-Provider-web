// src/pages/AdminSubscribersPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/AdminTablePage.css';
import Modal from '../components/modal/Modal.jsx';

//
const AdminSubscribersPage = () => {
    const { user } = useContext(AuthContext);
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const handleSubscriberRowClick = (subscriberId) => {
        navigate(`/dashboard/admin/subscribers/${subscriberId}`);
    };
//
    useEffect(() => {
        const fetchSubscribers = async () => {
            if (!user || user.role !== 'ROLE_ADMIN') return;

            try {
                const response = await fetch('http://127.0.0.1:8080/api/users/subscribers', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();

                setSubscribers(data);
                console.log(`Получен список пользователей:`, data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscribers();
    }, [user]); // Зависимость от user, чтобы запрос отправился после его загрузки

    if (isLoading) {
        return <div className="loading-message">Загрузка списка абонентов...</div>;
    }

    if (error) {
        return <div className="error-message">Ошибка: {error}</div>;
    }

    const handleContractClick = async (contractId) => {
        setIsModalOpen(true);
        setIsModalLoading(true);
        setSelectedContract(null); // Сбрасываем старые данные

        try {
            const response = await fetch(`http://127.0.0.1:8080/api/contracts/${contractId}`, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            if (!response.ok) throw new Error('Не удалось загрузить данные договора');
            const data = await response.json();

            setSelectedContract(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsModalLoading(false);
        }
    };

    return (
        <>
            <h1>Управление абонентами</h1>
            <p>Здесь отображен список всех зарегистрированных абонентов.</p>

            <div className="table-container">
                <table className="content-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Серия и номер паспорта</th>
                    <th>ФИО</th>
                    <th>Логин</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Договоры</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {subscribers.map(subscriber => (
                    <tr onClick={() => handleSubscriberRowClick(subscriber.id)} key={subscriber.id}>
                        <td>{subscriber.id}</td>
                        <td>{subscriber.passportSeriesNumber}</td>
                        <td>{subscriber.lastName} {subscriber.firstName} {subscriber.middleName}</td>
                        <td>{subscriber.login}</td>
                        <td>{subscriber.email}</td>
                        <td>{formatPhoneNumber(subscriber.phoneNumber)}</td>
                        <td>
                            {subscriber.contracts.map(contract => (
                                <span
                                    key={contract.id}
                                    className="contract-num"
                                >
                                        {contract.contractNumber + ' '}
                                    </span>
                            ))}
                        </td>
                    </tr>
                ))
                }
                </tbody>
            </table>
            </div>
            {/* --- РЕНДЕРИМ МОДАЛЬНОЕ ОКНО --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {isModalLoading ? (
                    <p>Загрузка данных договора...</p>
                ) : selectedContract ? (
                    <div>
                        <h2>Детали договора №{selectedContract.contractNumber}</h2>
                        <p><strong>Адрес:</strong> {selectedContract.serviceAddress}</p>
                        <p><strong>Дата подписания:</strong> {new Date(selectedContract.signingDate).toLocaleDateString()}</p>
                        <p><strong>Ежемесячная плата:</strong> {selectedContract.monthlyFee} руб.</p>
                        {/* ... другие детали ... */}
                    </div>
                ) : (
                    <p>Не удалось загрузить данные.</p>
                )}
            </Modal>
        </>
    );
};

function formatPhoneNumber(rawNumber) {
    const cleaned = ('' + rawNumber).replace(/\D/g, '');

    const match = cleaned.match(/^(\d|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (match) {
        const intlCode = (match[1] ? '+7' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4], '-', match[5]].join('');
    }

    return rawNumber;
}

export default AdminSubscribersPage;