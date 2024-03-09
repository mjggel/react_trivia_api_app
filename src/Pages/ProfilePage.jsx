import {
  Container,
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
  AiOutlineEdit,
} from 'react-icons/ai';
import React, { useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import user_template from '../Images/user_template_img.png';
import { setUserName } from '../Redux/Reducers/UserReducer';

function ProfilePage() {
  const [editProfile, setEditProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const { userName } = useSelector((state) => state.PlayerReducer);
  const user = users.find((user) => user.username === userName);
  const fileInputRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userpicture: user.userpicture,
    name: user.name,
    username: user.username,
    email: user.email,
    password: '',
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

  const handleSave = () => {
    const findIndexOfUser = users.findIndex((e) => e === user);
    const { username, password, name, email } = formData;
    const updateUsers = [...users];
    const newUserInfo = !password
      ? { ...formData, password: user.password }
      : formData;

    if (
      formData.username !== user.username &&
      users.some((user) => user.username === username)
    ) {
      setInvalid(true);
      setErrorMessage('Username already exists');
      return;
    }

    if (
      formData.email !== user.email &&
      users.some((user) => user.email === email)
    ) {
      setInvalid(true);
      setErrorMessage('Email already exists');
      return;
    }

    if (!username || !name || !email) {
      setInvalid(true);
      setErrorMessage('All fields are required');
      return;
    }

    if (formData.username !== user.username) {
      dispatch(setUserName(formData.username));
    }

    updateUsers[findIndexOfUser] = {
      ...updateUsers[findIndexOfUser],
      ...newUserInfo,
    };

    localStorage.setItem('users', JSON.stringify(updateUsers));
    setEditProfile(false);
  };

  return (
    <Container className='text-center p-3' style={{ marginTop: '30px' }}>
      <Container style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant='ouline-info'
          data-testid='btn-go-back-profile'
          style={{
            backgroundColor: 'transparent',
          }}
          onClick={() => navigate(location.state?.from || '/login')}
        >
          <AiOutlineArrowLeft size={25} />
        </Button>
        <h3>Profile Page</h3>
        <div>
          {editProfile && (
            <CloseButton
              data-testid='btn-close-profile'
              onClick={() => setEditProfile(false)}
            />
          )}
        </div>
      </Container>

      <hr />

      {editProfile ? (
        <Container className='text-center'>
          <Form
            className='shadow-lg rounded p-3 mb-5 py-5'
            style={{
              width: '50%',
              margin: 'auto',
            }}
          >
            <InputGroup
              className='mb-3'
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {formData.userpicture !== user_template && (
                <CloseButton
                  className='mt-2'
                  style={{ position: 'absolute', right: '10px' }}
                  onClick={() =>
                    setFormData({ ...formData, userpicture: user_template })
                  }
                />
              )}
              <Form.Control
                data-testid='editable-profile-userpicture'
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
            <InputGroup id='editable-profile-name' className='mb-3'>
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
            <InputGroup id='editable-profile-username' className='mb-3'>
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
            <InputGroup id='editable-profile-email' className='mb-3'>
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

            <span className='text-danger'>{errorMessage}</span>

            <hr />

            <Button variant='secondary' onClick={handleSave}>
              <AiOutlineUserAdd /> Save new info
            </Button>
          </Form>
        </Container>
      ) : (
        <Container className='text-center'>
          <Container>
            <Image
              src={user.userpicture}
              style={{
                height: '200px',
                width: '200px',
                cursor: 'pointer',
              }}
              roundedCircle
              alt='userpicture'
            />
          </Container>
          <Form
            className='shadow-lg rounded p-3 mb-5 py-5'
            style={{ width: '50%', margin: 'auto' }}
          >
            <InputGroup className='mb-3'>
              <InputGroup.Text>
                <AiOutlineForm />
              </InputGroup.Text>
              <Form.Control
                type='text'
                name='name'
                value={formData.name}
                disabled
              />
            </InputGroup>

            <InputGroup className='mb-3'>
              <InputGroup.Text>
                <AiOutlineUser />
              </InputGroup.Text>
              <Form.Control
                type='text'
                name='username'
                value={formData.username}
                disabled
              />
            </InputGroup>

            <InputGroup className='mb-3'>
              <InputGroup.Text>
                <AiOutlineMail />
              </InputGroup.Text>
              <Form.Control
                type='text'
                name='email'
                value={formData.email}
                disabled
              />
            </InputGroup>
            <hr />

            <Button
              variant='ouline-info'
              data-testid='edit-profile-button'
              style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
              onClick={() => setEditProfile(true)}
            >
              <AiOutlineEdit size={25} />
              <br />
              Edit profile
            </Button>
          </Form>
        </Container>
      )}
    </Container>
  );
}
export default connect()(ProfilePage);
