import {
  START_DOWNLOAD,
  DOWNLOADING,
  END_DONWLOAD,
  STOP_DOWNLOAD,
  UPDATE_CHAPTER_DOWNLOAD,
  DOWNLOAD_DONE,
  DOWNLOAD_ERROR,
  RETRY_DOWNLOAD
} from "./actionsTypes";
import _ from "lodash"

export const updateChapterDownload = (bookData, chapters) => {
  const sortedChapterById = _.sortBy(chapters, [
    function(o) {
      return o.id;
    }
  ]);
  return dispatch => {
    dispatch({
      type: UPDATE_CHAPTER_DOWNLOAD,
      chapters: sortedChapterById,
      bookData
    });
  };
};

export const startDownload = (jobId, chapterId, contentLength) => {
  return {
    type: START_DOWNLOAD,
    jobId,
    chapterId,
    contentLength
  };
};

export const downloading = progress => {
  return (dispatch, getState) => {
    const { download } = getState();
    const { isDownloading } = download;
    if (isDownloading) {
      dispatch({
        type: DOWNLOADING,
        progress
      });
    }
  };
};

export const stopDownload = () => {
  return {
    type: STOP_DOWNLOAD
  };
};

export const downloadDone = () => {
  return {
    type: DOWNLOAD_DONE
  };
};

export const endDownload = () => {
  return {
    type: END_DONWLOAD
  };
};

export const retryDownload = () => {
  return {
    type: RETRY_DOWNLOAD
  }
}

export const downloadError = error => {
  return {
    type: DOWNLOAD_ERROR,
    error
  };
};
