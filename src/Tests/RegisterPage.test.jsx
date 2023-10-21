import React from 'react';
import { screen } from '@testing-library/react';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import RegisterPage from '../Pages/RegisterPage';
import user_template from '../Images/user_template_img.png';
import { useNavigate } from 'react-router-dom';
import usersMock from './mocks/Users.mock.json';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Register Page', () => {
  beforeEach(() => {
    localStorage.setItem('users', JSON.stringify(usersMock));
    jest.clearAllMocks();
  });

  test('test if all elements are rendered', () => {
    renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });
    const titleElement = screen.getByText(/Register Page/i);
    expect(titleElement).toBeInTheDocument();

    const userPictureInput = screen.getByRole('img', {
      name: /userpicture/i,
    });
    expect(userPictureInput).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/your name/i);
    expect(nameInput).toBeInTheDocument();

    const usernameInput = screen.getByPlaceholderText(/username/i);
    expect(usernameInput).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    const registerButton = screen.getByRole('button', { name: /register/i });
    expect(registerButton).toBeInTheDocument();

    const backButton = screen.getByTestId('back-arrow-button');
    expect(backButton).toBeInTheDocument();
  });

  test('test change route when back arrow button is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    await user.click(screen.getByTestId('back-arrow-button'));

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('should not be possible to Register if there are empty fields', async () => {
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    const registerButton = screen.getByRole('button', { name: /register/i });
    await user.click(registerButton);

    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();

    await user.type(nameInput, 'Harry Du Bois');
    await user.type(usernameInput, '@apocalypse.cop');
    await user.type(emailInput, 'harry.dubois@gmail.com');

    await user.click(registerButton);
    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();

    await user.clear(emailInput);
    await user.type(passwordInput, '123456');

    await user.click(registerButton);
    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
  });

  test('should be possible to Register when all fields are correctly filled', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    localStorage.clear();
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    const registerButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'Peter Parker');
    await user.type(usernameInput, '@spiderman');
    await user.type(emailInput, 'peter.parker@example.com');
    await user.type(passwordInput, '123456');

    await user.click(registerButton);

    expect(JSON.parse(localStorage.getItem('users'))).toEqual([
      {
        userpicture: user_template,
        name: 'Peter Parker',
        username: '@spiderman',
        email: 'peter.parker@example.com',
        password: '123456',
        rememberMe: false,
      },
    ]);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('test if when a new user is registered doesnt remove the old users in the localstorage', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    const registerButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'Harry Du Bois');
    await user.type(usernameInput, '@apocalypse.cop');
    await user.type(emailInput, 'harry.dubois@gmail.com');
    await user.type(passwordInput, '123456');

    await user.click(registerButton);

    const usersInLocalStorage = JSON.parse(
      localStorage.getItem('users') || '[]'
    );

    const expectedUser = {
      userpicture: user_template,
      name: 'Harry Du Bois',
      username: '@apocalypse.cop',
      email: 'harry.dubois@gmail.com',
      password: '123456',
      rememberMe: false,
    };

    const isUserInLocalStorage = usersInLocalStorage.some((user) => {
      return (
        user.name === expectedUser.name &&
        user.username === expectedUser.username &&
        user.email === expectedUser.email &&
        user.password === expectedUser.password &&
        user.rememberMe === expectedUser.rememberMe
      );
    });

    expect(usersInLocalStorage).toBeInstanceOf(Array);
    expect(isUserInLocalStorage).toBe(true);
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('should not be possible to Register if the username already exists', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    const registerButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'Jane Doe');
    await user.type(usernameInput, '@jane.doe');
    await user.type(emailInput, 'example@example.com');
    await user.type(passwordInput, 'password123');

    await user.click(registerButton);

    expect(screen.getByText(/Username already exists/i)).toBeInTheDocument();
  });

  test('should not be possible to Register if the email already exists', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const nameInput = screen.getByPlaceholderText(/your name/i);
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    const registerButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'Alice Smith');
    await user.type(usernameInput, '@alice');
    await user.type(emailInput, 'alice.smith@example.com');
    await user.type(passwordInput, 'securepass');

    await user.click(registerButton);

    expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
  });

  test('test if its possible to change profile picture', async () => {
    global.URL.createObjectURL = jest.fn(() => 'blob:http://test.com/abc');

    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const userPictureInput = screen.getByTestId('register-userpicture');
    const userPicture = screen.getByRole('img', {
      name: /userpicture/i,
    });

    await user.upload(
      userPictureInput,
      new File(['user_picture'], 'user_picture.png', { type: 'image/png' })
    );

    expect(userPicture).toHaveAttribute(
      'src',
      expect.stringContaining('blob:http://test.com/abc')
    );

    const closeBtn = screen.getByRole('button', { name: /close/i });
    await user.click(closeBtn);

    expect(userPicture).toHaveAttribute(
      'src',
      expect.stringContaining('user_template_img.png')
    );
  });

  test('should be possible to see the password when the eye icon is clicked', async () => {
    const { user } = renderWithReduxAndRouter(<RegisterPage />, {
      route: '/register',
    });

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const eyeIcon = screen.getByTestId('register-eye-icon');

    expect(passwordInput.type).toBe('password');

    await user.click(eyeIcon);

    expect(passwordInput.type).toBe('text');
  });
});
