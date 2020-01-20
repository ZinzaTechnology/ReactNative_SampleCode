import {
  FETCH_SEARCH_DATA,
  FETCH_SEARCH_SUCCESS,
  FETCH_SEARCH_ERROR,
  REFRESH_SEARCH_DATA,
  CHANGE_SEARCH_TEXT
} from "./actionsTypes";
import * as api from "../../logic/api";

const requestSearchData = () => {
  return {
    type: FETCH_SEARCH_DATA
  };
};

const receiveSearchData = (items, nextPage) => {
  return {
    type: FETCH_SEARCH_SUCCESS,
    items,
    nextPage
  };
};

const refreshSearchData = (items, nextPage) => {
  return {
    type: REFRESH_SEARCH_DATA,
    items,
    nextPage
  };
};

const fetchSearchError = error => {
  return {
    type: FETCH_SEARCH_ERROR,
    error
  };
};

export const changeSearchText = searchText => {
  return {
    type: CHANGE_SEARCH_TEXT,
    searchText
  };
};

const fetchSearchData = (refresh, page) => {
  return async (dispatch, getState) => {
    dispatch(requestSearchData());
    const { author, category, speaker, sponsor, search } = getState();
    const { activeFilter: authorFilter } = author;
    const { activeFilter: categoryFilter } = category;
    const { activeFilter: speakerFilter } = speaker;
    const { activeFilter: sponsorFilter } = sponsor;
    const searchText = search.searchText.trim();
    const itemPerPage = 6;
    const requestPage = refresh ? 0 : page;
    api
      .getSearchList(
        requestPage,
        itemPerPage,
        searchText,
        authorFilter,
        categoryFilter,
        speakerFilter,
        sponsorFilter
      )
      .then(response => {
        const { content } = response.body;
        const nextPage = content.length < itemPerPage ? null : requestPage + 1;
        if (refresh) {
          dispatch(refreshSearchData(content, nextPage));
        } else {
          dispatch(receiveSearchData(content, nextPage));
        }
      })
      .catch(error => dispatch(fetchSearchError(error)));
  };
};

const shouldFetchSearchData = (state, refresh) => {
  if (!state) return true;
  if (state.nextPage === null) {
    return refresh ? !state.isFetching : false;
  }
  if (!state.items) return true;
  return !state.isFetching;
};

export const fetchSearchDataIfNeed = refresh => {
  return (dispatch, getState) => {
    const state = getState().search;
    const { nextPage } = state;
    if (shouldFetchSearchData(state, refresh)) {
      return dispatch(fetchSearchData(refresh, nextPage));
    }
  };
};
