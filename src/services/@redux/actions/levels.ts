import * as api from '../../api';
import { Level, LevelCreate } from '../../models';
import { handleCallApi } from '../utils';
import { CREATE_LEVEL, GET_ALL_LEVELS } from '../actionTypes';
import { AppDispatch, AppThunk } from '../store';

export const getLevels =
  (): AppThunk<Promise<Level[]>> => async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.getLevels();

      dispatch({ type: GET_ALL_LEVELS, payload: data });

      return data;
    });
  };

export const getLevel =
  (levelId: number): AppThunk<Promise<Level>> =>
  async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.getLevel(levelId);

      return data;
    });
  };

export const createLevel =
  (level: LevelCreate): AppThunk<Promise<Level>> =>
  async (dispatch: AppDispatch) => {
    return handleCallApi(dispatch, async () => {
      const { data } = await api.createLevel(level);

      dispatch({ type: CREATE_LEVEL, payload: data });

      return data;
    });
  };
