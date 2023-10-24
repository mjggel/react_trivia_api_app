import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { FaGamepad } from 'react-icons/fa';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import categoryOptions from '../Utils/Categories.json';
import { setQuestions } from '../Redux/Reducers/QuestionsReducer';
import { getTriviaQuestions } from '../Services/getTriviaQuestions';
import getCategoryValue from '../Utils/getCategory';

function HomePage() {
  const { userName } = useSelector((state) => state.userReducer);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const token = users.find((user) => user.username === userName)?.token || null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [category, setCategory] = useState('medium');
  const difficultyOptions = ['easy', 'medium', 'hard'];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  }, []);

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const startGame = async () => {
    const categoryValue = getCategoryValue(category);
    const questions = await getTriviaQuestions(
      token,
      difficulty,
      categoryValue
    );
    dispatch(setQuestions(questions));
    navigate('/game');
    return;
  };

  return (
    <Container className='text-center'>
      <h2>Welcome to the Trivia Game APP</h2>
      <Container
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-evenly',
        }}
      >
        <Form.Group style={{ flex: 1, marginRight: '10px' }}>
          <Form.Label htmlFor='difficultySelect'>Select Difficulty</Form.Label>
          <Form.Control
            as='select'
            id='difficultySelect'
            onChange={handleDifficultyChange}
            value={difficulty}
            style={{ width: '100%' }}
          >
            {difficultyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group style={{ flex: 1, marginLeft: '10px' }}>
          <Form.Label htmlFor='categorySelect'>Select Category</Form.Label>
          <Form.Control
            as='select'
            id='categorySelect'
            onChange={handleCategoryChange}
            value={category}
            style={{ width: '100%' }}
          >
            {categoryOptions.categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Container>
      <hr />
      <Button variant='primary' onClick={startGame}>
        Start Game <FaGamepad />
      </Button>
    </Container>
  );
}

export default connect()(HomePage);
