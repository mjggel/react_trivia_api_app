import React from 'react';
import usersMock from './mocks/Users.mock.json';
import { screen } from '@testing-library/react';
import renderWithReduxAndRouter from '../Utils/RenderWithReduxAndRouter';
import emptyMessages from '../Utils/EmptyMessages.json';
import Leaderboard from '../Pages/LeaderBoard';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Leaderboard', () => {
  beforeEach(() => {
    localStorage.setItem('users', JSON.stringify(usersMock));
    jest.clearAllMocks();
  });

  test('renders leaderboard page with user information', async () => {
    renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    const usersInLocalStorage = JSON.parse(localStorage.getItem('users'));
    const highestScoreUser = usersInLocalStorage.find(
      (user) => user.ranking.score === 15
    );

    const userNameElement = screen.getByText('@john.constantine');
    expect(userNameElement).toBeInTheDocument();

    const scoreElement = screen.getByTestId('user-score-1');
    expect(scoreElement).toHaveTextContent(highestScoreUser.ranking.score);

    const assertionsElement = screen.getByTestId('user-assertions-1');
    expect(assertionsElement).toHaveTextContent(
      highestScoreUser.ranking.assertions
    );

    const difficultyElement = screen.getByTestId('user-difficulty-1');
    expect(difficultyElement).toHaveTextContent(
      highestScoreUser.ranking.difficulty
    );

    const dateElement = screen.getByTestId('user-date-1');
    expect(dateElement).toHaveTextContent(highestScoreUser.ranking.date);
  });

  test('renders leaderboard page with no user information', async () => {
    localStorage.clear();
    renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    emptyMessages.descriptions.forEach((message) => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });
  });

  test('test if its possible to filtrate users by difficulty', async () => {
    const { user } = renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    const difficultyElement = screen.getByText('difficulty');
    expect(difficultyElement).toBeInTheDocument();
    expect(screen.getByTestId('user-difficulty-1')).toHaveTextContent('hard');

    await user.click(difficultyElement);

    expect(screen.getByTestId('user-difficulty-1')).toHaveTextContent('easy');
  });

  test('test if its possible to filtrate users by assertions', async () => {
    const { user } = renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    const assertionsElement = screen.getByText('Assertions');
    expect(assertionsElement).toBeInTheDocument();
    expect(screen.getByTestId('user-assertions-1')).toHaveTextContent('5');

    await user.click(assertionsElement);

    expect(screen.getByTestId('user-assertions-1')).toHaveTextContent('2');
  });

  test('test if its possible to filtrate users by score', async () => {
    const { user } = renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    const scoreElement = screen.getByText('Score');
    expect(scoreElement).toBeInTheDocument();

    expect(screen.getByTestId('user-score-1')).toHaveTextContent('15');

    await user.click(scoreElement);

    expect(screen.getByTestId('user-score-1')).toHaveTextContent('2');
  });

  test('test if its possible to filtrate users by name', async () => {
    const { user } = renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    const nameElement = screen.getByText('name');
    expect(nameElement).toBeInTheDocument();

    expect(screen.getByTestId('user-name-1')).toHaveTextContent('Alice Smith');

    await user.dblClick(nameElement);

    expect(screen.getByTestId('user-name-1')).toHaveTextContent('Sarah Wilson');
  });

  test('test if change route when the arrow icon is clicked', async () => {
    const navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);

    const { user } = renderWithReduxAndRouter(<Leaderboard />, {
      route: '/leaderboard',
    });

    const arrowIcon = screen.getByTestId('btn-go-login');

    await user.click(arrowIcon);

    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
