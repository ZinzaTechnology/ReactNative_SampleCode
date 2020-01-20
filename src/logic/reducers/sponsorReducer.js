import {
  FETCH_SPONSOR_DATA,
  FETCH_SPONSOR_SUCCESS,
  FETCH_SPONSOR_ERROR,
  ACTIVE_FILTER_SPONSOR,
  DEACTIVE_FILTER_SPONSOR
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0,
  activeFilter: null
};

function sponsorReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_SPONSOR_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_SPONSOR_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_SPONSOR_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case ACTIVE_FILTER_SPONSOR:
      return {
        ...state,
        activeFilter: action.sponsorId
      };
    case DEACTIVE_FILTER_SPONSOR:
      return {
        ...state,
        activeFilter: null
      };
    default:
      return state;
  }
}

export default sponsorReducer;
