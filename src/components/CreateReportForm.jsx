// src/components/CreateReportForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const CreateReportForm = ({ onSubmit, onCancel }) => {
    const { user } = useContext(AuthContext);

    // --- Состояния для выпадающих списков ---
    const [tariffs, setTariffs] = useState([]);
    const [years, setYears] = useState([]);

    // --- Состояния для выбранных значений ---
    const [selectedTariff, setSelectedTariff] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    // Функция для загрузки данных (тарифы/года)
    const fetchData = async (url, setter) => {
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${user.token}` }});
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error("Ошибка загрузки данных для формы:", error);
        }
    };

    // 1. При первой загрузке компонента, загружаем ВСЕ тарифы и ВСЕ возможные года
    useEffect(() => {
        fetchData('http://127.0.0.1:8080/api/tariffs/active-in-year', setTariffs);
        // Генерируем список годов, например, с 2020 до текущего
        const currentYear = new Date().getFullYear();
        const yearOptions = [];
        for (let y = currentYear; y >= 2020; y--) yearOptions.push(y);
        setYears(yearOptions);
    }, [user]);

    // 2. При ИЗМЕНЕНИИ выбранного тарифа, перезагружаем список доступных годов
    useEffect(() => {
        if (selectedTariff) {
            fetchData(`http://127.0.0.1:8080/api/tariffs/${selectedTariff}/active-years`, setYears);
        }
    }, [selectedTariff]); // Зависимость от selectedTariff

    // 3. При ИЗМЕНЕНИИ выбранного года, перезагружаем список доступных тарифов
    useEffect(() => {
        if (selectedYear) {
            fetchData(`http://127.0.0.1:8080/api/tariffs/active-in-year?year=${selectedYear}`, setTariffs);
        }
    }, [selectedYear]); // Зависимость от selectedYear

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ tariffId: selectedTariff, reportYear: selectedYear });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Создание нового отчёта</h2>
            <div className="form-group">
                <label htmlFor="tariff-select">Тариф</label>
                <select
                    id="tariff-select"
                    value={selectedTariff}
                    onChange={e => setSelectedTariff(e.target.value)}
                    required
                >
                    <option value="" disabled>Выберите тариф</option>
                    {tariffs.map(tariff => (
                        <option key={tariff.id} value={tariff.id}>{tariff.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="year-select">Год отчёта</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    required
                >
                    <option value="" disabled>Выберите год</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="form-actions">
                <button type="button" onClick={onCancel} className="btn btn-secondary">Отмена</button>
                <button type="submit" className="btn btn-primary">Сгенерировать</button>
            </div>
        </form>
    );
};

export default CreateReportForm;