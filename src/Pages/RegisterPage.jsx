import {
  Modal,
  Image,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Button,
  CloseButton,
} from 'react-bootstrap';
import {
  AiOutlineUser,
  AiOutlineLock,
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineUnlock,
  AiOutlineArrowLeft,
  AiOutlineMail,
  AiOutlineUserAdd,
  AiOutlineForm,
} from 'react-icons/ai';
import React, { useRef, useState } from 'react';
import trivia_logo from '../Images/trivia_logo.png';
import user_template from '../Images/user_template_img.png';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    userpicture: user_template,
    name: '',
    username: '',
    email: '',
    password: '',
    rememberMe: false,
  });
  const handleUserPictureChange = ({ target }) => {
    const file = target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        userpicture: reader.result,
      }));
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password, name, email } = formData;

    if (!username || !password || !name || !email) {
      setInvalid(true);
      setErrorMessage('All fields are required');
      return;
    }
    if (users.some((user) => user.username === username)) {
      setInvalid(true);
      setErrorMessage('Username already exists');
      return;
    }

    if (users.some((user) => user.email === email)) {
      setInvalid(true);
      setErrorMessage('Email already exists');
      return;
    }

    localStorage.setItem('users', JSON.stringify([...users, { ...formData }]));
    navigate('/login', { state: { from: location.pathname } });
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
        <Modal.Title>
          Register Page
          {formData.userpicture !== user_template && (
            <CloseButton
              style={{ position: 'absolute', right: '10px', top: '10px' }}
              onClick={() =>
                setFormData({ ...formData, userpicture: user_template })
              }
            />
          )}
        </Modal.Title>
        <Form>
          <InputGroup
            className='mb-3'
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Form.Control
              data-testid='register-userpicture'
              type='file'
              ref={fileInputRef}
              key={formData.userpicture}
              accept='image/*'
              style={{ display: 'none' }}
              onChange={handleUserPictureChange}
            />
            <Image
              src={formData.userpicture}
              style={{
                height: '200px',
                width: '200px',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current.click()}
              roundedCircle
              alt='userpicture'
            />
          </InputGroup>

          <InputGroup id='register-name' className='mb-3'>
            <InputGroup.Text>
              <AiOutlineForm />
            </InputGroup.Text>
            <Form.Control
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              isInvalid={invalid}
              placeholder='your name'
            />
          </InputGroup>

          <InputGroup id='register-username' className='mb-3'>
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

          <InputGroup id='register-email' className='mb-3'>
            <InputGroup.Text>
              <AiOutlineMail />
            </InputGroup.Text>
            <Form.Control
              type='text'
              name='email'
              value={formData.email}
              onChange={handleChange}
              isInvalid={invalid}
              placeholder='email'
            />
          </InputGroup>

          <InputGroup id='register-password' className='mb-3'>
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
        </Form>
        <span className='text-danger'>{errorMessage}</span>
      </Modal.Body>

      <Modal.Footer className='justify-content-between'>
        <Button
          variant='ouline-info'
          data-testid='back-arrow-button'
          style={{
            backgroundColor: 'transparent',
          }}
          onClick={() =>
            navigate('/login', { state: { from: location.pathname } })
          }
        >
          <AiOutlineArrowLeft size={25} />
        </Button>

        <Button variant='secondary' onClick={handleSubmit}>
          <AiOutlineUserAdd /> Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
