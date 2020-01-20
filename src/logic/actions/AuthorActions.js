import {
  FETCH_AUTHOR_DATA,
  FETCH_AUTHOR_SUCCESS,
  FETCH_AUTHOR_ERROR,
  ACTIVE_FILTER_AUTHOR,
  DEACTIVE_FILTER_AUTHOR
} from "./actionsTypes";
import RNSecureStorage from "rn-secure-storage";
import * as constants from "../constants";
import * as api from "../api";

const requestAuthorData = () => {
  return {
    type: FETCH_AUTHOR_DATA
  };
};

const receiveAuthorData = items => {
  return {
    type: FETCH_AUTHOR_SUCCESS,
    items
  };
};

const fetchAuthorError = error => {
  return {
    type: FETCH_AUTHOR_ERROR,
    error
  };
};

export const activeFilterAuthor = authorId => {
  return {
    type: ACTIVE_FILTER_AUTHOR,
    authorId
  };
};

export const deactiveFilterAuthor = _ => {
  return {
    type: DEACTIVE_FILTER_AUTHOR
  };
};

const fetchAuthorData = () => {
  return async dispatch => {
    const authorization = await RNSecureStorage.get(constants.AS_AUTHORIZATION);
    console.log("AUTHEN TOKEN GET AUTHOR: ", authorization);
    dispatch(requestAuthorData());
    api
      .getListAuthor()
      .then(response => {
        const { content } = response.body;
        dispatch(receiveAuthorData(content));
      })
      .catch(error => dispatch(fetchAuthorError(error)));
  };
};

const shouldFetchAuthorData = state => {
  if (state.items.length == 0) {
    return !state.isFetching;
  } else {
    return state.items.length == 0;
  }
};

export const fetchAuthorDataIfNeed = () => {
  return (dispatch, getState) => {
    const state = getState().author;
    if (shouldFetchAuthorData(state)) {
      return dispatch(fetchAuthorData());
    }
  };
};
