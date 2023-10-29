import React, { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import HomePage from './Pages/HomePage';
import Header from './Components/Header';
import GamePage from './Pages/GamePage';
import { connect, useSelector } from 'react-redux';
import FeedBackPage from './Pages/FeedBackPage';

function App() {
  const { userName } = useSelector((state) => state.PlayerReducer);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const token = users.find((user) => user.username === userName)?.token || null;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (['/home', '/game'].includes(location.pathname) && !token) {
      navigate('/login');
    }
  }, []);

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
        <Route exact path='/game' element={<GamePage />} />
        <Route exact path='/feedback' element={<FeedBackPage />} />
      </Routes>
    </main>
  );
}

export default connect()(App);
