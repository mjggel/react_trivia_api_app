import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import App from '../App';
import renderWithReduxAndRouter from '../Utils/RenderWithRouter';
import usersMock from './mocks/Users.mock.json';

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify(usersMock));
  });

  test('test if all elements are rendered', async () => {
    const { user } = renderWithReduxAndRouter(<App />, { route: '/login' });

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
    const { user } = renderWithReduxAndRouter(<App />, { route: '/login' });

    const registerButtonElement = screen.getByRole('button', {
      name: /register/i,
    });

    await user.click(registerButtonElement);

    await waitFor(() => {
      expect(screen.getByText(/Register Page/i)).toBeInTheDocument();
    });
  });

  test('test change route when settings button is clicked', async () => {
    const { user } = renderWithReduxAndRouter(<App />, { route: '/login' });

    const loginPageTextElement = screen.getByText(/Login Page/i);
    const settingsButtonElement = screen.getByRole('button', {
      name: /settings/i,
    });

    await user.click(settingsButtonElement);

    await waitFor(() => {
      expect(loginPageTextElement).not.toBeInTheDocument();
    });
  });

  test('should not be possible to Login if the username or password is empty', async () => {
    const { user } = renderWithReduxAndRouter(<App />, { route: '/login' });

    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.click(loginButtonElement);

    await waitFor(() => {
      expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
    });
  });

  test('should not be possible to Login if the username or password is incorrect', async () => {
    const { user } = renderWithReduxAndRouter(<App />, { route: '/login' });

    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.type(usernameInputElement, 'test');
    await user.type(passwordInputElement, 'test');
    await user.click(loginButtonElement);

    await waitFor(() => {
      expect(
        screen.getByText(/Username or password is invalid/i)
      ).toBeInTheDocument();
    });
  });

  test('should be possible to Login if the username and password are correct', async () => {
    const { user } = renderWithReduxAndRouter(<App />, { route: '/login' });

    const loginPageTextElement = screen.getByText(/Login Page/i);
    const usernameInputElement = screen.getByPlaceholderText(/Username/i);
    const passwordInputElement = screen.getByPlaceholderText(/Password/i);
    const loginButtonElement = screen.getByRole('button', {
      name: /start/i,
    });

    await user.type(usernameInputElement, '@john.constantine');
    await user.type(passwordInputElement, '123456');
    await user.click(loginButtonElement);

    await waitFor(() => {
      expect(loginPageTextElement).not.toBeInTheDocument();
    });
  });
});
