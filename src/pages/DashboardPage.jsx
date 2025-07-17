// src/pages/DashboardPage.jsx

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

import UserContractsWidget from '../components/UserContractsWidget.jsx';
import AdminTariffManagerWidget from '../components/AdminTariffManagerWidget.jsx';
import AdminUserListWidget from '../components/AdminUserListWidget.jsx'; // Предположим, вы его создали

const DashboardPage = () => {
    const { user } = useContext(AuthContext);

    // хех
    if (!user) {
        console.log(user)
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <h1>Добро пожаловать, {user.login}!</h1>
            <p>Это ваш личный кабинет.</p>
            <hr />

            {user.role === 'ROLE_USER' && (
                <>
                    <UserContractsWidget />
                </>
            )}

            {user.role === 'ROLE_ADMIN' && (
                <>
                    <AdminTariffManagerWidget />
                    <AdminUserListWidget />
                </>
            )}
        </div>
    );
};

export default DashboardPage;