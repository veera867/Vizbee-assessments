import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        // Load auth token from local storage on component mount
        const storedAuthToken = localStorage.getItem('authToken');
        if (storedAuthToken) {
            setAuthToken(storedAuthToken);
        } else {
            navigate('/auth/register');
        }
    }, []);

    const login = async (username, password) => {
        try {
            // Call your login API to get the auth token
            const response = await axios.post('/api/login', { username, password });
            const authToken = response.data.authToken;
            
            // Store the auth token in context and local storage
            setAuthToken(authToken);
            localStorage.setItem('authToken', authToken);
        } catch (error) {
            // Handle login error
            console.error(error);
        }
    };

    const logout = () => {
        // Clear auth token and remove it from local storage
        setAuthToken('');
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
