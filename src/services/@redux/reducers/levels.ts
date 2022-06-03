import { AnyAction } from 'redux';
import { Level } from '../../models';
import { CREATE, GET_ALL } from '../actionTypes';

export default (levels: Level[] = [], action: AnyAction) => {
  switch (action.type) {
    case GET_ALL:
      return action.payload as Level[];
    case CREATE:
      return [...levels, action.payload as Level];
    default:
      return levels;
  }
};
