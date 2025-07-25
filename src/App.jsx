import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage.jsx";
import Layout from "./components/Layout.jsx";
import UserContractsPage from "./pages/UserContractPage.jsx";
import PrivateRoute from "./context/PrivateRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
// import DashboardPage from './pages/DashboardPage';
// import AdminPage from './pages/AdminPage';
// import ProtectedRoute from './components/ProtectedRoute';

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
                >
                    {/* Дочерние роуты. path указывается относительно родителя. */}
                    <Route index element={<DashboardPage />} />

                    <Route path="my-contract" element={<UserContractsPage />} />
                    <Route path="profile" element={<ProfilePage />} />

                    {/* Здесь будут другие роуты личного кабинета */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;