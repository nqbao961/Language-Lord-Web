import { AnyAction } from 'redux';
import { User } from '../../models';
import {
  GET_USER,
  UPDATE_USER,
  UPDATE_USER_HINT,
  UPDATE_USER_LANG,
  UPDATE_USER_LEVEL,
  UPDATE_USER_QUIZZES,
  UPDATE_USER_SCORE,
} from '../actionTypes';

const defaultUserState: User = localStorage.getItem('user')
  ? (JSON.parse(localStorage.getItem('user')!) as User)
  : {
      _id: 'guest',
      email: '',
      name: 'Guest User',
      role: 'user',
      preferedLang:
        (localStorage.getItem('i18nextLng')?.slice(0, 2) as
          | User['preferedLang']
          | null) || 'en',
      level: { vi: 1, en: 1 },
      score: { vi: 0, en: 0 },
      hint: { vi: 3, en: 3 },
      completedQuizzes: { vi: [], en: [] },
    };

export default (user = defaultUserState, action: AnyAction) => {
  const lang = user.preferedLang;

  switch (action.type) {
    case GET_USER:
      return (action.payload as User)
        ? (action.payload as User)
        : defaultUserState;

    case UPDATE_USER:
      return action.payload as User;

    case UPDATE_USER_LANG:
      return {
        ...user,
        preferedLang: action.payload,
      } as User;

    case UPDATE_USER_LEVEL:
      const level = { ...user.level };
      level[lang] = action.payload;

      return {
        ...user,
        level,
      } as User;

    case UPDATE_USER_HINT:
      const hint = { ...user.hint };
      hint[lang] = action.payload;

      return {
        ...user,
        hint,
      } as User;

    case UPDATE_USER_SCORE:
      const score = { ...user.score };
      score[lang] = action.payload;

      return {
        ...user,
        score,
      } as User;

    case UPDATE_USER_QUIZZES:
      const completedQuizzes = { ...user.completedQuizzes };
      completedQuizzes[lang] = [
        ...user.completedQuizzes[lang],
        ...action.payload,
      ];

      return {
        ...user,
        completedQuizzes,
      } as User;

    default:
      return user;
  }
};
