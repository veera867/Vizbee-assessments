import React from 'react';
import {Routes , Route , Navigate } from 'react-router-dom';
import AppLayout from './Pages';

import './custom-theme.less';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" />} />
      <Route path="/*" element={<AppLayout />}></Route>
    </Routes>
)
}

export default App