import React, { createContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../api/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('shieldcheck_user');

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && parsedUser.token) {
                fetch(API_ENDPOINTS.ME, {
                    headers: { Authorization: `Bearer ${parsedUser.token}` }
                })
                    .then(res => {
                        if (!res.ok) throw new Error('Token inválido');
                        return res.json();
                    })
                    .then(userData => {
                        setUser({ ...userData, token: parsedUser.token });
                    })
                    .catch(() => {
                        localStorage.removeItem('shieldcheck_user');
                        setUser(null);
                    })
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token, user) => {
        const userData = { ...user, token };
        setUser(userData);
        localStorage.setItem('shieldcheck_user', JSON.stringify(userData));
    };

    const register = (token, user) => {
        const userData = { ...user, token };
        setUser(userData);
        localStorage.setItem('shieldcheck_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('shieldcheck_user');
    };

    // Gamification hook
    const updateUserPoints = (newPoints) => {
        if (user) {
            const updatedUser = { ...user, points: newPoints };
            setUser(updatedUser);
            localStorage.setItem('shieldcheck_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, setUser, updateUserPoints }}>
            {children}
        </AuthContext.Provider>
    );
};
