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

                    {/* Показываем ссылку только если роль пользователя - ADMIN */}
                    {/* Будет сделано позже */}
                    {user?.role === 'ROLE_ADMIN' && (
                        <NavLink to="/admin">Панель администратора</NavLink>
                    )}
                </nav>
                <button onClick={logout}>Выйти</button>
            </header>
            <main>
                {children} {/* Здесь будет отображаться основной контент страницы */}
            </main>
            <footer>© 2024 T-s-t Internet Services</footer>
        </div>
    );
}