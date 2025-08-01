// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    // Теперь мы получаем и user, и isLoading
    const { user, isLoading } = useContext(AuthContext);
    const location = useLocation();

    // 1. Если идет первоначальная загрузка, показываем лоадер.
    // Это не тот же isLoading, что в AuthProvider, но логика схожа.
    // Можно удалить этот if, если вы используете `!isLoading && ...` в AuthProvider.
    if (isLoading) {
        return <div>Проверка аутентификации...</div>;
    }

    // 2. Если загрузка завершена, и пользователя НЕТ, перенаправляем.
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Если загрузка завершена, и пользователь ЕСТЬ, показываем страницу.
    return children;
};

export default PrivateRoute;