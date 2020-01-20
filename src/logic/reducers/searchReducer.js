import {
  FETCH_SEARCH_DATA,
  REFRESH_SEARCH_DATA,
  FETCH_SEARCH_SUCCESS,
  FETCH_SEARCH_ERROR,
  CHANGE_SEARCH_TEXT
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0,
  searchText: ""
};

function searchReducer(state = initState, action) {
  const currentItems = state.items;
  switch (action.type) {
    case FETCH_SEARCH_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_SEARCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...currentItems, ...action.items],
        nextPage: action.nextPage,
        error: null
      };
    case REFRESH_SEARCH_DATA:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_SEARCH_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case CHANGE_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText
      };
    default:
      return state;
  }
}

export default searchReducer;
