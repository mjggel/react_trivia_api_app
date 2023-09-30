import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  );
}

export default App;
