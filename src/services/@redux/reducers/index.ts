import { combineReducers } from 'redux';
import quizzes from './quizzes';
import app from './app';
import levels from './levels';

export default combineReducers({
  quizzes,
  app,
  levels,
});
