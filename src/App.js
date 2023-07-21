import React from 'react';
import {Routes , Route , Navigate } from 'react-router-dom';
import AppLayout from './Pages/index';

import './custom-theme.less';
import AuthLayout from './Pages/Auth';
import VerifyCode from './Pages/LiveAssessment/VerifyCode';
import Assessment from './Pages/LiveAssessment/index';
import Greeting from './Pages/LiveAssessment/Greeting';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" />} />
      <Route path="/auth/*" element={<AuthLayout />}></Route> 
      <Route path="/app/*" element={<AppLayout />}></Route>

      <Route path="/assessment" element={<VerifyCode />}></Route>
      <Route path="/assessment/:code" element={<Assessment />}></Route>
      <Route path="/assessment/greetings/:type" element={<Greeting />}></Route>
    </Routes>
)
}

export default App