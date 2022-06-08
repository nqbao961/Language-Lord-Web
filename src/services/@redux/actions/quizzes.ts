import * as api from '../../api';
import { QuizCreate } from '../../models';
import { handleCallApi } from '../utils';
import { CREATE_QUIZ, GET_ALL_QUIZZES } from '../actionTypes';
import { AppDispatch, AppThunk } from '../store';
import { getQuizzesParams } from '../../api/type';

export const getQuizzes =
  (params?: getQuizzesParams): AppThunk<Promise<void>> =>
  async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.getQuizzes(params);

      dispatch({ type: GET_ALL_QUIZZES, payload: data });

      return data;
    });
  };

export const createQuiz =
  (quiz: QuizCreate) => async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.createQuiz(quiz);

      dispatch({ type: CREATE_QUIZ, payload: data });

      return data;
    });
  };
