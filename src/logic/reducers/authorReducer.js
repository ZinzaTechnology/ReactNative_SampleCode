import {
  FETCH_AUTHOR_DATA,
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_ERROR,
  ACTIVE_FILTER_AUTHOR,
  DEACTIVE_FILTER_AUTHOR
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0,
  activeFilter: null
};

function authorReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_AUTHOR_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_AUTHOR_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_AUTHOR_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case ACTIVE_FILTER_AUTHOR:
      return {
        ...state,
        activeFilter: action.authorId
      };
    case DEACTIVE_FILTER_AUTHOR:
      return {
        ...state,
        activeFilter: null
      };
    default:
      return state;
  }
}

export default authorReducer;
