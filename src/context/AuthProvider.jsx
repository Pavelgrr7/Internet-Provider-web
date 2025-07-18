import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Этот хук сработает ОДИН РАЗ при первой загрузке приложения
    useEffect(() => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                // Декодируем токен (логин, роль)
                const decodedToken = jwtDecode(token);

                // срок действия токена
                if (decodedToken.exp * 1000 > Date.now()) {
                    const userData = {
                        token: token,
                        login: decodedToken.sub,
                        role: decodedToken.roles[0]
                    };
                    setUser(userData);
                } else {
                    // Токен просрочен, удаляем его
                    localStorage.removeItem('authToken');
                }
            }
        } catch (error) {
            // Ошибка декодирования, токен невалидный
            console.error("Ошибка при восстановлении сессии:", error);
            localStorage.removeItem('authToken');
        }
    }, []); // Пустой массив зависимостей означает "выполнить только при монтировании"

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('authToken', userData.token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};