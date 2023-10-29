import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import trivia_logo from '../Images/trivia_logo.png';
import Image from 'react-bootstrap/Image';
import { connect, useSelector } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';

function Header() {
  const { userName } = useSelector((state) => state.PlayerReducer);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUser = users.find((user) => user.username === userName);

  return (
    <>
      <Navbar data-bs-theme='dark' className='bg-body-tertiary'>
        <Container>
          <Navbar.Brand className='justify-content-start'>
            <div style={{ textAlign: 'center' }}>
              <Image
                src={currentUser?.userpicture}
                alt='user profile picture'
                className='img-fluid mx-auto '
                style={{ maxHeight: '100px' }}
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
            <NavDropdown title={currentUser?.name} id='basic-nav-dropdown'>
              <NavDropdown.Item href='profile'>Profile</NavDropdown.Item>
              <NavDropdown.Item href='leaderboard'>
                Leader Board
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item>Logout</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Text>
        </Container>
      </Navbar>
    </>
  );
}

export default connect()(Header);
