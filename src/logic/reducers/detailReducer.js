import {
  FETCH_DETAIL_DATA,
  FETCH_DETAIL_SUCCESS,
  FETCH_DETAIL_ERROR,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_PROCESS
} from "../actions/actionsTypes";
const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0
};

function getChapterProcess(items, action) {
  const { chapterId, processPoint } = action;
  const chapterItems = items.map(item => {
    if (item.id === chapterId) {
      return { ...item, downloadProcess: processPoint };
    } else {
      return item;
    }
  });
  return chapterItems;
}

function getChapterSuccess(items, action) {
  const { chapterId, url } = action;
  const chapterItems = items.map(item => {
    if (item.id === chapterId) {
      return { ...item, isDownloaded: true, url };
    } else {
      return item;
    }
  });
  return chapterItems;
}

function getDetail(state = initState, action) {
  const currentItems = state.items;
  switch (action.type) {
    case FETCH_DETAIL_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...currentItems, ...action.items],
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_DETAIL_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };

    case DOWNLOAD_PROCESS:
      return {
        ...state,
        items: getChapterProcess(state.items, action)
      };
    case DOWNLOAD_SUCCESS:
      return {
        ...state,
        items: getChapterSuccess(state.items, action)
      };
    default:
      return state;
  }
}

function detailReducer(state = {}, action) {
  switch (action.type) {
    case FETCH_DETAIL_DATA:
    case FETCH_DETAIL_SUCCESS:
    case FETCH_DETAIL_ERROR:
    case DOWNLOAD_SUCCESS:
    case DOWNLOAD_PROCESS:
      return {
        ...state,
        [action.bookId]: getDetail(state[action.bookId], action)
      };
    default:
      return state;
  }
}

export default detailReducer;
