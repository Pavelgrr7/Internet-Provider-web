import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div>
            <header>
                <nav>
                    <NavLink to="/dashboard">Мой кабинет</NavLink>
                    {user?.role === 'ROLE_ADMIN' && (
                        <NavLink to="/admin/tariffs">Управление тарифами</NavLink>
                    )}
                </nav>
                <button onClick={logout}>Выйти</button>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>© 2025 Internet Services</footer>
        </div>
    );
}

export default Layout;