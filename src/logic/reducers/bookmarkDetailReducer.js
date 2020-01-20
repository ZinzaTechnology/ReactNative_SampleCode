import {
  FETCH_BOOKMARK_DATA,
  FETCH_BOOKMARK_SUCCESS,
  FETCH_BOOKMARK_ERROR,
  POST_BOOKMARK,
  POST_BOOKMARK_SUCCESS,
  POST_BOOKMARK_ERROR,
  DELETE_BOOKMARK,
  DELETE_BOOKMARK_SUCCESS,
  DELETE_BOOKMARK_ERROR,
  EDIT_BOOKMARK,
  EDIT_BOOKMARK_ERROR,
  EDIT_BOOKMARK_SUCCESS
} from "../actions/actionsTypes";
import _ from "lodash";

const initState = {
  isGetFetching: false,
  loading: false,
  errorGet: null,
  error: null,
  items: []
};

function bookmarkDetailReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_BOOKMARK_DATA:
      return {
        ...state,
        isGetFetching: true,
        errorGet: null
      };
    case FETCH_BOOKMARK_SUCCESS:
      const items = _.sortBy(action.data, ["duration"]);
      return {
        ...state,
        isGetFetching: false,
        items,
        errorGet: null
      };
    case FETCH_BOOKMARK_ERROR:
      return {
        ...state,
        isGetFetching: false,
        errorGet: action.error
      };
    case POST_BOOKMARK:
    case DELETE_BOOKMARK:
    case EDIT_BOOKMARK:
      return {
        ...state,
        loading: true,
        error: null
      };

    case POST_BOOKMARK_ERROR:
    case DELETE_BOOKMARK_ERROR:
    case EDIT_BOOKMARK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    case POST_BOOKMARK_SUCCESS:
      const allItems = _.concat(state.items, action.data);
      const itemAfterPost = _.sortBy(allItems, ["duration"]);
      return {
        ...state,
        loading: false,
        items: itemAfterPost,
        error: null
      };
    case DELETE_BOOKMARK_SUCCESS:
      const itemsAfterDelete = state.items.filter(item => {
        return item.id != action.bookmarkId;
      });
      return {
        ...state,
        items: itemsAfterDelete,
        loading: false
      };
    case EDIT_BOOKMARK_SUCCESS:
      const itemsAfterEdit = state.items.map(item => {
        if (item.id == action.bookmarkId) {
          return { ...item, comment: action.content };
        } else {
          return item;
        }
      });
      console.log('====================================');
      console.log("loading: false");
      console.log('====================================');
      return {
        ...state,
        items: itemsAfterEdit,
        loading: false
      };
    default:
      return state;
  }
}

export default bookmarkDetailReducer;
