import { HIDE_PLAYER, SHOW_PLAYER } from "../actions/actionsTypes";

function playerReducer(state = { playerShow: false }, action) {
  switch (action.type) {
    case HIDE_PLAYER:
      return {
        ...state,
        playerShow: false
      };
    case SHOW_PLAYER:
      return {
        ...state,
        playerShow: true
      };
    default:
      return state;
  }
}

export default playerReducer;
