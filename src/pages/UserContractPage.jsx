import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const UserContractsPage = () => {
    const [contractData, setContractData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    // console.log(user);

    const url = 'http://127.0.0.1:8080/api/contracts/my';

    useEffect(() => {

        const fetchContract = async () => {
            // Если пользователя еще нет (например, контекст не успел обновиться), выходим.
            if (!user) return;

            try {
                setIsLoading(true);

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    }
                });

                console.log('Отправляю запрос на ' + url.toString());

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                console.log(`полученный договор: ${data[0]}`);

                setContractData(data[0]);

            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchContract();

    }, [user]);

    if (isLoading) {
        return <div>Загрузка вашего договора...</div>;
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    if (!contractData) {
        return <div>
            У вас пока нет активного договора.
        </div>;
    }

    return (
        <>
            <h1>Информация по вашему договору</h1>
            <p><strong>Номер договора:</strong> {contractData.contractNumber}</p>
            <p><strong>Адрес подключения:</strong> {contractData.serviceAddress}</p>
            <p><strong>Дата подписания:</strong> {new Date(contractData.signingDate).toLocaleDateString()}</p>
            <p><strong>Ваш месячный платёж:</strong> {contractData.monthlyFee} руб.</p>
            {/* ... и так далее ... */}
        </>
    );
};

export default UserContractsPage;