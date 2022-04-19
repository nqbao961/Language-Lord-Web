import { Action, AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import * as api from '../../api';
import { Quiz, QuizCreate } from '../../models';
import { CREATE, GET_ALL } from '../actionTypes';
import { AppDispatch, AppThunk, RootState } from '../store';

export const getQuizzes =
  (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    try {
      const { data } = await api.getQuizzes();

      dispatch({ type: GET_ALL, payload: data });
    } catch (error: any) {
      console.log(error.message);
    }
  };

export const createQuiz = (quiz: QuizCreate) => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.createQuiz(quiz);

    dispatch({ type: CREATE, payload: data });
  } catch (error: any) {
    console.log(error.message);
  }
};
