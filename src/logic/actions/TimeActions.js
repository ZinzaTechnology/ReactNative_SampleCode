import { UPDATE_CHAPTER_TIME } from "./actionsTypes";
import openConnection from "../../logic/realm";
import * as Utils from "../../logic/utils";

export const updateTime = (bookId, chapterId, time, doneState) => {
  return {
    type: UPDATE_CHAPTER_TIME,
    bookId,
    chapterId,
    time,
    doneState
  };
};

export const updateChapterTime = (bookId, chapterId, time) => {
  return async dispatch => {
    const realm = await openConnection();
    const chapters = realm.objects("Chapter");
    const chapterFilter = chapters.filtered(`id = "${chapterId}"`).snapshot();
    let doneState = false;
    if (chapterFilter && chapterFilter.length > 0) {
      const totalTime = Utils.getFormatTimeSecond(chapterFilter[0].duration);
      doneState = time >= totalTime;
    }
    return dispatch(updateTime(bookId, chapterId, time, doneState));
  };
};
