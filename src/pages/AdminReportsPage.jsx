// src/pages/AdminReportsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CreateReportForm from '../components/CreateReportForm';
import Modal from '../components/Modal';
import { FaPlus } from 'react-icons/fa';
import '../styles/AdminTablePage.css';

const AdminReportsPage = () => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Состояние для модального окна создания отчета
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Загрузка отчетов при монтировании компонента
    useEffect(() => {
        const fetchReports = async () => {
            if (!user) return;
            try {
                const response = await fetch('http://127.0.0.1:8080/api/reports', {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
                const data = await response.json();
                setReports(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, [user]);


    if (isLoading) return <div className="loading-message">Загрузка отчетов...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;

    const handleCreateReport = async (formData) => {
        console.log("Создание отчета с данными:", formData);
        try {
            const response = await fetch('http://127.0.0.1:8080/api/reports', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Ошибка создания отчета');

            const newReport = await response.json();
            // Иммутабельно добавляем новый отчет в начало списка
            setReports(prevReports => [newReport, ...prevReports]);
            setIsModalOpen(false); // Закрываем окно

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1>Отчёты</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> Новый отчёт
                </button>
            </div>
            <p>Здесь отображается статистика по тарифам за разные периоды.</p>

            <div className="table-container">
                <table className="content-table">
                    <thead>
                    <tr>
                        <th>Год</th>
                        <th>Тариф</th>
                        <th>Кол-во абонентов</th>
                        <th>Сумма платежей (руб.)</th>
                        <th>Мин. срок (дней)</th>
                        <th>Макс. срок (дней)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.length > 0 ? (
                        reports.map((report, index) => (
                            // Используем index в ключе, т.к. отчеты могут повторяться по году/тарифу
                            <tr key={`${report.reportYear}-${report.tariffName}-${index}`}>
                                <td>{report.reportYear}</td>
                                <td>{report.tariffName}</td>
                                <td>{report.subscriberCount}</td>
                                <td>{report.totalPayments.toFixed(2)}</td>
                                <td>{report.minDurationDays}</td>
                                <td>{report.maxDurationDays}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Отчёты не найдены.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <CreateReportForm
                    onSubmit={handleCreateReport}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default AdminReportsPage;