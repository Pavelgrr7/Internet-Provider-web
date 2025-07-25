// src/context/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // 1. Добавляем новое состояние. Изначально мы "в процессе загрузки".
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    const userData = {
                        token: token,
                        login: decodedToken.sub,
                        role: decodedToken.roles[0]
                    };
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error("Ошибка восстановления сессии:", error);
            // Убеждаемся, что пользователь 'null', если токен невалидный
            setUser(null);
            localStorage.removeItem('authToken');
        } finally {
            // 2. В любом случае (успех или провал), мы завершаем загрузку.
            setIsLoading(false);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('authToken', userData.token);
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    // 3. Передаем isLoading в контекст вместе с остальными данными
    const value = { user, login, logout, isLoading };

    return (
        // 4. Не рендерим дочерние элементы, пока идет начальная загрузка.
        // Это предотвращает рендер PrivateRoute до того, как мы узнаем, есть ли пользователь.
        !isLoading && <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};