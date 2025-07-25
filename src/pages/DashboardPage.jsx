// src/pages/DashboardPage.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import DashboardCard from '../components/DashboardCard.jsx';
import '../styles/Dashboard.css';

import { FaUserAlt, FaFileContract, FaTags, FaPlusCircle, FaSignOutAlt, FaChartBar, FaUsers } from 'react-icons/fa';

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenu = [
        { title: 'Профиль', description: 'Ваши личные данные', icon: <FaUserAlt />, path: '/dashboard/profile' },
        { title: 'Мой договор', description: 'Информация о договоре', icon: <FaFileContract />, path: '/dashboard/my-contract' },
        { title: 'Мой тариф', description: 'Детали вашего тарифа', icon: <FaTags />, path: '/dashboard/my-tariff' },
        { title: 'Доп. услуги', description: 'Подключить или отключить', icon: <FaPlusCircle />, path: '/dashboard/services' },
        { title: 'Выход', description: 'Завершить сеанс', icon: <FaSignOutAlt />, action: logout }
    ];

    const adminMenu = [
        { title: 'Профиль', description: 'Ваши личные данные', icon: <FaUserAlt />, path: '/dashboard/profile' },
        { title: 'Мои отчёты', description: 'Статистика и аналитика', icon: <FaChartBar />, path: '/dashboard/admin/reports' },
        { title: 'Тарифы', description: 'Управление тарифами', icon: <FaTags />, path: '/dashboard/admin/tariffs' },
        { title: 'Пользователи', description: 'Управление абонентами', icon: <FaUsers />, path: '/dashboard/admin/subscribers' },
        { title: 'Выход', description: 'Завершить сеанс', icon: <FaSignOutAlt />, action: handleLogout }
    ];

    const menuItems = user?.role === 'ROLE_ADMIN' ? adminMenu : userMenu;

    // Функция-обработчик клика по карточке
    const handleCardClick = (item) => {
        if (item.action) {
            item.action();
            navigate('/login');
        } else if (item.path) {
            navigate(item.path);
        }
    };

    if (!user) {
        return <div>Загрузка данных пользователя...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>Добро пожаловать, {user.login}!</h1>
            <p>Выберите раздел для перехода в личном кабинете.</p>
            <hr />

            <div className="dashboard-grid">
                {/* Рендер карточек с помощью .map() */}
                {menuItems.map((item) => (
                    <DashboardCard
                        key={item.title}
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        onClick={() => handleCardClick(item)}
                    />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;