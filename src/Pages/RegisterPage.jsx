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
  const [errMessage, setErrorMessage] = useState('');
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

    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setFormData((prevState) => ({
        ...prevState,
        userpicture: imageUrl,
      }));
    }
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
    if (
      !formData.username ||
      !formData.password ||
      !formData.name ||
      !formData.email
    ) {
      setInvalid(true);
      setErrorMessage('All fields are required');
      return;
    }

    localStorage.setItem('users', JSON.stringify([formData, ...users]));
    navigate('/login');
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
            id='login-userpicture'
            className='mb-3'
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Form.Control
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

          <InputGroup id='login-name' className='mb-3'>
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

          <InputGroup id='login-email' className='mb-3'>
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
        </Form>
        <span className='text-danger'>{errMessage}</span>
      </Modal.Body>

      <Modal.Footer className='justify-content-between'>
        <Button variant='outline_info' onClick={() => navigate('/login')}>
          <AiOutlineArrowLeft size={25} />
        </Button>

        <Button variant='secondary' onClick={handleSubmit}>
          <AiOutlineUserAdd /> Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
