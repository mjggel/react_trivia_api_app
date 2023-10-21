import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaGamepad } from 'react-icons/fa';
import { connect, useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import categoryOptions from '../Utils/Categories.json';
import { setQuestions } from '../Redux/Reducers/QuestionsReducer';
import { getTriviaQuestions } from '../services/getTriviaQuestions';
import getCategoryValue from '../Utils/getCategory';

function HomePage() {
  const { userName } = useSelector((state) => state.userReducer);
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const token = users.find((user) => user.username === userName).token;
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
    <div>
      <h2>Welcome to the Trivia Game</h2>
      <div className='game-options'>
        <Form.Group>
          <Form.Label>Select Difficulty</Form.Label>
          <Form.Control
            as='select'
            onChange={handleDifficultyChange}
            value={difficulty}
          >
            {difficultyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Select Category</Form.Label>
          <Form.Control
            as='select'
            onChange={handleCategoryChange}
            value={category}
          >
            {categoryOptions.categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </div>
      <Button variant='primary' onClick={startGame}>
        Start Game <FaGamepad />
      </Button>
    </div>
  );
}

export default connect()(HomePage);
