import {
  DOWNLOADING,
  END_DONWLOAD,
  START_DOWNLOAD,
  STOP_DOWNLOAD,
  UPDATE_CHAPTER_DOWNLOAD,
  DOWNLOAD_DONE,
  DOWNLOAD_ERROR,
  RETRY_DOWNLOAD
} from "../actions/actionsTypes";

const initState = {
  isDownloading: false,
  jobId: null,
  progress: 0,
  contentLength: 0,
  bookData: null,
  chapterId: null,
  chapters: [],
  downloadDone: false,
  error: null,
  retry: false
};
function downloadReducer(state = initState, action) {
  switch (action.type) {
    case UPDATE_CHAPTER_DOWNLOAD:
      return {
        ...state,
        chapters: action.chapters,
        bookData: action.bookData
      };
    case START_DOWNLOAD:
      return {
        ...state,
        isDownloading: true,
        chapterId: action.chapterId,
        jobId: action.jobId,
        contentLength: action.contentLength,
        downloadDone: false,
        error: null,
        retry: false
      };
    case DOWNLOADING:
      return {
        ...state,
        progress: action.progress,
        retry: false
      };
    case STOP_DOWNLOAD:
      return {
        ...state,
        isDownloading: false,
        retry: false
      };
    case END_DONWLOAD:
      return {
        ...state,
        ...initState
      };
    case DOWNLOAD_DONE:
      return {
        ...state,
        isDownloading: false,
        chapterId: null,
        jobId: null,
        downloadDone: true,
        retry: false
      };
    case DOWNLOAD_ERROR:
      return {
        ...state,
        error: action.error,
        isDownloading: false,
        retry: false
      }  
    case RETRY_DOWNLOAD:
      return {
        ...state,
        retry: true
      }  
    default:
      return state;
  }
}

export default downloadReducer;
