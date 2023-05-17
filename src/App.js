import React from 'react';
import {Routes , Route , Navigate } from 'react-router-dom';
import AppLayout from './Pages';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/assessment" />} />
      <Route path="/*" element={<AppLayout />}></Route>
    </Routes>
)
}

export default App