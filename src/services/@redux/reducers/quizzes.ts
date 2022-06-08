import { AnyAction } from 'redux';
import { Quiz } from '../../models';
import { CREATE_QUIZ, GET_ALL_QUIZZES } from '../actionTypes';

export default (quizzes: Quiz[] = [], action: AnyAction) => {
  switch (action.type) {
    case GET_ALL_QUIZZES:
      return action.payload as Quiz[];
    case CREATE_QUIZ:
      return [...quizzes, action.payload as Quiz];
    default:
      return quizzes;
  }
};
