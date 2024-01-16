import React, { useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect, useDispatch, useSelector } from 'react-redux';
import userFeedBack from '../Utils/UserFeedBack.json';
import multiplyDifficultyPoints from '../Utils/multiplyDifficultyPoints';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../Redux/Reducers/UserReducer';
import {
  setCurrQuestions,
  setQuestions,
} from '../Redux/Reducers/QuestionsReducer';
import { MdLeaderboard } from 'react-icons/md';

function FeedBackPage() {
  const currentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userName, userScore, userAssertions } = useSelector(
    (state) => state.PlayerReducer
  );
  const assertPorcentage = (userAssertions / 10) * 100;
  const assertFeedback = userFeedBack[assertPorcentage];

  const {
    questions: { results },
  } = useSelector((state) => state.QuestionsReducer);
  const { difficulty, category } = results[0];

  const logout = () => {
    dispatch(setQuestions([]));
    dispatch(setCurrQuestions(0));
    dispatch(resetState({ userName: '', userAssertions: 0, userScore: 0 }));
    navigate('/login');
    return;
  };

  const handleTryAgain = () => {
    dispatch(setCurrQuestions(0));
    dispatch(setQuestions([]));
    dispatch(resetState({ userAssertions: 0, userScore: 0 }));
    navigate('/home');
    return;
  };

  useEffect(() => {
    const user = users.find((user) => user.username === userName);
    user.ranking = {
      score: multiplyDifficultyPoints(userScore, results[0]),
      category,
      difficulty,
      assertions: userAssertions,
      date: currentDate(),
    };
    localStorage.setItem('users', JSON.stringify(users));
  });

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h3>{assertFeedback.toUpperCase()}</h3>
      <Container
        className='text-center shadow-lg rounded p-3 mb-5 py-5'
        style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}
      >
        <Container>
          <h1>
            <span>
              <strong>{userName}</strong>
            </span>
          </h1>

          <h4>
            Your score is:{' '}
            <strong>{multiplyDifficultyPoints(userScore, results[0])}</strong>
          </h4>
        </Container>

        <Container>
          <h3>
            You had{' '}
            <span>
              <strong>{userAssertions}</strong>
            </span>{' '}
            assertions in the{' '}
            <span>
              <strong>{difficulty}</strong>
            </span>{' '}
            difficulty, thats{' '}
            <span>
              <strong>{assertPorcentage}</strong>
            </span>
            % assertions
          </h3>
        </Container>

        <Container>
          <h3>
            Your chosen category is: <hr />
            <span>
              <strong>{category}</strong>
            </span>
          </h3>
        </Container>
      </Container>
      <span>to save your info please go to leaderboard page</span>
      <h4>thanks for playing</h4>
      <hr />

      <Container style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Button variant='info' onClick={() => navigate('/leaderboard')}>
          <MdLeaderboard />
          Leaderboard
        </Button>
        <Button variant='primary' onClick={handleTryAgain}>
          Try Again
        </Button>
        <Button variant='danger' onClick={logout}>
          Logout
        </Button>
      </Container>
    </div>
  );
}

export default connect()(FeedBackPage);
