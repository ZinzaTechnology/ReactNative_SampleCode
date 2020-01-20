import * as types from "../actions/actionsTypes";

const initialState = {
  modalType: null,
  alwaysShow: false,
  modalProps: {}
};

function modalReducer(state = initialState, action) {
  switch (action.type) {
    case types.SHOW_MODAL:
      return {
        modalProps: state.alwaysShow ? state.modalProps : action.modalProps,
        modalType: state.alwaysShow ? state.modalType : action.modalType,
        alwaysShow: state.alwaysShow ? state.alwaysShow : action.alwaysShow
      };
    case types.HIDE_MODAL:
      if (action.forceHide) return initialState;
      else {
        if (state.alwaysShow) return state;
        else return initialState;
      }
    default:
      return state;
  }
}

export default modalReducer;
