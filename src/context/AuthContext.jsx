import React, { createContext, useContext, useState, useEffect } from 'react';
import credentialsData from '../data/credentials.json';
import { syncDataWithStorage } from '../utils/syncUtils';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [credentials, setCredentials] = useState(credentialsData);

    useEffect(() => {
        // Sync credentials data with localStorage on every refresh
        const syncedCredentials = syncDataWithStorage('era_credentials_v1', credentialsData);
        setCredentials(syncedCredentials);

        // Check for existing session in localStorage
        const storedUser = localStorage.getItem('era_auth_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (phone, password) => {
        const credential = credentials[phone];
        if (credential && credential.password === password) {
            const userData = {
                phone,
                familyId: credential.familyId,
                name: credential.name,
                role: 'family'
            };
            setUser(userData);
            localStorage.setItem('era_auth_user', JSON.stringify(userData));
            return { success: true };
        }
        return { success: false, message: 'Invalid phone number or password' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('era_auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
