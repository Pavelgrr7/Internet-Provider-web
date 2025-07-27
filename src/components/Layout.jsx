// // src/components/Layout.jsx
// import React, {useContext, useState} from 'react';
// import {NavLink, Outlet, useLocation, useNavigate} from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/Layout.css';
// import ProfilePage from "../pages/ProfilePage.jsx";
// import UserContractsPage from "../pages/UserContractsPage.jsx";
// import ManageContractPage from "../pages/ManageContractPage.jsx";
// import AdminSubscribersPage from "../pages/AdminSubscribersPage.jsx";
// import AdminTariffsPage from "../pages/AdminTariffsPage.jsx";
// import AdminReportsPage from "../pages/AdminReportsPage.jsx";
//
// const Layout = () => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [activeTab, setActiveTab] = useState('overview');
//
//     const OverviewTab = ({ user }) => (
//         <div>
//             <div className="dashboard-header">
//                 <h1>Добро пожаловать, {user.login}!</h1>
//                 <p>Это ваш личный кабинет.</p>
//                 <hr />
//             </div>
//             <h2>Общая информация</h2>
//             <p>Ваша роль: {user.role === 'ROLE_ADMIN' ? 'Администратор' : 'Абонент'}</p>
//             <p>Завершить сессию вы можете во вкладке "Профиль"</p>
//         </div>
//     );
//
//     const userTabs = [
//         { id: 'overview', label: 'Общая информация' },
//         { id: 'profile', label: 'Профиль' },
//         { id: 'contract', label: 'Мои договоры' },
//         { id: 'manageContract', label: 'Управление' },
//     ];
//
//     const adminTabs = [
//         { id: 'overview', label: 'Общая информация' },
//         { id: 'profile', label: 'Профиль' },
//         { id: 'reports', label: 'Отчёты' },
//         { id: 'tariffs', label: 'Тарифы' },
//         { id: 'subscribers', label: 'Абоненты' },
//     ];
//     const tabs = user?.role === 'ROLE_ADMIN' ? adminTabs : userTabs;
//
//     const renderTabContent = () => {
//         switch (activeTab) {
//             case 'overview':
//                 return <OverviewTab user={user} />;
//             case 'profile':
//                 return <ProfilePage />;
//             case 'contract':
//                 return <UserContractsPage />;
//             case 'manageContract':
//                 return <ManageContractPage />;
//             case 'subscribers':
//                 return <AdminSubscribersPage />;
//             case 'tariffs':
//                 return <AdminTariffsPage />;
//             case 'reports':
//                 return <AdminReportsPage />;
//             default:
//                 return <OverviewTab user={user} />;
//         }
//     };
//
//     return (
//         <div className="layout-container">
//             {/* --- БЛОК 1: Липкий хедер с вкладками --- */}
//             <header className="sticky-header">
//                 <div className="header-content">
//                     <div className="tabs-bar">
//                         {tabs.map(tab => (
//                             <button
//                                 key={tab.id}
//                                 className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
//                                 onClick={() => setActiveTab(tab.id)}
//                             >
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="tab-content-container">
//                    <div className="tab-content">
//                      {renderTabContent()}
//                    </div>
//                 </div>
//             </header>
//
//             {/* --- БЛОК 2: Основной контент страницы --- */}
//             <main className="main-content">
//                 <Outlet /> {/* Сюда будут вставляться ProfilePage, DashboardPage и т.д. */}
//             </main>
//
//             {/* --- БЛОК 3: Футер --- */}
//             <footer className="footer">
//                 © 2025 TST Internet Services
//             </footer>
//         </div>
//     );
// };
//
// export default Layout;

// src/components/Layout.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Layout.css';

import ProfilePage from "../pages/ProfilePage.jsx";
import UserContractsPage from "../pages/UserContractsPage.jsx";
import ManageContractPage from "../pages/ManageContractPage.jsx";
import AdminSubscribersPage from "../pages/AdminSubscribersPage.jsx";
import AdminTariffsPage from "../pages/AdminTariffsPage.jsx";
import AdminReportsPage from "../pages/AdminReportsPage.jsx";

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

    // Функция для рендеринга контента - остается такой же
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

    // Если user еще не загрузился (например, при перезагрузке страницы)
    if (!user) {
        return <div>Загрузка...</div>;
    }
    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="layout-container">
            {/* --- БЛОК 1: Липкий хедер --- */}
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
                    {/*<button onClick={handleLogout} className="logout-button">Выйти</button>*/}
                </div>
            </header>

            {/* --- БЛОК 2: Основной контент (теперь это не <main>, а просто div) --- */}
            <main className="main-content">
                {/* А вот этот div - это видимый контейнер для контента */}
                <div className="page-container">
                    {/*<h1 className="page-title">{activeTabData?.label}</h1>*/}
                    <div className="page-content-wrapper">
                        {renderTabContent()}
                    </div>
                </div>
            </main>

            {/* --- БЛОК 3: Футер --- */}
            <footer className="footer">
                © 2025 TST Internet Services
            </footer>
        </div>
    );
};

export default Layout;