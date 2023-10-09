import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
