// src/pages/UserContractsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../styles/UserContractsPage.css';

const UserContractsPage = () => {
    const { user } = useContext(AuthContext);

    // 1. Изменяем состояние: массив для договоров и ID для раскрытого элемента
    const [contracts, setContracts] = useState([]);
    const [expandedContractId, setExpandedContractId] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContracts = async () => {
            if (!user) return;

            try {
                const response = await fetch('http://127.0.0.1:8080/api/contracts/my/detailed', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();

                // 2. Сохраняем ВЕСЬ массив договоров
                setContracts(data);

                // 3. Устанавливаем первый договор как раскрытый по умолчанию
                if (data && data.length > 0) {
                    setExpandedContractId(data[0].id); // Убедитесь, что поле ID называется 'id'
                }

            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContracts();
    }, [user]);

    // 4. Функция для переключения видимости (открыть/закрыть)
    const handleToggleContract = (contractId) => {
        // Если кликнули по уже открытому - закрываем его. Иначе - открываем кликнутый.
        setExpandedContractId(prevId => (prevId === contractId ? null : contractId));
    };


    if (isLoading) {
        return <div>Загрузка ваших договоров...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (contracts.length === 0) {
        return <div>У вас пока нет активных договоров.</div>;
    }

    return (
        <>
            <h1>Мои договоры</h1>
            <div className="accordion">
                {contracts.map(contract => (
                    <div key={contract.id} className="accordion-item">
                        {/* 5. Кликабельный заголовок аккордеона */}
                        <div
                            className={`accordion-header ${expandedContractId === contract.id ? 'active' : ''}`}
                            onClick={() => handleToggleContract(contract.id)}
                        >
                            <span>Договор №{contract.contractNumber}</span>
                            {expandedContractId === contract.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        {expandedContractId === contract.id && (
                            <div className="accordion-content">
                                <p><strong>Адрес подключения:</strong> {contract.serviceAddress}</p>
                                <p><strong>Дата подписания:</strong> {new Date(contract.signingDate).toLocaleDateString()}</p>
                                <p><strong>Ваш месячный платёж:</strong> {contract.monthlyFee} руб.</p>
                                {/*<button onClick={}>Изменить</button>*/}
                                {/* ... и так далее, любая другая информация о договоре ... */}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default UserContractsPage;