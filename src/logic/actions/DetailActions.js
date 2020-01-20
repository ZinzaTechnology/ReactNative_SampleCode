import {
  FETCH_DETAIL_DATA,
  FETCH_DETAIL_SUCCESS,
  FETCH_DETAIL_ERROR,
  DOWNLOAD_SUCCESS,
  DOWNLOAD_PROCESS
} from "./actionsTypes";
import * as api from "../../logic/api";
import openConnection from "../../logic/realm";
import RNFS from "react-native-fs";

const requestDetailData = bookId => {
  return {
    type: FETCH_DETAIL_DATA,
    bookId
  };
};

const receiveDetailData = (bookId, items, nextPage) => {
  return {
    type: FETCH_DETAIL_SUCCESS,
    items,
    nextPage,
    bookId
  };
};

const fetchDetailError = (bookId, error) => {
  return {
    type: FETCH_DETAIL_ERROR,
    error,
    bookId
  };
};

export const downloadSuccess = (bookId, chapterId) => {
  const localPath = `file://${RNFS.TemporaryDirectoryPath}.Books/${bookId}/${chapterId}.mp3`;
  return {
    type: DOWNLOAD_SUCCESS,
    bookId,
    chapterId,
    url: localPath
  };
};

export const downloadProcess = (bookId, chapterId, processPoint) => {
  return {
    type: DOWNLOAD_PROCESS,
    bookId,
    chapterId,
    processPoint
  };
};

const addChapterToDb = async (bookData, chapterArray) => {
  const realm = await openConnection();
  const books = realm.objects("Book");
  const bookFilter = books.filtered(`id = "${bookData.id}"`).snapshot();
  const bookExist = bookFilter.length > 0;
  if (bookExist) {
    const chapters = realm.objects("Chapter");

    chapterArray.forEach(chapterData => {
      if (chapters.length > 0) {
        const chapterFilter = chapters
          .filtered(
            `id = "${chapterData.id}" AND bookId = "${chapterData.bookId}"`
          )
          .snapshot();

        const chapterExist = chapterFilter.length > 0;
        if (!chapterExist) {
          realm.write(() => {
            bookFilter[0].chapters.push({
              ...chapterData,
              read: 0,
              isDownloaded: false
            });
          });
        }
      } else {
        realm.write(() => {
          bookFilter[0].chapters.push({
            ...chapterData,
            read: 0,
            isDownloaded: false
          });
        });
      }
    });
  }
  // else {
  //   const chaptersWrite = chapterArray.map((item, index) => {
  //     return { ...item, read: 0, isDownloaded: false };
  //   });
  //   realm.write(() => {
  //     realm.create("Book", {
  //       ...bookData,
  //       read: 0,
  //       isDownloaded: false,
  //       chapters: chaptersWrite
  //     });
  //   });
  // }
};

const fetchDetailData = (bookData, requestPage) => {
  const { id: bookId, authorName, avatar: bookCover, title } = bookData;
  return async dispatch => {
    dispatch(requestDetailData(bookId));
    const itemPerPage = 50;
    api
      .getBookDetail(bookId, requestPage, itemPerPage)
      .then(async response => {
        const { content } = response.body;
        const chapterData = await Promise.all(
          content.map(async item => {
            const { name: chapterName, id: chapterId } = item;
            const chapterPath = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}/${chapterId}.mp3`;
            const fileExist = await RNFS.exists(chapterPath);
            const artwork = bookCover;
            if (fileExist) {
              return {
                ...item,
                isDownloaded: true,
                bookId,
                title: chapterName,
                album: title,
                artist: authorName,
                artwork,
                url: `file://${chapterPath}`
              };
            } else {
              return {
                ...item,
                isDownloaded: false,
                bookId,
                title: chapterName,
                album: title,
                artist: authorName,
                artwork
              };
            }
          })
        );
        await addChapterToDb(bookData, chapterData);
        const nextPage = content.length < itemPerPage ? null : requestPage + 1;
        dispatch(receiveDetailData(bookId, chapterData, nextPage));
      })
      .catch(error => dispatch(fetchDetailError(bookId, error)));
  };
};

const shouldFetchDetailData = state => {
  if (state) {
    if (state.items.length == 0) {
      return !state.isFetching;
    } else {
      return state.items.length == 0;
    }
  } else {
    return true;
  }
};

export const fetchDetailDataIfNeed = bookData => {
  return (dispatch, getState) => {
    const { id: bookId } = bookData;
    const state = getState().detail[bookId];
    const nextPage = state ? state.nextPage : 0;
    if (shouldFetchDetailData(state)) {
      return dispatch(fetchDetailData(bookData, nextPage));
    }
  };
};
