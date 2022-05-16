import { Modal } from '../../models';
import { HIDE_MODAL, SHOW_MODAL } from '../actionTypes';
import { AppDispatch } from '../store';

export const showModal = (modal: Modal) => async (dispatch: AppDispatch) => {
  dispatch({
    type: SHOW_MODAL,
    payload: {
      show: true,
      ...modal,
    },
  });
};

export const hideModal = () => async (dispatch: AppDispatch) => {
  dispatch({ type: HIDE_MODAL });
};
