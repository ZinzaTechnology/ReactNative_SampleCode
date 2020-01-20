import {
  FETCH_LIST_NOTIFICATION_DATA,
  REFRESH_LIST_NOTIFICATION_DATA,
  FETCH_LIST_NOTIFICATION_SUCCESS,
  FETCH_LIST_NOTIFICATION_ERROR
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0
};
function notificationReducer(state = initState, action) {
  const currentItems = state.items;
  switch (action.type) {
    case FETCH_LIST_NOTIFICATION_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_LIST_NOTIFICATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...currentItems, ...action.items],
        nextPage: action.nextPage,
        error: null
      };
    case REFRESH_LIST_NOTIFICATION_DATA:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_LIST_NOTIFICATION_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    default:
      return state;
  }
}

export default notificationReducer;
