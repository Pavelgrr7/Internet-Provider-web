import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage.jsx";
import Layout from "./components/Layout.jsx";
import UserContractsPage from "./pages/UserContractPage.jsx";
import PrivateRoute from "./context/PrivateRoute.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AdminSubscribersPage from './pages/AdminSubscribersPage';
import AdminTariffsPage from './pages/AdminTariffsPage.jsx';


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
                    <Route path="admin/subscribers" element={<AdminSubscribersPage />} />
                    <Route path="admin/tariffs" element={<AdminTariffsPage />} />

                    {/* Здесь будут другие роуты личного кабинета */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;