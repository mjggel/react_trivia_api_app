import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Navigate to='/login' />} />
      <Route exact path='/login' element={<LoginPage />} />
      <Route exact path='/register' element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
