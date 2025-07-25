// src/components/DashboardCard.jsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Пример иконки

const DashboardCard = ({ title, description, icon, onClick }) => {
    return (
        // Весь div будет кликабельным
        <div className="dashboard-card" onClick={onClick}>
            <div className="card-icon">
                {icon}
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default DashboardCard;