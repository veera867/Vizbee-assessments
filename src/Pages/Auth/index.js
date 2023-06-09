import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Login';
import UserRegister from './register/register'
import './index.css';

function AuthLayout() {
    return (
        <div className="auth_layout">
            <div className="auth_component">
                <Routes>
                    <Route path="/" element={<Navigate to="/auth/login" />} />
                    <Route path="/login" element={<Login />}></Route> 
                    <Route path="/register" element={<UserRegister />}></Route>                                     
                </Routes>
            </div>
        </div>
    )
}

export default AuthLayout;