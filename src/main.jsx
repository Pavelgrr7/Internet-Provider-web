import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // <-- Импортируем ваш главный компонент App
import './index.css'; // <-- Импортируем глобальные стили
import { AuthProvider } from './context/AuthContext.jsx'; // <-- Импортируем ваш провайдер аутентификации

// 1. Находим тот самый <div id="root"> в index.html
const rootElement = document.getElementById('root');

// 2. Создаем "корень" рендера React в этом div
const root = ReactDOM.createRoot(rootElement);

// 3. Рендерим (отрисовываем) ваше приложение
root.render(
    <React.StrictMode>
        {/*
      Оборачиваем всё приложение в AuthProvider, чтобы все дочерние
      компоненты имели доступ к информации о пользователе.
    */}
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);