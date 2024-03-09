import React, { useState } from 'react';
import {
  Form,
  InputGroup,
  Tooltip,
  Button,
  Accordion,
  OverlayTrigger,
  Image,
  Modal,
  Container,
  Col,
} from 'react-bootstrap';
import {
  AiOutlineForm,
  AiFillEyeInvisible,
  AiFillEye,
  AiOutlineLock,
  AiOutlineUnlock,
  AiOutlineUserAdd,
  AiFillPlayCircle,
} from 'react-icons/ai';
import { connect, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTriviaToken } from '../Services/getTriviaToken';
import { setUserName } from '../Redux/Reducers/UserReducer';
import trivia_logo from '../Images/trivia_logo.png';

function WelcomeBackPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const rememberMeUsers = users.filter((user) => user.rememberMe === true);
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: rememberMeUsers[0].username,
    password: '',
    rememberMe: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = await getTriviaToken();

    const userindex = rememberMeUsers.findIndex((user) => {
      return user.username === formData.username;
    });

    const { password } = formData;

    if (!password) {
      setInvalid(true);
      setErrorMessage('Password is required');
      return;
    }

    if (password !== users[userindex].password) {
      setInvalid(true);
      setErrorMessage('Incorrect password');
      return;
    }

    users[userindex].rememberMe = formData.rememberMe;
    users[userindex].token = token;
    localStorage.setItem('users', JSON.stringify(users));
    dispatch(setUserName(formData.username));
    navigate('/home', { state: { from: location.pathname } });
    return;
  };

  return (
    <Modal show={true} size='lg' centered>
      <Modal.Header>
        <Image
          src={trivia_logo}
          alt='Trivia Logo'
          className='img-fluid mx-auto '
          style={{ maxHeight: '100px' }}
        />
      </Modal.Header>

      <Modal.Body className='shadow-lg p-3 mb-5 bg-body rounded'>
        <Container className='d-flex justify-content-center'>
          {rememberMeUsers.length > 1 ? (
            <h1>Welcome back!</h1>
          ) : (
            <h1>Welcome back {rememberMeUsers[0].username}!</h1>
          )}
        </Container>
        {rememberMeUsers.length > 1 ? (
          <Accordion>
            {rememberMeUsers.map((user, index) => (
              <Accordion.Item
                key={index}
                eventKey={index}
                onClick={() =>
                  setFormData({
                    ...formData,
                    username: user.username,
                    rememberMe: true,
                  })
                }
              >
                <Accordion.Header>
                  <Image
                    src={user.userpicture}
                    alt='user profile picture'
                    style={{ height: '50px', width: '50px' }}
                    roundedCircle
                  />
                  <Container>
                    <h3>{user.username}</h3>
                  </Container>
                </Accordion.Header>
                <Accordion.Body>
                  <Form className='mb-3'>
                    <InputGroup className='mb-3'>
                      <InputGroup.Text>
                        <AiOutlineForm />
                      </InputGroup.Text>
                      <Form.Control
                        type='text'
                        name='username'
                        value={user.username}
                        disabled
                      />
                    </InputGroup>
                    <InputGroup className='mb-3'>
                      <InputGroup.Text>
                        {showPassword ? <AiOutlineUnlock /> : <AiOutlineLock />}
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={invalid}
                        placeholder='password'
                      />
                      <OverlayTrigger
                        placement='right'
                        overlay={
                          <Tooltip id='tooltip-right'>
                            {showPassword ? 'Hide' : 'Show'}
                          </Tooltip>
                        }
                      >
                        <Button
                          onClick={() => setShowPassword(!showPassword)}
                          variant='ouline-info'
                          data-testid='register-eye-icon'
                          style={{
                            position: 'absolute',
                            right: '10px',
                            borderColor: 'transparent',
                            zIndex: '10',
                          }}
                        >
                          {showPassword ? (
                            <AiFillEyeInvisible />
                          ) : (
                            <AiFillEye />
                          )}
                        </Button>
                      </OverlayTrigger>
                    </InputGroup>
                    <Form.Group className='mb-3'>
                      <Form.Check
                        type='checkbox'
                        label='Remember me'
                        checked={formData.rememberMe}
                        name='rememberMe'
                        onChange={({ target }) =>
                          setFormData({
                            ...formData,
                            rememberMe: target.checked,
                          })
                        }
                      />
                    </Form.Group>
                    <Container style={{ textAlign: 'center' }}>
                      <Button variant='primary' onClick={handleSubmit}>
                        <AiFillPlayCircle /> Start
                      </Button>
                    </Container>
                  </Form>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Form className='mb-3'>
            <Container className='d-flex justify-content-center'>
              <Image
                src={rememberMeUsers[0].userpicture}
                style={{
                  height: '200px',
                  width: '200px',
                  cursor: 'pointer',
                }}
                roundedCircle
                alt='userpicture'
              />
            </Container>
            <hr />
            <InputGroup className='mb-3'>
              <InputGroup.Text>
                <AiOutlineForm />
              </InputGroup.Text>
              <Form.Control
                type='text'
                name='username'
                value={rememberMeUsers[0].username}
                disabled
              />
            </InputGroup>
            <InputGroup id='editable-profile-password' className='mb-3'>
              <InputGroup.Text>
                {showPassword ? <AiOutlineUnlock /> : <AiOutlineLock />}
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                isInvalid={invalid}
                placeholder='password'
              />
              <OverlayTrigger
                placement='right'
                overlay={
                  <Tooltip id='tooltip-right'>
                    {showPassword ? 'Hide' : 'Show'}
                  </Tooltip>
                }
              >
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  variant='ouline-info'
                  data-testid='register-eye-icon'
                  style={{
                    position: 'absolute',
                    right: '10px',
                    borderColor: 'transparent',
                    zIndex: '10',
                  }}
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </Button>
              </OverlayTrigger>
            </InputGroup>
            <Form.Group className='mb-3'>
              <Form.Check
                type='checkbox'
                label='Remember me'
                checked={formData.rememberMe}
                name='rememberMe'
                onChange={({ target }) =>
                  setFormData({
                    ...formData,
                    rememberMe: target.checked,
                  })
                }
              />
            </Form.Group>
            <Container style={{ textAlign: 'center' }}>
              <Button variant='primary' onClick={handleSubmit}>
                <AiFillPlayCircle /> Start
              </Button>
            </Container>
          </Form>
        )}
        <Container className='text-center'>
          <span className='text-danger'>{errorMessage}</span>
        </Container>
      </Modal.Body>

      <Modal.Footer>
        <Container as={Col} className='text-center mb-3'>
          <span>Not you? Try to Login with another account</span>
          <hr />
          <Button
            variant='primary'
            onClick={() =>
              navigate('/login', { state: { from: location.pathname } })
            }
          >
            Login
          </Button>
        </Container>
        <Container as={Col} className='text-center mb-3'>
          <span>Dont have an account?</span>
          <hr />
          <Button variant='secondary' onClick={() => navigate('/register')}>
            <AiOutlineUserAdd /> Register
          </Button>
        </Container>
      </Modal.Footer>
    </Modal>
  );
}

export default connect()(WelcomeBackPage);
