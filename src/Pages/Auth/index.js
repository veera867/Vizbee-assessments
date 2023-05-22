import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Login';

import './index.css';

function AuthLayout() {
    return (
        <div className="auth_layout">
            <div className="auth_component">
                <Routes>
                    <Route path="/" element={<Navigate to="/auth/login" />} />
                    <Route path="/login" element={<Login />}></Route>
                </Routes>
            </div>
        </div>
    )
}

export default AuthLayout;