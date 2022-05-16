import { AnyAction } from 'redux';
import { Modal } from '../../models';
import {
  SHOW_LOADING,
  HIDE_LOADING,
  SHOW_MODAL,
  HIDE_MODAL,
} from '../actionTypes';

const defaultAppState: {
  loading: boolean;
  modal: {
    show: boolean;
  } & Modal;
} = {
  loading: false,
  modal: {
    show: false,
    showClose: true,
    showCloseButton: true,
    allowEsc: true,
  },
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
    case SHOW_MODAL:
      return {
        ...app,
        modal: {
          ...defaultAppState.modal,
          ...action.payload,
        } as {
          show: boolean;
        } & Modal,
      };
    case HIDE_MODAL:
      return {
        ...app,
        modal: defaultAppState.modal,
      };
    default:
      return app;
  }
};
