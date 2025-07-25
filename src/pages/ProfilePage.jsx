import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa'; // Иконка карандаша
import '../styles/ProfilePage.css';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');

    const [message, setMessage] = useState('');

    const url = 'http://127.0.0.1:8080/api/users/my';

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("authToken")}`
                    }
                });

                console.log('Отправляю запрос на ' + url.toString());

                if (!response.ok) {
                    throw new Error(`Ошибка сети: ${response.status}`);
                }

                const data = await response.json();
                console.log(`полученные данные профиля: ${data}`);

                setProfileData(data);

            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();

    }, [user]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage(''); // Сбрасываем сообщение

        const response = await fetch('/api/users/my/password', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        if (response.ok) {
            setMessage('Пароль успешно обновлен!');
            setCurrentPassword('');
            setNewPassword('');
        } else {
            setMessage('Ошибка при смене пароля. Проверьте текущий пароль.');
        }
    };

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setMessage('');

        const response = await fetch('/api/users/my/email', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newEmail })
        });

        if (response.ok) {
            setMessage('Email успешно обновлен!');
            // Обновляем email в локальном состоянии
            setProfileData(prev => ({ ...prev, email: newEmail }));
            setIsEditingEmail(false);
        } else {
            setMessage('Ошибка при смене email.');
        }
    };


    if (isLoading) return <div>Загрузка вашего профиля...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!profileData) return <div>Ошибка загрузки профиля.</div>;


    return (
        <div className="profile-container">
            <h1>Ваш профиль</h1>
            <div className="profile-card">
                <h3>Личные данные</h3>
                <p><strong>ФИО:</strong> {profileData.lastName} {profileData.firstName} {profileData.middleName}</p>

                {/* --- БЛОК ДЛЯ EMAIL --- */}
                <div className="profile-field">
                    <strong>Электронная почта:</strong>
                    {isEditingEmail ? (
                        <form onSubmit={handleEmailChange} className="inline-form">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                required
                            />
                            <button type="submit">Сохранить</button>
                            <button type="button" onClick={() => setIsEditingEmail(false)}>Отмена</button>
                        </form>
                    ) : (
                        <>
                            <span>{profileData.email}</span>
                            <button className="edit-btn" onClick={() => { setIsEditingEmail(true); setNewEmail(profileData.email); }}>
                                <FaEdit />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* --- БЛОК ДЛЯ СМЕНЫ ПАРОЛЯ --- */}
            <div className="profile-card">
                <h3>Смена пароля</h3>
                <form onSubmit={handlePasswordChange}>
                    <div className="input-group">
                        <label htmlFor="currentPassword">Текущий пароль</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="newPassword">Новый пароль</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Обновить пароль</button>
                </form>
            </div>

            {/* Сообщение для пользователя */}
            {message && <div className="profile-message">{message}</div>}
        </div>
    );
};

export default ProfilePage;