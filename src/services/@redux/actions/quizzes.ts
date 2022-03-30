import { Dispatch } from 'redux';
import * as api from '../../api';

export const getQuizzes = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await api.getQuizzes();

    dispatch({ type: 'GET_ALL', payload: data });
  } catch (error: any) {
    console.log(error.message);
  }
};
