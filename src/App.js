import React from 'react';
import {Routes , Route , Navigate } from 'react-router-dom';
import AppLayout from './Pages';

import './custom-theme.less';
import AuthLayout from './Pages/Auth';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />} />
      <Route path="/auth/*" element={<AuthLayout />}></Route>
      <Route path="/app/*" element={<AppLayout />}></Route>
    </Routes>
)
}

export default App