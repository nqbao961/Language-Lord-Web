import { AnyAction } from 'redux';
import { Quiz, User } from '../../models';
import {
  UPDATE_USER_HINT,
  UPDATE_USER_LEVEL,
  UPDATE_USER_QUIZZES,
  UPDATE_USER_SCORE,
} from '../actionTypes';

const defaultUserState: User = {
  _id: 'guest',
  email: '',
  role: 'user',
  preferedLang: 'en',
  level: { vi: 1, en: 1 },
  score: { vi: 0, en: 0 },
  hint: { vi: 3, en: 3 },
  completedQuizzes: { vi: [], en: [] },
};

export default (user = defaultUserState, action: AnyAction) => {
  switch (action.type) {
    case UPDATE_USER_LEVEL:
      return {
        ...user,
        level: {
          vi: 1,
          en: action.payload,
        },
      } as User;
    case UPDATE_USER_HINT:
      return {
        ...user,
        hint: {
          vi: 3,
          en: action.payload,
        },
      } as User;
    case UPDATE_USER_SCORE:
      return {
        ...user,
        score: {
          vi: 0,
          en: action.payload,
        },
      } as User;
    case UPDATE_USER_QUIZZES:
      return {
        ...user,
        completedQuizzes: {
          vi: [],
          en: [...user.completedQuizzes.en, action.payload],
        },
      } as User;
    default:
      return user;
  }
};
