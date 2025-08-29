// src/LoginPage.jsx
import React, {useContext, useState} from 'react';
import '../styles/LoginPage.css';
import {AuthContext} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { login: authLogin } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const requestBody = JSON.stringify({ "login": login, "password": password });
        console.log('Отправляю данные:', requestBody);

        const url = "http://127.0.0.1:8080/api/auth/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody,
            });

            if (!response.ok) {
                console.error("Ошибка аутентификации:", response.status);
                return;
            }

            const data = await response.json();
            console.log("Получен ответ:", data);

            // AuthContext(data)

            if (data.token) {
                authLogin(data);
                localStorage.setItem('authToken', data.token);
                navigate('/dashboard');
            }

        } catch (error) {
            console.error("Сетевая ошибка или ошибка в запросе:", error);
        }
    };

    return (
        <div className="login-container">
            <h1>Личный кабинет</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Логин</label>
                    <input
                        type="text"
                        id="username"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        {isPasswordVisible ? "🙈" : "👁"}
                    </button>
                </div>
                <button type="submit" id="login_button">Войти</button>
            </form>
        </div>
    );
}

export default LoginPage;