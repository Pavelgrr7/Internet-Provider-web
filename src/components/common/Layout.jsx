// src/components/Layout.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import '../../styles/Layout.css';

import ProfilePage from "../../pages/ProfilePage.jsx";
import UserContractsPage from "../../pages/UserContractsPage.jsx";
import ManageContractPage from "../../pages/ManageContractPage.jsx";
import AdminSubscribersPage from "../../pages/AdminSubscribersPage.jsx";
import AdminTariffsPage from "../../pages/AdminTariffsPage.jsx";
import AdminReportsPage from "../../pages/AdminReportsPage.jsx";

// Компонент-заглушка для главной вкладки
const OverviewTab = ({ user }) => (
    <div className="overview-container">
        <h1>Добро пожаловать, {user.login}!</h1>
        <p>Выберите раздел в меню выше, чтобы начать работу.</p>
        <p>Ваша роль: {user.role === 'ROLE_ADMIN' ? 'Администратор' : 'Абонент'}</p>
    </div>
);


const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Начальная вкладка - 'overview'
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    const userTabs = [
        { id: 'overview', label: 'Общая информация' },
        { id: 'profile', label: 'Профиль' },
        { id: 'contract', label: 'Мои договоры' },
        { id: 'manageContract', label: 'Управление' },
    ];

    const adminTabs = [
        { id: 'overview', label: 'Общая информация' },
        { id: 'profile', label: 'Профиль' },
        { id: 'reports', label: 'Отчёты' },
        { id: 'tariffs', label: 'Тарифы' },
        { id: 'subscribers', label: 'Абоненты' },
    ];
    const tabs = user?.role === 'ROLE_ADMIN' ? adminTabs : userTabs;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab user={user} />;
            case 'profile':
                return <ProfilePage />;
            case 'contract':
                return <UserContractsPage />;
            case 'manageContract':
                return <ManageContractPage />;
            case 'subscribers':
                return <AdminSubscribersPage />;
            case 'tariffs':
                return <AdminTariffsPage />;
            case 'reports':
                return <AdminReportsPage />;
            default:
                return <OverviewTab user={user} />;
        }
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }
    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="layout-container">
            {/* --- Липкий хедер --- */}
            <header className="sticky-header">
                <div className="header-content">
                    <div className="tabs-bar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="page-container">
                    <div className="page-content-wrapper">
                        {renderTabContent()}
                    </div>
                </div>
            </main>

            {/* --- Футер --- */}
            {/*<footer className="footer">*/}
            {/*    © 2025 TST Internet Services*/}
            {/*</footer>*/}
        </div>
    );
};

export default Layout;