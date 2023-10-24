import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import HomePage from './Pages/HomePage';
import Header from './Components/Header';

function App() {
  const location = useLocation();

  const shouldRenderHeader = !['/login', '/register'].includes(
    location.pathname
  );

  return (
    <main className='App'>
      {shouldRenderHeader && <Header />}
      <Routes>
        <Route exact path='/' element={<Navigate to='/login' />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route exact path='/register' element={<RegisterPage />} />
        <Route exact path='/home' element={<HomePage />} />
      </Routes>
    </main>
  );
}

export default App;
