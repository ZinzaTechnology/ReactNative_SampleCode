import { UPDATE_CHAPTER_TIME } from "../actions/actionsTypes";

const initState = {};

function timeReducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_CHAPTER_TIME:
      return {
        ...state,
        [action.bookId]: {
          ...state[action.bookId],
          [action.chapterId]: { time: action.time, isDone: action.doneState }
        }
      };
    default:
      return state;
  }
}

export default timeReducer;
