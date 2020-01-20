import {
  FETCH_LIST_HISTORY_DATA,
  REFRESH_LIST_HISTORY_DATA,
  FETCH_LIST_HISTORY_SUCCESS,
  FETCH_LIST_HISTORY_ERROR
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0
};
function historyReducer(state = initState, action) {
  const currentItems = state.items;
  switch (action.type) {
    case FETCH_LIST_HISTORY_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_LIST_HISTORY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...currentItems, ...action.items],
        nextPage: action.nextPage,
        error: null
      };
    case REFRESH_LIST_HISTORY_DATA:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_LIST_HISTORY_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}

export default historyReducer;
