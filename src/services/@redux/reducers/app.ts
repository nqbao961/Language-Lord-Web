import { AnyAction } from 'redux';
import {
  SHOW_LOADING,
  HIDE_LOADING,
  UPDATE_GAINED_HINT,
  UPDATE_GAINED_SCORE,
  UPDATE_PLAYING_LEVEL,
  UPDATE_REMAIN_TIME,
} from '../actionTypes';

const defaultAppState: {
  loading: boolean;
  remainTime: number;
  gainedScore: number;
  gainedHint: number;
  playingLevel: number;
} = {
  loading: false,
  remainTime: 0,
  gainedScore: 0,
  gainedHint: 0,
  playingLevel: 0,
};

export default (app = defaultAppState, action: AnyAction) => {
  switch (action.type) {
    case SHOW_LOADING:
      return {
        ...app,
        loading: true,
      };
    case HIDE_LOADING:
      return {
        ...app,
        loading: false,
      };
    case UPDATE_REMAIN_TIME:
      return {
        ...app,
        remainTime: action.payload as number,
      };
    case UPDATE_GAINED_SCORE:
      return {
        ...app,
        gainedScore: action.payload as number,
      };
    case UPDATE_GAINED_HINT:
      return {
        ...app,
        gainedHint: action.payload as number,
      };
    case UPDATE_PLAYING_LEVEL:
      return {
        ...app,
        playingLevel: action.payload as number,
      };
    default:
      return app;
  }
};
