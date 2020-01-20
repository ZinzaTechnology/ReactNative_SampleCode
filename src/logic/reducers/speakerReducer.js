import {
  FETCH_SPEAKER_DATA,
  FETCH_SPEAKER_SUCCESS,
  FETCH_SPEAKER_ERROR,
  ACTIVE_FILTER_SPEAKER,
  DEACTIVE_FILTER_SPEAKER
} from "../actions/actionsTypes";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0,
  activeFilter: null
};

function speakerReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_SPEAKER_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_SPEAKER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_SPEAKER_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case ACTIVE_FILTER_SPEAKER:
      return {
        ...state,
        activeFilter: action.speakerId
      };
    case DEACTIVE_FILTER_SPEAKER:
      return {
        ...state,
        activeFilter: null
      };
    default:
      return state;
  }
}

export default speakerReducer;
