import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';

const rootElement = document.getElementById('root');

// "корень" рендера React в этом div
const root = ReactDOM.createRoot(rootElement);

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