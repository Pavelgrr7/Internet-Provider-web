// src/components/SubscriberForm.jsx
import React, { useState } from 'react';

//todo решить проблему с fullname (на бекенде и в бд firstName, middleName, lastName
// initialData - для будущего редактирования, onCancel и onSubmit - для управления из визарда
const SubscriberForm = ({ onCancel, onSubmit, initialData = {} }) => {

    // Состояние для всех полей абонента
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || '',
        passportSeriesNumber: initialData?.passportSeriesNumber || '',
        phoneNumber: initialData?.phoneNumber || '',
        email: initialData?.email || '',
        login: initialData?.login || '',
        password: '', // Пароль всегда пустой для безопасности
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const nameParts = formData.fullName.trim().split(/\s+/); // Разделяем по одному или нескольким пробелам

        // Собираем объект для отправки на бэкенд, уже с разделенными полями
        const backendReadyData = {
            ...formData, // Копируем все остальные поля (passport, email, login...)
            lastName: nameParts[0] || '', // Фамилия
            firstName: nameParts[1] || '', // Имя
            middleName: nameParts[2] || '', // Отчество
            fullName: undefined, // Удаляем поле fullName, чтобы не отправлять его
        };

        // Удаляем fullName из объекта, если он там есть
        delete backendReadyData.fullName;

        // Передаем на следующий шаг уже подготовленные данные
        onSubmit(backendReadyData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Шаг 1: Данные нового абонента</h2>

            <div className="form-group">
                <label htmlFor="fullName">ФИО</label>
                <input id="fullName" type="text" value={formData.fullName} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="passportSeriesNumber">Паспорт (серия и номер)</label>
                <input id="passportSeriesNumber" type="text" value={formData.passportSeriesNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="phoneNumber">Телефон</label>
                <input id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <hr />
            <h4>Данные для входа в личный кабинет</h4>
            <div className="form-group">
                <label htmlFor="login">Логин</label>
                <input id="login" type="text" value={formData.login} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="password">Пароль</label>
                <input id="password" type="password" value={formData.password} onChange={handleInputChange} required />
            </div>

            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">Отмена</button>
                <button type="submit" className="btn btn-primary">Далее</button>
            </div>
        </form>
    );
};

export default SubscriberForm;