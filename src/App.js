import React from 'react';
import {Routes , Route , Navigate } from 'react-router-dom';
import AppLayout from './Pages';

import './custom-theme.less';
import AuthLayout from './Pages/Auth';
import VerifyCode from './Pages/Assessment/VerifyCode';
import Assessment from './Pages/Assessment';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />} />
      <Route path="/auth/*" element={<AuthLayout />}></Route>
      <Route path="/app/*" element={<AppLayout />}></Route>

      <Route path="/assessment" element={<VerifyCode />}></Route>
      <Route path="/assessment/:code" element={<Assessment />}></Route>
    </Routes>
)
}

export default App