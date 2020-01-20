import {
  PLAYBACK_INIT,
  PLAYBACK_STATE,
  PLAYBACK_TRACK
} from "../actions/actionsTypes";

function playbackReducer(
  state = { state: "init", currentTrack: null, bookId: null },
  action
) {
  switch (action.type) {
    case PLAYBACK_INIT:
      return {
        ...state,
        init: true
      };
    case PLAYBACK_STATE:
      return {
        ...state,
        state: action.state
      };
    case PLAYBACK_TRACK:
      return {
        ...state,
        currentTrack: action.track,
        bookId: action.bookId
      };
    default:
      return state;
  }
}
export default playbackReducer;
