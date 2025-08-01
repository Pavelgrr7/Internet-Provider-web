import '../styles/index.css';
import React, {useState} from "react";

function AdminUserListWidget() {
    const [tariffName, setTariffName] = useState('');
    const [reportYear, setReportYear] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault(); // Отменяем стандартное поведение формы (перезагрузку страницы)
        const requestBody = JSON.stringify({ "reportYear": reportYear, "tariffName": tariffName });
        const url = "http://127.0.0.1:8080/api/report/";
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
                // authLogin(data);
                // localStorage.setItem('authToken', data.token);
                // navigate('/dashboard');
            }

        } catch (error) {
            console.error("Сетевая ошибка или ошибка в запросе:", error);
        }


    };


    const AdminUserListWidget = () => {
        return (
            <div>
                <h2>Составление отчёта</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="report_year">Год</label>
                        <input
                            type="text"
                            id="report_year"
                            value={reportYear} // Значение привязано к состоянию
                            onChange={(e) => setReportYear(e.target.value)} // При изменении обновляем состояние
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="tariffName">Название тарифа</label>
                        <input
                            type={"text"}
                            id="tariffName"
                            value={tariffName}
                            onChange={(e) => setTariffName(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" id="report_button">Составить отчёт</button>
                </form>
            </div>
        );
    };
}

export default AdminUserListWidget;