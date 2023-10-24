import { combineReducers } from 'redux';
import questionsReducer from './QuestionsReducer';
import PlayerReducer from './UserReducer';

export const rootReducer = combineReducers({
  QuestionsReducer: questionsReducer,
  PlayerReducer,
});
