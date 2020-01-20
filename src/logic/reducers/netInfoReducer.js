import * as types from "../actions/actionsTypes";

const netInfoReducer = (state = { type: "none" }, action) => {
  switch (action.type) {
    case types.NETINFO_CHANGE:
      return {
        ...state,
        type: action.netInfoType
      };
    default:
      return state;
  }
}

export default netInfoReducer
