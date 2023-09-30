import { combineReducers } from 'redux';
import questionsReducer from './QuestionsReducer';
import userReducer from './UserReducer';

export const rootReducer = combineReducers({
  Player: questionsReducer,
  userReducer,
});
