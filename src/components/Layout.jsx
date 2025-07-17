import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <header>
                <nav>
                    <NavLink to="/dashboard">Мой кабинет</NavLink>

                    {user?.role === 'ROLE_ADMIN' && (
                        <NavLink to="/admin">Панель администратора</NavLink>
                    )}
                </nav>
                <button onClick={logout}>Выйти</button>
            </header>
            <main>
                {children}
            </main>
            <footer>© 2025 T-s-t Internet Services</footer>
        </div>
    );
}