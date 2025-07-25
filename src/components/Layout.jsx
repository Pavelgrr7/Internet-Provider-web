// import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/Layout.css'

const Layout = () => {
    // const { user, logout } = useContext(AuthContext);
    return (
        <div className="layout-container">
            <header>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="footer">
                © 2025 TST Internet Services
            </footer>
        </div>
    );
}

export default Layout;