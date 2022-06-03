import * as api from '../../api';
import { LevelCreate } from '../../models';
import { handleCallApi } from '../utils';
import { CREATE, GET_ALL } from '../actionTypes';
import { AppDispatch, AppThunk } from '../store';

export const getLevels =
  (): AppThunk<Promise<void>> => async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.getLevels();

      dispatch({ type: GET_ALL, payload: data });
    });
  };

export const createLevel =
  (level: LevelCreate) => async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.createLevel(level);

      dispatch({ type: CREATE, payload: data });
    });
  };
