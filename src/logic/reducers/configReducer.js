import {
  FETCH_CONFIG,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_ERROR
} from "../actions/actionsTypes";
const initState = {
  isFetching: false,
  error: null,
  data: {},
  isFetched: false
};

function configReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_CONFIG:
      return {
        ...state,
        isFetching: true,
        error: null,
        isFetched: false
      };
    case FETCH_CONFIG_SUCCESS:
      return {
        ...state,
        data: action.data,
        isFetched: true
      };
    case FETCH_CONFIG_ERROR:
      return {
        ...state,
        error: action.error,
        isFetched: true
      };
    default:
      return state;
  }
}

export default configReducer;
