import {
  UPDATE_DRAWER_STATE
} from "../actions/actionsTypes";
const initState = {
  isOpen: false
};

function drawerReducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        isOpen: action.state,
      };
    default:
      return state;
  }
}

export default drawerReducer;
