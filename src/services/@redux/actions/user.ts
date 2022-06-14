import {
  UPDATE_USER_HINT,
  UPDATE_USER_LEVEL,
  UPDATE_USER_QUIZZES,
  UPDATE_USER_SCORE,
} from '../actionTypes';
import { AppDispatch } from '../store';

export const updateUserLevel =
  (levelNumber: number) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_USER_LEVEL, payload: levelNumber });
  };

export const updateUserScore = (score: number) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_USER_SCORE, payload: score });
};

export const updateUserHint = (hint: number) => (dispatch: AppDispatch) => {
  dispatch({ type: UPDATE_USER_HINT, payload: hint });
};

export const updateUserQuizzes =
  (completedQuizId: string) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_USER_QUIZZES, payload: completedQuizId });
  };
