import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import AdminPage from './pages/AdminPage';
// import ProtectedRoute from './components/ProtectedRoute';

function HomePage() {
    return (
        <div>
            <h1>Главная страница</h1>
            <p>Вы успешно вошли в систему!</p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* здесь будут и другие маршруты */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;