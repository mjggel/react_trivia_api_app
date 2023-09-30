import { combineReducers } from 'redux';
import questionsReducer from './QuestionsReducer';

export const rootReducer = combineReducers({
  Player: questionsReducer,
  userReducer,
});
