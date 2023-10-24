import {
  Modal,
  Image,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Button,
} from 'react-bootstrap';
import {
  AiOutlineUser,
  AiOutlineLock,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineUnlock,
  AiFillSetting,
  AiOutlineUserAdd,
  AiFillPlayCircle,
  AiOutlineBorder,
  AiOutlineCheckSquare,
} from 'react-icons/ai';
import React, { useState } from 'react';
import trivia_logo from '../Images/trivia_logo.png';
import { useNavigate } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { setUserName } from '../Redux/Reducers/UserReducer';
import { getTriviaToken } from '../Services/getTriviaToken';
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [errMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = await getTriviaToken();

    if (!formData.username || !formData.password) {
      setInvalid(true);
      setErrorMessage('All fields are required');
      return;
    }

    const authenticatedUserIndex = users.findIndex((user) => {
      return (
        user.username === formData.username &&
        user.password === formData.password
      );
    });

    if (authenticatedUserIndex === -1) {
      setInvalid(true);
      setErrorMessage('Username or password is invalid');
      return;
    }

    users[authenticatedUserIndex].rememberMe = formData.rememberMe;
    users[authenticatedUserIndex].token = token;
    localStorage.setItem('users', JSON.stringify(users));
    dispatch(setUserName(users[authenticatedUserIndex].username));
    navigate('/home');
  };

  return (
    <Modal show={true} size='md' centered>
      <Modal.Header>
        <Image
          src={trivia_logo}
          alt='Trivia Logo'
          className='img-fluid mx-auto '
          style={{ maxHeight: '100px' }}
        />
      </Modal.Header>

      <Modal.Body className='text-center'>
        <Modal.Title>Login Page</Modal.Title>
        <Form>
          <InputGroup id='login-username' className='mb-3'>
            <InputGroup.Text>
              <AiOutlineUser />
            </InputGroup.Text>
            <Form.Control
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              isInvalid={invalid}
              placeholder='username'
            />
          </InputGroup>

          <InputGroup id='login-password' className='mb-3'>
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
                data-testid='eye-icon'
                variant='ouline-info'
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

          {formData.username && formData.password && (
            <label>
              <Button
                name='rememberMe'
                value={formData.rememberMe}
                onClick={() =>
                  setFormData((prevState) => ({
                    ...prevState,
                    rememberMe: !formData.rememberMe,
                  }))
                }
                variant='outline-info'
                style={{
                  borderColor: 'transparent',
                }}
              >
                {formData.rememberMe ? (
                  <AiOutlineCheckSquare size={20} />
                ) : (
                  <AiOutlineBorder size={20} />
                )}
              </Button>
              Remember Me
            </label>
          )}
        </Form>
        <span className='text-danger'>{errMessage}</span>
      </Modal.Body>

      <Modal.Footer className='justify-content-around'>
        <Button variant='info' onClick={() => navigate('/leaderboard')}>
          <AiFillSetting /> Leaderboard
        </Button>

        <Button variant='primary' onClick={handleSubmit}>
          <AiFillPlayCircle /> Start
        </Button>

        <Button variant='secondary' onClick={() => navigate('/register')}>
          <AiOutlineUserAdd /> Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default connect()(LoginPage);
