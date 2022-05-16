import * as api from '../../api';
import { QuizCreate } from '../../models';
import { handleCallApi } from '../utils';
import { CREATE, GET_ALL } from '../actionTypes';
import { AppDispatch, AppThunk } from '../store';

export const getQuizzes =
  (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.getQuizzes();

      dispatch({ type: GET_ALL, payload: data });
    });
  };

export const createQuiz =
  (quiz: QuizCreate) => async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.createQuiz(quiz);

      dispatch({ type: CREATE, payload: data });
    });
  };
