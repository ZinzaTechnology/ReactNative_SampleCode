import {
  FETCH_LIST_HISTORY_DATA,
  FETCH_LIST_HISTORY_SUCCESS,
  FETCH_LIST_HISTORY_ERROR,
  REFRESH_LIST_HISTORY_DATA
} from "./actionsTypes";
import * as api from "../../logic/api";

const requestHistoryData = () => {
  return {
    type: FETCH_LIST_HISTORY_DATA
  };
};

const receiveHistoryData = (items, nextPage) => {
  return {
    type: FETCH_LIST_HISTORY_SUCCESS,
    items,
    nextPage
  };
};

const refreshHistoryData = (items, nextPage) => {
  return {
    type: REFRESH_LIST_HISTORY_DATA,
    items,
    nextPage
  };
};

const fetchHistoryError = error => {
  return {
    type: FETCH_LIST_HISTORY_ERROR,
    error
  };
};

const fetchHistoryData = (refresh, page) => {
  return async dispatch => {
    dispatch(requestHistoryData());
    const itemPerPage = 10;
    const requestPage = refresh ? 0 : page
    api
      .getHistory(requestPage, itemPerPage)
      .then(response => {
        const { content } = response.body;
        const nextPage = content.length < itemPerPage ? null : requestPage + 1;

        if (refresh) {
          dispatch(refreshHistoryData(content, nextPage));
        } else {
          dispatch(receiveHistoryData(content, nextPage));
        }
      })
      .catch(error => dispatch(fetchHistoryError(error)));
  };
};

const shouldFetchHistoryData = (state, refresh) => {
  if (!state) return true;
  if (state.nextPage === null) {
    return refresh ? !state.isFetching : false;
  }
  if (!state.items) return true;
  return !state.isFetching;
};

export const fetchHistoryDataIfNeed = refresh => {
  return (dispatch, getState) => {
    const state = getState().history;
    const { nextPage } = state;
    if (shouldFetchHistoryData(state, refresh)) {
      return dispatch(fetchHistoryData(refresh, nextPage));
    }
  };
};
