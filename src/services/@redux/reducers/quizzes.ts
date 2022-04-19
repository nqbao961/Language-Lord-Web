import { AnyAction } from 'redux';
import { Quiz } from '../../models';
import { CREATE, GET_ALL } from '../actionTypes';

export default (quizzes: Quiz[] = [], action: AnyAction) => {
  switch (action.type) {
    case GET_ALL:
      return action.payload;
    case CREATE:
      return [...quizzes, action.payload];
    default:
      return quizzes;
  }
};
