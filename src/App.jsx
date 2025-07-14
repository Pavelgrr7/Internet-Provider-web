import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Защищенный маршрут для ОБЫЧНОГО пользователя */}
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['ROLE_USER']}>
                        <DashboardPage />
                    </ProtectedRoute>
                } />

                {/* Защищенный маршрут для АДМИНА */}
                <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                        <AdminPage />
                    </ProtectedRoute>
                } />

                {/* ... другие маршруты ... */}
            </Routes>
        </BrowserRouter>
    );
}