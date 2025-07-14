import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { login, role, token }

    const login = (userData) => setUser(userData);
    const logout = () => setUser(null);

    // В user будет храниться token, role, login из ответа API
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};