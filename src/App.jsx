import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from "./components/common/Layout.jsx";
import PrivateRoute from "./context/PrivateRoute.jsx";
import AdminSubscriberDetailPage from "./pages/AdminSubscriberDetailPage.jsx";


function HomePage() {
    return (
        <div>
            <h1>Главная страница</h1>
            <nav>
                <Link to="/login">Вход в личный кабинет</Link>
            </nav>
            <p></p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные роуты, доступные всем */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Layout />
                        </PrivateRoute>
                    }
                />
                <Route path="/dashboard/admin/subscribers/:subscriberId" element={<AdminSubscriberDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;