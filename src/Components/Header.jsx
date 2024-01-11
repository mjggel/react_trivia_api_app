import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import trivia_logo from '../Images/trivia_logo.png';
import Image from 'react-bootstrap/Image';
import { connect, useDispatch, useSelector } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  setCurrQuestions,
  setQuestions,
} from '../Redux/Reducers/QuestionsReducer';
import user_template from '../Images/user_template_img.png';
import { resetState } from '../Redux/Reducers/UserReducer';

function Header() {
  const { userName } = useSelector((state) => state.PlayerReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find((user) => user.username === userName);
  const loggedUsername = currentUser?.username || 'not logged yet';
  const loggedUserPicture = currentUser?.userpicture || user_template;

  const logout = () => {
    dispatch(setQuestions([]));
    dispatch(setCurrQuestions(0));
    dispatch(resetState({ userName: '', userAssertions: 0, userScore: 0 }));
    navigate('/login');
    return;
  };

  return (
    <>
      <Navbar data-bs-theme='dark' className='bg-body-tertiary'>
        <Container>
          <Navbar.Brand className='justify-content-start'>
            <div style={{ textAlign: 'center' }}>
              <Image
                src={loggedUserPicture}
                alt='user profile picture'
                className='img-fluid mx-auto '
                style={{ maxHeight: '100px' }}
                roundedCircle
              />
              <div>{currentUser?.username}</div>
            </div>
          </Navbar.Brand>

          <Navbar.Brand className='justify-content-center'>
            <Image
              src={trivia_logo}
              alt='Trivia Logo'
              className='img-fluid mx-auto '
              style={{ maxHeight: '100px' }}
            />
          </Navbar.Brand>
          <Navbar.Text>
            Signed in as:
            <NavDropdown title={loggedUsername} id='basic-nav-dropdown'>
              <NavDropdown.Item
                onClick={() =>
                  navigate('/profile', { state: { from: location.pathname } })
                }
              >
                Profile
              </NavDropdown.Item>

              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() =>
                  navigate('/leaderboard', {
                    state: { from: location.pathname },
                  })
                }
              >
                Leaderboard
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Text>
        </Container>
      </Navbar>
    </>
  );
}

export default connect()(Header);
