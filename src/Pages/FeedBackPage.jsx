import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect, useSelector } from 'react-redux';
import userFeedBack from '../Utils/UserFeedBack.json';
import multiplyDifficultyPoints from '../Utils/multiplyDifficultyPoints';

function FeedBackPage() {
  const { userName, userScore, userAssertions } = useSelector(
    (state) => state.PlayerReducer
  );
  const assertPorcentage = (userAssertions / 10) * 100;
  const assertFeedback = userFeedBack[assertPorcentage];

  const {
    questions: { results },
  } = useSelector((state) => state.QuestionsReducer);
  const { difficulty, category } = results[0];

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
              <strong>
                <u>{userName}</u>
              </strong>
            </span>
            Your score is:{' '}
            <span>
              <strong>
                <u>{multiplyDifficultyPoints(userScore, results[0])}</u>
              </strong>
            </span>
          </h1>
        </Container>

        <Container>
          <h3>
            You had{' '}
            <span>
              <strong>
                <u>{userAssertions}</u>
              </strong>
            </span>{' '}
            assertions in the{' '}
            <span>
              <strong>
                <u>{difficulty}</u>
              </strong>
            </span>{' '}
            difficulty, thats{' '}
            <span>
              <strong>
                <u>{assertPorcentage}</u>
              </strong>
            </span>
            % assertions
          </h3>
        </Container>

        <Container>
          <h3>
            Your chosen category is: <hr />
            <span>
              <strong>
                {category}
                <u></u>
              </strong>
            </span>
          </h3>
        </Container>
      </Container>
      <h4>thanks for playing</h4>

      <Container>
        <Button>Play Again</Button>
        <Button>Leaderboard</Button>
        <Button>Logout</Button>
      </Container>
    </div>
  );
}

export default connect()(FeedBackPage);
