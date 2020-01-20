import {
  FETCH_LIST_BOOKMARK_DATA,
  FETCH_LIST_BOOKMARK_SUCCESS,
  FETCH_LIST_BOOKMARK_ERROR,
  REFRESH_LIST_BOOKMARK_DATA,
  FETCH_BOOKMARK_DATA,
  FETCH_BOOKMARK_SUCCESS,
  FETCH_BOOKMARK_ERROR,
  POST_BOOKMARK,
  POST_BOOKMARK_SUCCESS,
  POST_BOOKMARK_ERROR,
  DELETE_BOOKMARK_SUCCESS,
  DELETE_BOOKMARK_ERROR,
  EDIT_BOOKMARK_SUCCESS,
  EDIT_BOOKMARK_ERROR,
  DELETE_BOOKMARK,
  EDIT_BOOKMARK
} from "./actionsTypes";
import * as api from "../../logic/api";

const requestGetListBookmark = () => {
  return {
    type: FETCH_LIST_BOOKMARK_DATA
  };
};

const receiveGetListBookmark = (items, nextPage) => {
  return {
    type: FETCH_LIST_BOOKMARK_SUCCESS,
    items,
    nextPage
  };
};

const refreshGetListBookmark = (items, nextPage) => {
  return {
    type: REFRESH_LIST_BOOKMARK_DATA,
    items,
    nextPage
  };
};

const getListBookmarkError = error => {
  return {
    type: FETCH_LIST_BOOKMARK_ERROR,
    error
  };
};

const requestGetBookmarkData = (bookId, chapterId) => {
  return {
    type: FETCH_BOOKMARK_DATA,
    bookId,
    chapterId
  };
};

const receiveGetBookmarkData = (bookId, chapterId, data) => {
  return {
    type: FETCH_BOOKMARK_SUCCESS,
    bookId,
    chapterId,
    data
  };
};

const fetchGetBookmarkError = error => {
  return {
    type: FETCH_BOOKMARK_ERROR,
    error
  };
};

const requestPostBookmarkData = () => {
  return {
    type: POST_BOOKMARK
  };
};

const receivePostBookmarkSuccess = (bookId, chapterId, data) => {
  return dispatch => {
    dispatch(fetchListBookmarkDataIfNeed(true));
    dispatch({
      type: POST_BOOKMARK_SUCCESS,
      bookId,
      chapterId,
      data
    });
  };
};

const fetchPostBookmarkError = error => {
  return {
    type: POST_BOOKMARK_ERROR,
    error
  };
};

const fetchDeleteBookmark = () => {
  return {
    type: DELETE_BOOKMARK
  };
};

const deleteBookmarkSuccess = (bookId, chapterId, bookmarkId) => {
  return dispatch => {
    dispatch(fetchListBookmarkDataIfNeed(true));
    dispatch({
      type: DELETE_BOOKMARK_SUCCESS,
      bookId,
      chapterId,
      bookmarkId
    });
  };
};

const deleteBookmarkError = error => {
  return {
    type: DELETE_BOOKMARK_ERROR,
    error
  };
};

const fetchEditBookmark = () => {
  return {
    type: EDIT_BOOKMARK
  };
};

const editBookmarkSuccess = (bookId, chapterId, bookmarkId, content) => {
  return dispatch => {
    dispatch(fetchListBookmarkDataIfNeed(true));
    dispatch({
      type: EDIT_BOOKMARK_SUCCESS,
      bookId,
      chapterId,
      bookmarkId,
      content
    });
  };
};

const editBookmarkError = error => {
  return {
    type: EDIT_BOOKMARK_ERROR,
    error
  };
};

const fetchListBookmarkData = (refresh, page) => {
  return async dispatch => {
    dispatch(requestGetListBookmark());
    const itemPerPage = 10;
    const requestPage = refresh ? 0 : page;
    api
      .getListBookmark(requestPage, itemPerPage)
      .then(response => {
        const { content } = response.body;
        const nextPage = content.length < itemPerPage ? null : requestPage + 1;

        if (refresh) {
          dispatch(refreshGetListBookmark(content, nextPage));
        } else {
          dispatch(receiveGetListBookmark(content, nextPage));
        }
      })
      .catch(error => dispatch(getListBookmarkError(error)));
  };
};

const shouldFetchListBookmarkData = (state, refresh) => {
  if (!state) return true;
  if (state.nextPage === null) {
    return refresh ? !state.isFetching : false;
  }
  if (!state.items) return true;
  return !state.isFetching;
};

export const fetchListBookmarkDataIfNeed = refresh => {
  return (dispatch, getState) => {
    const state = getState().bookmark;
    const { nextPage } = state;
    if (shouldFetchListBookmarkData(state, refresh)) {
      return dispatch(fetchListBookmarkData(refresh, nextPage));
    }
  };
};

export const getBookmarkData = (bookId, chapterId) => {
  return async dispatch => {
    dispatch(requestGetBookmarkData(bookId, chapterId));
    api
      .getBookmark(bookId, chapterId)
      .then(async response => {
        const { status, body } = response;
        if (status == 200) {
          dispatch(receiveGetBookmarkData(bookId, chapterId, body));
        } else {
          dispatch(fetchGetBookmarkError(response));
        }
      })
      .catch(error => dispatch(fetchGetBookmarkError(error)));
  };
};

export const postBookmarkData = (bookId, chapterId, comment, duration) => {
  return async dispatch => {
    dispatch(requestPostBookmarkData());
    api
      .addBookmark(bookId, chapterId, comment, duration)
      .then(response => {
        const { status, body } = response;
        if (status == 200) {
          dispatch(receivePostBookmarkSuccess(bookId, chapterId, body));
        } else {
          dispatch(fetchPostBookmarkError(response));
        }
      })
      .catch(error => dispatch(fetchPostBookmarkError(error)));
  };
};

export const deleteBookmarkData = (bookId, chapterId, bookmarkId) => {
  return async dispatch => {
    dispatch(fetchDeleteBookmark());
    api
      .deleteBookmark(bookmarkId)
      .then(response => {
        const { status, body } = response;
        if (status == 200) {
          dispatch(deleteBookmarkSuccess(bookId, chapterId, bookmarkId));
        } else {
          dispatch(fetchPostBookmarkError(body));
        }
      })
      .catch(error => dispatch(deleteBookmarkError(error)));
  };
};

export const editBookmarkData = (bookId, chapterId, bookmarkId, content) => {
  return async dispatch => {
    // dispatch(editBookmarkSuccess(bookId, chapterId, bookmarkId, content));
    dispatch(fetchEditBookmark());
    api
      .editBookmark(bookmarkId, content)
      .then(response => {
        const { status } = response;
        if (status == 200) {
          dispatch(editBookmarkSuccess(bookId, chapterId, bookmarkId, content));
        } else {
          dispatch(editBookmarkError(response));
        }
      })
      .catch(error => dispatch(editBookmarkError(error)));
  };
};
