import {
  UPDATE_BOTTOM_SHEET_STATE
} from "../actions/actionsTypes";
const initState = {
  isOpen: false
};

function bottomSheetReducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_BOTTOM_SHEET_STATE:
      return {
        ...state,
        isOpen: action.state,
      };
    default:
      return state;
  }
}

export default bottomSheetReducer;
