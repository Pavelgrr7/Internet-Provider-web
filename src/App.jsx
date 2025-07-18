import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage.jsx";
import Layout from "./components/Layout.jsx";
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
            <div>
                <Routes>
                    <Route
                        path="/"
                        element={
                                <Layout />
                        }
                    >
                        {/* А это - дочерние маршруты. Они будут рендериться ВНУТРИ <Outlet /> */}
                        <Route path="dashboard" element={<DashboardPage />} />
                        {/*<Route path="admin/tariffs" element={<AdminTariffPage />} />*/}
                    </Route>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* здесь будут и другие маршруты */}
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;