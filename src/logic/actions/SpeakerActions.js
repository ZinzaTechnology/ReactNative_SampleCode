import {
  FETCH_SPEAKER_DATA,
  FETCH_SPEAKER_SUCCESS,
  FETCH_SPEAKER_ERROR,
  ACTIVE_FILTER_SPEAKER,
  DEACTIVE_FILTER_SPEAKER
} from "./actionsTypes";

import * as api from "../api";

const requestSpeakerData = () => {
  return {
    type: FETCH_SPEAKER_DATA
  };
};

const receiveSpeakerData = items => {
  return {
    type: FETCH_SPEAKER_SUCCESS,
    items
  };
};

const fetchSpeakerError = error => {
  return {
    type: FETCH_SPEAKER_ERROR,
    error
  };
};

export const activeFilterSpeaker = speakerId => {
  return {
    type: ACTIVE_FILTER_SPEAKER,
    speakerId
  }
}

export const deactiveFilterSpeaker = _ => {
  return {
    type: DEACTIVE_FILTER_SPEAKER
  }
}

const fetchSpeakerData = () => {
  return dispatch => {
    dispatch(requestSpeakerData());
    api
      .getListSpeaker()
      .then(response => {
        const { content } = response.body;
        dispatch(receiveSpeakerData(content));
      })
      .catch(error => dispatch(fetchSpeakerError(error)));
  };
};

const shouldFetchSpeakerData = state => {
  if(state.items.length == 0){
    return !state.isFetching;
  }else{
    return state.items.length == 0
  } 
};

export const fetchSpeakerDataIfNeed = () => {
  return (dispatch, getState) => {
    const state = getState().speaker;
    if (shouldFetchSpeakerData(state)) {
      return dispatch(fetchSpeakerData());
    }
  };
};
