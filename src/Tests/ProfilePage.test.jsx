import React from 'react';
import usersMock from './mocks/Users.mock.json';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import ProfilePage from '../Pages/ProfilePage';
import { screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

const initialState = {
  PlayerReducer: {
    userName: '@john.constantine',
  },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Profile Page', () => {
  beforeEach(() => {
    localStorage.setItem('users', JSON.stringify(usersMock));
    jest.clearAllMocks();
  });

  test('test if all elements are rendered', () => {
    renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users')) || [];

    const { userName } = initialState.PlayerReducer;
    expect(userName).toBe('@john.constantine');

    const profileUser = usersInLocalStorage.find(
      (user) => user.username === userName
    );

    const titleElement = screen.getByText(/Profile Page/i);
    expect(titleElement).toBeInTheDocument();

    const userPictureInput = screen.getByRole('img', {
      name: /userpicture/i,
    });

    expect(userPictureInput).toBeInTheDocument();

    const usernameInput = screen.getByDisplayValue(`${profileUser.name}`);
    expect(usernameInput).toBeInTheDocument();
    expect(usernameInput).toBeDisabled();

    const emailInput = screen.getByDisplayValue(`${profileUser.email}`);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toBeDisabled();

    const nameInput = screen.getByDisplayValue(`${profileUser.name}`);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toBeDisabled();

    const editButton = screen.getByTestId('edit-profile-button');
    expect(editButton).toBeInTheDocument();
  });

  test('test change route when back arrow button is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const { user } = renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    await user.click(screen.getByTestId('btn-go-back-profile'));

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  test('test if input become available when edit button is clicked', async () => {
    const { user } = renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users')) || [];

    const { userName } = initialState.PlayerReducer;
    expect(userName).toBe('@john.constantine');

    const profileUser = usersInLocalStorage.find(
      (user) => user.username === userName
    );

    expect(screen.getByDisplayValue(`${profileUser.name}`)).toBeDisabled();

    expect(screen.getByDisplayValue(`${profileUser.email}`)).toBeDisabled();

    expect(screen.getByDisplayValue(`${profileUser.username}`)).toBeDisabled();

    const editButton = screen.getByTestId('edit-profile-button');

    await user.click(editButton);

    expect(screen.getByDisplayValue(`${profileUser.name}`)).not.toBeDisabled();

    expect(screen.getByDisplayValue(`${profileUser.email}`)).not.toBeDisabled();

    expect(
      screen.getByDisplayValue(`${profileUser.username}`)
    ).not.toBeDisabled();

    expect(
      screen.getByRole('button', { name: /save new info/i })
    ).toBeInTheDocument();
  });

  test('test if the changed values are saved', async () => {
    const { user } = renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users')) || [];

    const { userName } = initialState.PlayerReducer;
    expect(userName).toBe('@john.constantine');

    const profileUser = usersInLocalStorage.find(
      (user) => user.username === userName
    );

    const editButton = screen.getByTestId('edit-profile-button');

    await user.click(editButton);

    const nameInput = screen.getByDisplayValue(`${profileUser.name}`);
    await user.clear(nameInput);
    expect(nameInput).toHaveValue('');
    await user.type(nameInput, 'Alan Moore');

    const emailInput = screen.getByDisplayValue(`${profileUser.email}`);
    await user.clear(emailInput);
    expect(emailInput).toHaveValue('');
    await user.type(emailInput, 'alan.moore@example');

    const usernameInput = screen.getByDisplayValue(`${profileUser.username}`);
    await user.clear(usernameInput);
    expect(usernameInput).toHaveValue('');
    await user.type(usernameInput, '@alan.moore');

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await user.clear(passwordInput);
    expect(passwordInput).toHaveValue('');
    await user.type(passwordInput, 'vendetta');

    await user.click(screen.getByRole('button', { name: /save new info/i }));

    waitFor(() => {
      expect(profileUser.name).toBe('Alan Moore');
      expect(profileUser.email).toBe('alan.moore@example');
      expect(profileUser.username).toBe('@alan.moore');
      expect(profileUser.password).toBe('vendetta');
    });
  });

  test('test if is not possible to change the email or username to one that already exists', async () => {
    const { user } = renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users')) || [];

    const { userName } = initialState.PlayerReducer;

    const profileUser = usersInLocalStorage.find(
      (user) => user.username === userName
    );

    const editButton = screen.getByTestId('edit-profile-button');

    await user.click(editButton);

    const emailInput = screen.getByDisplayValue(`${profileUser.email}`);
    await user.clear(emailInput);
    expect(emailInput).toHaveValue('');
    await user.type(emailInput, 'jane.doe@example.com');

    await user.click(screen.getByRole('button', { name: /save new info/i }));

    expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();

    await user.clear(emailInput);
    const usernameInput = screen.getByDisplayValue(`${profileUser.username}`);
    await user.clear(usernameInput);
    expect(usernameInput).toHaveValue('');
    await user.type(usernameInput, '@jane.doe');

    await user.click(screen.getByRole('button', { name: /save new info/i }));

    expect(screen.getByText(/Username already exists/i)).toBeInTheDocument();
  });

  test('test if is not possible to leave all fields empty', async () => {
    const { user } = renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users')) || [];

    const { userName } = initialState.PlayerReducer;

    const profileUser = usersInLocalStorage.find(
      (user) => user.username === userName
    );

    const editButton = screen.getByTestId('edit-profile-button');

    await user.click(editButton);

    const nameInput = screen.getByDisplayValue(`${profileUser.name}`);
    await user.clear(nameInput);

    const emailInput = screen.getByDisplayValue(`${profileUser.email}`);
    await user.clear(emailInput);

    const usernameInput = screen.getByDisplayValue(`${profileUser.username}`);
    await user.clear(usernameInput);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await user.clear(passwordInput);

    await user.click(screen.getByRole('button', { name: /save new info/i }));

    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
  });

  test('test if the user close the edit window without saving the info stays the same', async () => {
    const { user } = renderWithReduxAndRouter(<ProfilePage />, {
      route: '/profile',
      initialState,
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users')) || [];

    const { userName } = initialState.PlayerReducer;

    const profileUser = usersInLocalStorage.find(
      (user) => user.username === userName
    );

    const editButton = screen.getByTestId('edit-profile-button');

    await user.click(editButton);

    const nameInput = screen.getByDisplayValue(`${profileUser.name}`);
    await user.clear(nameInput);
    expect(nameInput).toHaveValue('');

    const emailInput = screen.getByDisplayValue(`${profileUser.email}`);
    await user.clear(emailInput);
    expect(emailInput).toHaveValue('');

    const usernameInput = screen.getByDisplayValue(`${profileUser.username}`);
    await user.clear(usernameInput);
    expect(usernameInput).toHaveValue('');

    const passwordInput = screen.getByPlaceholderText(/password/i);
    await user.clear(passwordInput);

    await user.click(screen.getByTestId('btn-close-profile'));

    waitFor(() => {
      expect(nameInput).toHaveValue(profileUser.name);
      expect(emailInput).toHaveValue(profileUser.email);
      expect(usernameInput).toHaveValue(profileUser.username);
    });
  });
});
