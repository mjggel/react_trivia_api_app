import React from 'react';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import mediumQuestionsMock from './mocks/questions_mock/mediumQuestionsMock.json';
import { screen, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../Redux/Reducers';
import GamePage from '../Pages/GamePage';
import he from 'he';
import { act } from '@testing-library/react';
import { setCurrQuestions } from '../Redux/Reducers/QuestionsReducer';
import { useDispatch } from 'react-redux';
import { increment, setScore } from '../Redux/Reducers/UserReducer';
import { useNavigate } from 'react-router-dom';

const initialState = {
  PlayerReducer: {
    userName: '@john.constantine',
    userAssertions: 0,
    userScore: 0,
  },
  QuestionsReducer: {
    questions: mediumQuestionsMock,
    currQuestions: 0,
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

describe('GamePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.setTimeout(31000);
  });

  test('test if the page renders correctly', () => {
    renderWithReduxAndRouter(<GamePage />, {
      route: '/game',
      initialState,
      store,
    });

    const { questions, currQuestions } = initialState.QuestionsReducer;
    expect(currQuestions).toBe(0);

    const { userName, userAssertions } = initialState.PlayerReducer;
    expect(userName).toBe('@john.constantine');
    expect(userAssertions).toBe(0);

    const getTimerElement = screen.getByTestId('timer');
    expect(getTimerElement).toBeInTheDocument();
    expect(getTimerElement).toHaveTextContent('30 s');

    const getQuestionNumberElement = screen.getByText(
      `${currQuestions + 1}/10`
    );
    expect(getQuestionNumberElement).toBeInTheDocument();

    const getAssertionsElement = screen.getByText(
      `${userName} Assertions: ${userAssertions}`
    );
    expect(getAssertionsElement).toBeInTheDocument();

    const getQuestion = screen.getByText(
      he.decode(questions.results[currQuestions].question)
    );
    expect(getQuestion).toBeInTheDocument();

    const getAnswers = screen.getAllByRole('button');
    expect(getAnswers).toHaveLength(
      [
        questions.results[currQuestions].incorrect_answers,
        questions.results[currQuestions].correct_answer,
      ].length
    );
    expect(
      getAnswers.find(
        (answer) =>
          answer.textContent === questions.results[currQuestions].correct_answer
      )
    ).toBeInTheDocument();

    expect(
      getAnswers.find((answer) =>
        questions.results[currQuestions].incorrect_answers.includes(
          answer.textContent
        )
      )
    ).toBeInTheDocument();
  });

  test('test if the next question button appears after the timer runs out', async () => {
    jest.useFakeTimers();

    renderWithReduxAndRouter(<GamePage />, {
      route: '/game',
      initialState,
      store,
    });

    const getAnswers = screen.getAllByRole('button');

    const getTimerElement = screen.getByTestId('timer');
    expect(getTimerElement).toHaveTextContent('30 s');
    expect(getTimerElement).toHaveStyle({ color: 'black' });

    act(() => {
      jest.advanceTimersByTime(31000);
    });

    await waitFor(
      () => {
        expect(getTimerElement).toHaveTextContent('0 s');
        expect(getTimerElement).toHaveStyle({ color: 'red' });
        expect(screen.queryByText(/time is up/i)).toBeInTheDocument();
        getAnswers.forEach((answer) => {
          expect(answer).toBeDisabled();
        });
        expect(
          screen.queryByRole('button', {
            name: /next question/i,
          })
        ).toBeInTheDocument();
      },
      { timeout: 31000 }
    );
  });

  test('test if the next question button works', async () => {
    jest.useFakeTimers();

    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const { user } = renderWithReduxAndRouter(<GamePage />, {
      route: '/game',
      initialState,
      store,
    });

    const { currQuestions } = initialState.QuestionsReducer;
    expect(currQuestions).toBe(0);

    act(() => {
      jest.advanceTimersByTime(31000);
    });

    await waitFor(
      async () => {
        expect(screen.queryByText(/time is up/i)).toBeInTheDocument();
        await user.click(
          screen.queryByRole('button', { name: /next question/i })
        );
        expect(mockDispatch).toHaveBeenCalledWith(
          setCurrQuestions(currQuestions + 1)
        );
      },
      { timeout: 31000 }
    );
  });

  test('should handle assertions correctly', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const { user } = renderWithReduxAndRouter(<GamePage />, {
      route: '/game',
      initialState,
      store,
    });

    const { userName } = initialState.PlayerReducer;
    const { questions, currQuestions } = initialState.QuestionsReducer;

    const getAllButtons = screen.getAllByRole('button');
    const correctAnswer = getAllButtons.find(
      (button) =>
        button.textContent === questions.results[currQuestions].correct_answer
    );
    expect(correctAnswer).toBeInTheDocument();
    await waitFor(() => {
      user.click(correctAnswer);
      expect(mockDispatch).toHaveBeenCalledWith(increment());
      expect(screen.getByText(/correct answer/i)).toBeInTheDocument();
      expect(screen.getByText(`${userName} Assertions: 1`)).toBeInTheDocument();
      getAllButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });
  });

  test('should disable all buttons and show a message when chosen asnwer is incorrect', async () => {
    const mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    const { user } = renderWithReduxAndRouter(<GamePage />, {
      route: '/game',
      initialState,
      store,
    });

    const { questions, currQuestions } = initialState.QuestionsReducer;
    const { userName } = initialState.PlayerReducer;

    const getAllButtons = screen.getAllByRole('button');
    const incorrectAnswer = getAllButtons.find(
      (button) =>
        button.textContent !== questions.results[currQuestions].correct_answer
    );
    expect(incorrectAnswer).toBeInTheDocument();

    await waitFor(() => {
      user.click(incorrectAnswer);
      expect(mockDispatch).not.toHaveBeenCalled();
      expect(screen.getByText(/wrong answer/i)).toBeInTheDocument();
      getAllButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
      expect(screen.getByText(`${userName} Assertions: 0`)).toBeInTheDocument();
    });
  });

  test('simulate 10 matches and check redirection', async () => {
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useDispatch.mockReturnValue(mockDispatch);

    const { user } = renderWithReduxAndRouter(<GamePage />, {
      route: '/game',
      initialState,
      store,
    });

    const { userAssertions } = initialState.PlayerReducer;
    const { questions, currQuestions } = initialState.QuestionsReducer;

    for (let i = 0; i < 9; i++) {
      const getAllButtons = screen.getAllByRole('button');
      const correctAnswer = getAllButtons.find(
        (button) =>
          button.textContent === questions.results[currQuestions].correct_answer
      );
      user.click(correctAnswer);

      await waitFor(() => {
        const nextQuestionButton = screen.queryByRole('button', {
          name: /next question/i,
        });

        if (nextQuestionButton) {
          user.click(nextQuestionButton);
        }
      });

      if (currQuestions === 9) {
        await waitFor(() => {
          expect(mockDispatch).toHaveBeenCalledTimes(setScore(userAssertions));
          expect(mockNavigate).toHaveBeenCalledWith('/feedback');
        });
      }
    }
  });
});
