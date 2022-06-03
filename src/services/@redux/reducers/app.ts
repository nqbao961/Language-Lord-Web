import { AnyAction } from 'redux';
import { SHOW_LOADING, HIDE_LOADING } from '../actionTypes';

const defaultAppState: {
  loading: boolean;
} = {
  loading: false,
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
    default:
      return app;
  }
};
