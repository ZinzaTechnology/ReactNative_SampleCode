import {
  FETCH_CATEGORY_DATA,
  FETCH_CATEGORY_SUCCESS,
  FETCH_CATEGORY_ERROR,
  ACTIVE_FILTER_CATEGORY,
  DEACTIVE_FILTER_CATEGORY
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0,
  activeFilter: null
};

function categoryReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_CATEGORY_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_CATEGORY_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case ACTIVE_FILTER_CATEGORY:
      return {
        ...state,
        activeFilter: action.categoryId
      };
    case DEACTIVE_FILTER_CATEGORY:  
      return {
        ...state,
        activeFilter: null
      }
    default:
      return state;
  }
}

export default categoryReducer;
