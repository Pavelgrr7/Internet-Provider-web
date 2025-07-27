import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage.jsx";
import Layout from "./components/Layout.jsx";
import UserContractsPage from "./pages/UserContractsPage.jsx";
import PrivateRoute from "./context/PrivateRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminSubscribersPage from './pages/AdminSubscribersPage';
import AdminTariffsPage from './pages/AdminTariffsPage.jsx';
import AdminReportsPage from './pages/AdminReportsPage';
import ManageContractPage from "./pages/ManageContractPage.jsx";


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
            </Routes>
        </BrowserRouter>
    );
}

export default App;