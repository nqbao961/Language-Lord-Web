import { combineReducers } from 'redux';
import quizzes from './quizzes';
import app from './app';
import levels from './levels';
import user from './user';

export default combineReducers({
  quizzes,
  app,
  levels,
  user,
});
