import {
  FETCH_LIST_NOTIFICATION_DATA,
  FETCH_LIST_NOTIFICATION_SUCCESS,
  FETCH_LIST_NOTIFICATION_ERROR,
  REFRESH_LIST_NOTIFICATION_DATA
} from "./actionsTypes";
import * as api from "../api";

const requestNotificationData = () => {
  return {
    type: FETCH_LIST_NOTIFICATION_DATA
  };
};

const receiveNotificationData = (items, nextPage) => {
  return {
    type: FETCH_LIST_NOTIFICATION_SUCCESS,
    items,
    nextPage
  };
};

const refreshNotificationData = (items, nextPage) => {
  return {
    type: REFRESH_LIST_NOTIFICATION_DATA,
    items,
    nextPage
  };
};

const fetchNotificationError = error => {
  return {
    type: FETCH_LIST_NOTIFICATION_ERROR,
    error
  };
};

const fetchNotificationData = (refresh, page) => {
  return async dispatch => {
    dispatch(requestNotificationData());
    const itemPerPage = 10;
    const requestPage = refresh ? 0 : page
    api
      .getListNotification(requestPage, itemPerPage)
      .then(response => {
        const { content } = response.body;
        const nextPage = content.length < itemPerPage ? null : requestPage + 1;

        if (refresh) {
          dispatch(refreshNotificationData(content, nextPage));
        } else {
          dispatch(receiveNotificationData(content, nextPage));
        }
      })
      .catch(error => dispatch(fetchNotificationError(error)));
  };
};

const shouldFetchNotificationData = (state, refresh) => {
  if (!state) return true;
  if (state.nextPage === null) {
    return refresh ? !state.isFetching : false;
  }
  if (!state.items) return true;
  return !state.isFetching;
};

export const fetchNotificationDataIfNeed = refresh => {
  return (dispatch, getState) => {
    const state = getState().notification;
    const { nextPage } = state;
    if (shouldFetchNotificationData(state, refresh)) {
      return dispatch(fetchNotificationData(refresh, nextPage));
    }
  };
};
