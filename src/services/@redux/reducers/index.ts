import { combineReducers } from 'redux';
import quizzes from './quizzes';
import app from './app';

export default combineReducers({
  quizzes,
  app,
});
