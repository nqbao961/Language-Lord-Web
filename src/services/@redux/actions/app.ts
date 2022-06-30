import {
  UPDATE_GAINED_HINT,
  UPDATE_GAINED_SCORE,
  UPDATE_PLAYING_LEVEL,
  UPDATE_REMAIN_TIME,
} from '../actionTypes';
import { AppDispatch } from '../store';

export const updateRemainTime =
  (remainTime: number) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_REMAIN_TIME, payload: remainTime });
  };

export const updateGainedScore =
  (gainedScore: number) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_GAINED_SCORE, payload: gainedScore });
  };

export const updateGainedHint =
  (gainedHint: number) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_GAINED_HINT, payload: gainedHint });
  };

export const updatePlayingLevel =
  (playingLevel: number) => (dispatch: AppDispatch) => {
    dispatch({ type: UPDATE_PLAYING_LEVEL, payload: playingLevel });
  };
