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
import LeaderBoard from './Pages/LeaderBoard';
import ProfilePage from './Pages/ProfilePage';
import WelcomeBackPage from './Pages/WelcomeBackPage';

function App() {
  const { userName } = useSelector((state) => state.PlayerReducer);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const token = users.find((user) => user.username === userName)?.token || null;
  const rememberMeUsers =
    users.find((user) => user.rememberMe === true) || null;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const protectedPaths = ['/home', '/game', '/feedback', '/profile'];
    const isProtectedPath = protectedPaths.includes(location.pathname);

    if (isProtectedPath && (!token || !users)) {
      navigate('/login');
    }

    if (
      rememberMeUsers &&
      location.pathname === '/login' &&
      !['/validation', '/register'].includes(location.state?.from)
    ) {
      navigate('/validation');
    }
  }, [navigate, location]);

  const shouldRenderHeader = !['/login', '/register', '/validation'].includes(
    location.pathname
  );

  return (
    <main className='App'>
      {shouldRenderHeader && <Header />}
      <Routes>
        <Route exact path='/' element={<Navigate to='/login' />} />
        <Route exact path='/login' element={<LoginPage />} />
        <Route path='*' element={<Navigate to='/login' />} />
        <Route exact path='/register' element={<RegisterPage />} />
        <Route exact path='/home' element={<HomePage />} />
        <Route exact path='/game' element={<GamePage />} />
        <Route exact path='/feedback' element={<FeedBackPage />} />
        <Route exact path='/leaderboard' element={<LeaderBoard />} />
        <Route exact path='/profile' element={<ProfilePage />} />
        <Route exact path='/validation' element={<WelcomeBackPage />} />
      </Routes>
    </main>
  );
}

export default connect()(App);
