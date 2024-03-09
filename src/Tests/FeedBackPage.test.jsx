import React from 'react';
import usersMock from './mocks/Users.mock.json';
import { screen } from '@testing-library/react';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import FeedBackPage from '../Pages/FeedBackPage';
import {
  setCurrQuestions,
  setQuestions,
} from '../Redux/Reducers/QuestionsReducer';
import { resetState } from '../Redux/Reducers/UserReducer';
import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../Redux/Reducers';
import { useNavigate } from 'react-router-dom';

const initialState = {
  PlayerReducer: {
    userName: '@john.constantine',
    userAssertions: 5,
    userScore: 5,
  },
  QuestionsReducer: {
    questions: {
      results: [
        {
          category: 'General Knowledge',
          difficulty: 'medium',
        },
      ],
    },
  },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('FeedBackPage', () => {
  beforeEach(() => {
    localStorage.setItem('users', JSON.stringify(usersMock));
    jest.clearAllMocks();
  });
  test('renders feedback page with user information', async () => {
    renderWithReduxAndRouter(<FeedBackPage />, {
      route: '/feedback',
      initialState,
      store,
    });

    const { userScore, userAssertions } = initialState.PlayerReducer;
    const { category } = initialState.QuestionsReducer.questions.results[0];

    const userNameElement = screen.getByText('@john.constantine');
    expect(userNameElement).toBeInTheDocument();

    const scoreElement = screen.getByText(userScore * 2);
    expect(scoreElement).toBeInTheDocument();

    const assertionsElement = screen.getByText(userAssertions);
    expect(assertionsElement).toBeInTheDocument();

    const categoryElement = screen.getByText('Your chosen category is:');
    expect(categoryElement).toBeInTheDocument();

    expect(screen.getByText(category)).toBeInTheDocument();
  });

  test('handles try again button click', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    const { user } = renderWithReduxAndRouter(<FeedBackPage />, {
      route: '/feedback',
      initialState,
      store,
    });

    const tryAgainButton = screen.getByText('Try Again');
    await user.click(tryAgainButton);

    expect(mockDispatch).toHaveBeenCalledWith(setCurrQuestions(0));
    expect(mockDispatch).toHaveBeenCalledWith(setQuestions([]));
    expect(mockDispatch).toHaveBeenCalledWith(
      resetState({ userAssertions: 0, userScore: 0 })
    );
    expect(navigateMock).toHaveBeenCalledWith('/home');
  });

  test('handles Leaderboard button click', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    const { user } = renderWithReduxAndRouter(<FeedBackPage />, {
      route: '/feedback',
      initialState,
      store,
    });

    const leaderboardButton = screen.getByText('Leaderboard');
    await user.click(leaderboardButton);

    expect(navigateMock).toHaveBeenCalledWith('/leaderboard');
  });

  test('handles logout button click', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    const { user } = renderWithReduxAndRouter(<FeedBackPage />, {
      route: '/feedback',
      initialState,
      store,
    });

    const logoutButton = screen.getByText('Logout');
    await user.click(logoutButton);

    expect(mockDispatch).toHaveBeenCalledWith(setQuestions([]));

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
