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
} from 'react-icons/ai';
import React, { useState } from 'react';
import trivia_logo from '../imgs/trivia_logo.png';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
        <Modal.Title>Login</Modal.Title>
        <Form>
          <InputGroup id='login-username' className='mb-3'>
            <InputGroup.Text>
              <AiOutlineUser />
            </InputGroup.Text>
            <Form.Control placeholder='username' />
          </InputGroup>

          <InputGroup id='login-password' className='mb-3'>
            <InputGroup.Text>
              {showPassword ? <AiOutlineUnlock /> : <AiOutlineLock />}
            </InputGroup.Text>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
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
      </Modal.Body>

      <Modal.Footer className='justify-content-around'>
        <Button variant='info'>
          <AiFillSetting /> Settings
        </Button>

        <Button variant='primary'>
          <AiFillPlayCircle /> Play
        </Button>

        <Button variant='secondary'>
          <AiOutlineUserAdd /> Register
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
