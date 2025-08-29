// // src/pages/DashboardPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
// import '../styles/DashboardTabs.css';

import ProfilePage from './ProfilePage';
import UserContractsPage from './UserContractsPage.jsx';
import AdminSubscribersPage from './AdminSubscribersPage';
import AdminTariffsPage from "./AdminTariffsPage.jsx";
import AdminReportsPage from "./AdminReportsPage.jsx";
import ManageContractPage from "./ManageContractPage.jsx";
//
// // Компонент-заглушка для общей информации
// const OverviewTab = ({ user }) => (
//     <div>
//         <div className="dashboard-header">
//             <h1>Добро пожаловать, {user.login}!</h1>
//             <p>Это ваш личный кабинет.</p>
//             <hr />
//         </div>
//         <h2>Общая информация</h2>
//         <p>Ваша роль: {user.role === 'ROLE_ADMIN' ? 'Администратор' : 'Абонент'}</p>
//         <p>Завершить сессию вы можете во вкладке "Профиль"</p>
//     </div>
// );
//
//
// const DashboardPage = () => {
//     const { user } = useContext(AuthContext);
//     // const navigate = useNavigate();
//
//
//     // 1. Состояние для хранения активной вкладки.
//     // 'overview' - это наша начальная вкладка.
//     const [activeTab, setActiveTab] = useState('overview');
//
//     // 2. Определяем вкладки для каждой роли
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
//
//     const tabs = user?.role === 'ROLE_ADMIN' ? adminTabs : userTabs;
//
//     // 3. Функция для рендеринга контента активной вкладки
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
//                 // eslint-disable-next-line no-unreachable
//             {/* todo остальные вкладки */}
//         }
//     };
//
//     if (!user) {
//         return <div>Загрузка...</div>;
//     }
//
//     return (
//         <>
//             {/* БЛОК 2: Панель вкладок. Теперь это независимый элемент. */}
//             <div className="tabs-bar-container">
//                 <div className="tabs-bar">
//                     {tabs.map(tab => (
//                         <button
//                             key={tab.id}
//                             className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
//                             onClick={() => setActiveTab(tab.id)}
//                         >
//                             {tab.label}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//
//             {/* БЛОК 2: Контейнер для контента вкладки. */}
//             <div className="tab-content-container">
//                 <div className="tab-content">
//                     {renderTabContent()}
//                 </div>
//             </div>
//         </>
//     );
// };
//

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    if (!user) return null;

    return (
        <>
        </>
    );
};
export default DashboardPage;
