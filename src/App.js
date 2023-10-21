import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Navigate to='/login' />} />
      <Route exact path='/login' element={<LoginPage />} />
      <Route exact path='/register' element={<RegisterPage />} />
      <Route exact path='/home' element={<HomePage />} />
    </Routes>
  );
}

export default App;
