import { AnyAction } from 'redux';
import { Level } from '../../models';
import { CREATE_LEVEL, GET_ALL_LEVELS } from '../actionTypes';

export default (levels: Level[] = [], action: AnyAction) => {
  switch (action.type) {
    case GET_ALL_LEVELS:
      return action.payload as Level[];
    case CREATE_LEVEL:
      return [...levels, action.payload as Level];
    default:
      return levels;
  }
};
