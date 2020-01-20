import TrackPlayer from "react-native-track-player";
import { loadTracks } from "../utils";
import _ from "lodash";

import {
  UPDATE_LIBRARY,
  LIBRARY_STATUS,
  PLAYBACK_INIT,
  PLAYBACK_STATE,
  PLAYBACK_TRACK,
  NAVIGATE_TO,
  HIDE_PLAYER,
  SHOW_PLAYER
} from "./actionsTypes";

function libraryStatus(fetching, error) {
  return {
    type: LIBRARY_STATUS,
    fetching: fetching,
    error: error
  };
}

export function fetchLibrary() {
  console.log("fetchLibrary");

  return (dispatch, getState) => {
    let state = getState();
    if (state.library && (state.library.fetching || state.library.tracks)) {
      // Already fetching or fetched
      return;
    }

    dispatch(libraryStatus(true));

    loadTracks().then(
      data => {
        dispatch({
          type: UPDATE_LIBRARY,
          tracks: data
        });
      },
      error => {
        dispatch(libraryStatus(false, error));
      }
    );
  };
}

export function initializePlayback() {
  //TODO
  return async (dispatch, getState) => {
    await TrackPlayer.setupPlayer({
      maxCacheSize: 1024 * 5 // 5 mb
    });
    dispatch({
      type: PLAYBACK_INIT
    });
  };
}

export function playbackState(state) {
  return {
    type: PLAYBACK_STATE,
    state: state
  };
}

export function playbackTrack(chapterId) {
  return async dispatch => {
    try {
      const chapterQueue = await TrackPlayer.getQueue();
      const bookId =
        chapterId != null
          ? _.find(chapterQueue, function(o) {
              return o.id == chapterId;
            }).bookId
          : null;
      dispatch({
        type: PLAYBACK_TRACK,
        track: chapterId,
        bookId
      });
    } catch (e) {
      console.log(e);
    }
  };
}

export function updatePlayback() {
  return async dispatch => {
    try {
      const chapterId = await TrackPlayer.getCurrentTrack();
      dispatch(playbackState(await TrackPlayer.getState()));
      dispatch(playbackTrack(chapterId));
    } catch (e) {
      // The player is probably not yet initialized
      // which means we don't have to update anything
    }
  };
}

export function navigateTo(screenName) {
  return {
    type: NAVIGATE_TO,
    currentScreen: screenName
  };
}

export function showPlayer() {
  return {
    type: SHOW_PLAYER
  };
}

export function hidePlayer() {
  return {
    type: HIDE_PLAYER
  };
}
