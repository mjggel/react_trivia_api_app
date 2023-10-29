import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Timer from '../Components/Timer';
import { increment, setScore } from '../Redux/Reducers/UserReducer';
import Container from 'react-bootstrap/Container';
import he from 'he';
import { setCurrQuestions } from '../Redux/Reducers/QuestionsReducer';
import { useNavigate } from 'react-router-dom';

function GamePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [assertions, setAssertions] = useState(0);
  const [resetTimer, setResetTimer] = useState(false);
  const [chosenAnswers, setChosenAnswer] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const { userName } = useSelector((state) => state.PlayerReducer);
  const { questions, currQuestions } = useSelector(
    (state) => state.QuestionsReducer
  );

  const handleTimeUp = () => {
    setIsDisabled(true);
    setTimeIsUp(true);
    return;
  };

  const handleScorePoints = (answer) => {
    setChosenAnswer(answer);
    setIsDisabled(true);
    if (answer === questions.results[currQuestions].correct_answer) {
      setTimeIsUp(true);
      setAssertions(assertions + 1);
      dispatch(increment());
      return;
    }
    setTimeIsUp(true);
    return;
  };

  const handleNextQuestion = () => {
    setTimeIsUp(false);
    setIsDisabled(false);
    setChosenAnswer(null);
    setResetTimer(true);
    dispatch(setCurrQuestions(currQuestions + 1));
    return;
  };

  const randomSort = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setAllAnswers(
      randomSort([
        ...questions.results[currQuestions].incorrect_answers,
        questions.results[currQuestions].correct_answer,
      ])
    );
    setResetTimer(false);
    if (currQuestions === 9) {
      dispatch(setScore(assertions));
      navigate('/feedback');
      return;
    }
  }, [currQuestions]);

  return (
    <>
      <Container
        style={{
          width: '50%',
          marginTop: '50px',
          textAlign: 'center',
        }}
      >
        <Timer
          onTimeUp={handleTimeUp}
          timeIsUp={timeIsUp}
          resetTimer={resetTimer}
        />

        <Container>
          <hr />
          <h5>{currQuestions + 1}/10</h5>
          <hr />
          <h4>{`${userName} Assertions: ${assertions}`}</h4>
          <hr />
          <h3 className='text-center'>
            {he.decode(questions.results[currQuestions].question)}
          </h3>
        </Container>

        {chosenAnswers &&
          (chosenAnswers !== questions.results[currQuestions].correct_answer ? (
            <h4 className='text-danger'>Wrong Answer</h4>
          ) : (
            <h4 className='text-success'>Correct Answer</h4>
          ))}
        {timeIsUp && !chosenAnswers && (
          <h5 className='text-danger'>Time is up</h5>
        )}

        <Container className='d-flex flex-column mb-3'>
          {allAnswers.map((answer, index) => (
            <Button
              key={index}
              className='shadow rounded p-2 m-2'
              disabled={isDisabled}
              onClick={() => handleScorePoints(answer)}
              style={
                timeIsUp && chosenAnswers
                  ? answer === questions.results[currQuestions].correct_answer
                    ? { backgroundColor: 'green', color: 'white' }
                    : { backgroundColor: 'red', color: 'white' }
                  : { backgroundImage: 'white', color: 'black' }
              }
            >
              {he.decode(answer)}
            </Button>
          ))}
        </Container>

        {timeIsUp && currQuestions < 9 && (
          <Container>
            <Button variant='primary' onClick={handleNextQuestion}>
              Next Question
            </Button>
          </Container>
        )}
      </Container>
    </>
  );
}

export default connect()(GamePage);
