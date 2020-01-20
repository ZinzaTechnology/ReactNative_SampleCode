import {
  FETCH_SPONSOR_DATA,
  FETCH_SPONSOR_SUCCESS,
  FETCH_SPONSOR_ERROR,
  ACTIVE_FILTER_SPONSOR,
  DEACTIVE_FILTER_SPONSOR
} from "./actionsTypes";

import * as api from "../api";

const requestSponsorData = () => {
  return {
    type: FETCH_SPONSOR_DATA
  };
};

const receiveSponsorData = items => {
  return {
    type: FETCH_SPONSOR_SUCCESS,
    items
  };
};

const fetchSponsorError = error => {
  return {
    type: FETCH_SPONSOR_ERROR,
    error
  };
};

export const activeFilterSponsor = sponsorId => {
  return {
    type: ACTIVE_FILTER_SPONSOR,
    sponsorId
  }
}

export const deactiveFilterSponsor = _ => {
  return {
    type: DEACTIVE_FILTER_SPONSOR
  }
}

const fetchSponsorData = () => {
  return dispatch => {
    dispatch(requestSponsorData());
    api
      .getListSponsor()
      .then(response => {
        const { content } = response.body;
        dispatch(receiveSponsorData(content));
      })
      .catch(error => dispatch(fetchSponsorError(error)));
  };
};

const shouldFetchSponsorData = state => {
  if(state.items.length == 0){
    return !state.isFetching;
  }else{
    return state.items.length == 0
  } 
};

export const fetchSponsorDataIfNeed = () => {
  return (dispatch, getState) => {
    const state = getState().sponsor;
    if (shouldFetchSponsorData(state)) {
      return dispatch(fetchSponsorData());
    }
  };
};
