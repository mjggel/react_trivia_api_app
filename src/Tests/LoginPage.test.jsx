import React from 'react';
import { screen } from '@testing-library/react';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import { useNavigate } from 'react-router-dom';
import usersMock from './mocks/Users.mock.json';
import LoginPage from '../Pages/LoginPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('users', JSON.stringify(usersMock));
  });

  test('test if all elements are rendered', async () => {
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const titleElement = screen.getByText(/Login/i);
    expect(titleElement).toBeInTheDocument();

    const titleTriviaImage = screen.getByAltText(/Trivia Logo/i);
    expect(titleTriviaImage).toBeInTheDocument();

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    expect(usernameInputElement).toBeInTheDocument();

    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    expect(passwordInputElement).toBeInTheDocument();

    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });
    expect(loginButtonElement).toBeInTheDocument();

    const registerButtonElement = screen.getByRole('button', {
      name: /register/i,
    });
    expect(registerButtonElement).toBeInTheDocument();

    const settingsButtonElement = screen.getByRole('button', {
      name: /settings/i,
    });
    expect(settingsButtonElement).toBeInTheDocument();

    await user.type(usernameInputElement, 'test');
    await user.type(passwordInputElement, 'test');
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
  });

  test('test change route when register button is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const registerButtonElement = screen.getByRole('button', {
      name: /register/i,
    });

    await user.click(registerButtonElement);

    expect(navigateMock).toHaveBeenCalledWith('/register');
  });

  test('test change route when settings button is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const loginPageTextElement = screen.getByText(/Login Page/i);
    const settingsButtonElement = screen.getByRole('button', {
      name: /settings/i,
    });

    await user.click(settingsButtonElement);

    expect(navigateMock).toHaveBeenCalledWith('/settings');
  });

  test('should not be possible to Login if the username or password is empty', async () => {
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.click(loginButtonElement);

    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
  });

  test('should not be possible to Login if the username or password is incorrect', async () => {
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.type(usernameInputElement, 'test');
    await user.type(passwordInputElement, 'test');
    await user.click(loginButtonElement);

    expect(
      screen.getByText(/Username or password is invalid/i)
    ).toBeInTheDocument();
  });

  test('should be possible to Login if the username and password are correct', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.type(usernameInputElement, '@john.constantine');
    await user.type(passwordInputElement, '123456');
    await user.click(loginButtonElement);

    expect(navigateMock).toHaveBeenCalledWith('/game');
  });

  test('should uptade rememberMe key in localStorage', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.type(usernameInputElement, '@john.constantine');
    await user.type(passwordInputElement, '123456');
    await user.click(screen.getByLabelText(/remember me/i));
    await user.click(loginButtonElement);

    expect(JSON.parse(localStorage.getItem('users'))).toEqual({
      userPicture: '',
      username: '@john.constantine',
      name: 'John Constantine',
      password: '123456',
      rememberMe: true,
    });
  });

  test('should be possible to see the password when the eye icon is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    expect(passwordInputElement).toHaveAttribute('type', 'password');

    await user.type(usernameInputElement, '@john.constantine');
    await user.type(passwordInputElement, '123456');

    const eyeIconElement = screen.getByTestId('eye-icon');
    await user.click(eyeIconElement);

    expect(passwordInputElement).toHaveAttribute('type', 'text');
  });

  test('should not be possible to login if there is no user in localStorage', async () => {
    localStorage.removeItem('users');
    const { user } = renderWithReduxAndRouter(<LoginPage />, {
      route: '/login',
    });

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.type(usernameInputElement, '@john.constantine');
    await user.type(passwordInputElement, '123456');

    await user.click(loginButtonElement);

    expect(screen.getByText(/Username or password is invalid/i));
  });
});
