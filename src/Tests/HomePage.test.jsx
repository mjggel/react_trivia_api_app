import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../Redux/Reducers/index';
import usersMock from './mocks/Users.mock.json';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import HomePage from '../Pages/HomePage';
import { screen, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { setQuestions } from '../Redux/Reducers/QuestionsReducer';
import { useDispatch } from 'react-redux';
import mediumQuestionsMock from './mocks/questions_mock/mediumQuestionsMock.json';
import { getTriviaQuestions } from '../Services/getTriviaQuestions';

const initialState = {
  PlayerReducer: {
    userName: '@john.constantine',
  },
};

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('../Services/getTriviaQuestions', () => ({
  ...jest.requireActual('../Services/getTriviaQuestions'),
  getTriviaQuestions: jest.fn(),
}));

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.setItem('users', JSON.stringify(usersMock));
    jest.clearAllMocks();
  });

  test('test if the page renders correctly', () => {
    renderWithReduxAndRouter(<HomePage />, {
      route: '/home',
      initialState,
      store,
    });

    const titleElement = screen.getByText(/welcome to the trivia game/i);
    expect(titleElement).toBeInTheDocument();

    const startGameButtonElement = screen.getByRole('button', {
      name: /start game/i,
    });
    expect(startGameButtonElement).toBeInTheDocument();

    const difficultySelectElement = screen.getByLabelText(/select difficulty/i);
    expect(difficultySelectElement).toBeInTheDocument();

    const categorySelectElement = screen.getByLabelText(/select category/i);
    expect(categorySelectElement).toBeInTheDocument();
  });

  test('test if selecting difficulty and category works', async () => {
    const { user } = renderWithReduxAndRouter(<HomePage />, {
      route: '/home',
      initialState,
      store,
    });

    const difficultySelect = screen.getByLabelText('Select Difficulty');
    const categorySelect = screen.getByLabelText('Select Category');

    await user.selectOptions(difficultySelect, 'hard');
    await user.selectOptions(categorySelect, 'Entertainment: Board Games');

    expect(difficultySelect).toHaveValue('hard');
    expect(categorySelect).toHaveValue('Entertainment: Board Games');
  });

  test('test if the start game button works and dispatches the correct action with the correct info', async () => {
    const mockNavigate = jest.fn();
    const mockDispatch = jest.fn();
    getTriviaQuestions.mockReturnValue(mediumQuestionsMock);
    useDispatch.mockReturnValue(mockDispatch);
    useNavigate.mockReturnValue(mockNavigate);
    const { user } = renderWithReduxAndRouter(<HomePage />, {
      route: '/home',
      initialState,
      store,
    });

    const categorySelect = screen.getByLabelText('Select Category');
    await user.selectOptions(categorySelect, 'General Knowledge');

    const difficultySelect = screen.getByLabelText('Select Difficulty');
    await user.selectOptions(difficultySelect, 'medium');

    const startGameButton = screen.getByRole('button', {
      name: /start game/i,
    });

    await user.click(startGameButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setQuestions(mediumQuestionsMock)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/game');
    });
  });
});
