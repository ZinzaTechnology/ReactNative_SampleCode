import {
  FETCH_LIST_BOOKMARK_DATA,
  FETCH_LIST_BOOKMARK_ERROR,
  FETCH_LIST_BOOKMARK_SUCCESS,
  REFRESH_LIST_BOOKMARK_DATA,
  POST_BOOKMARK_SUCCESS,
  DELETE_BOOKMARK_SUCCESS
} from "../actions/actionsTypes";
import * as Utils from "../utils";
import _ from "lodash";

const initState = {
  isFetching: false,
  error: null,
  items: [],
  nextPage: 0
};

function getAddedChapterList(list, action) {
  const { bookId, chapterId, data } = action;
  const { chapterName, comment, duration, chapterIndex, id } = data;
  const isListHasCurrentChapter = _.isMatch(list, { chapterId });
  const durationTime = Utils.formatTime(duration);
  if (isListHasCurrentChapter) {
    const newList = list.map((item, index) => {
      if (item.chapterId !== chapterId) {
        return item;
      } else {
        //chapter add bookmark
        return {
          chapterId,
          chapterName,
          index: chapterIndex,
          detail: [
            ...item.detail,
            {
              id,
              chapterId,
              bookId,
              duration: durationTime,
              chapterName,
              comment
            }
          ]
        };
      }
    });
    return newList;
  } else {
    return [
      ...list,
      {
        chapterId,
        chapterName,
        index: chapterIndex,
        detail: [
          {
            id,
            chapterId,
            bookId,
            duration: durationTime,
            chapterName,
            comment
          }
        ]
      }
    ];
  }
}

function getAddedBookList(list, action) {
  const { bookId, chapterId, data } = action;
  const { chapterName, comment, duration, title, chapterIndex, id } = data;
  const isListHasCurrentBook = _.isMatch(list, { bookId });
  const durationTime = Utils.formatTime(duration);
  if (isListHasCurrentBook) {
    const newList = list.map((item, index) => {
      if (item.bookId !== bookId) {
        return item;
      } else {
        //book add bookmark
        return {
          bookId,
          title,
          lstBookmark: getAddedChapterList(item.lstBookmark, action)
        };
      }
    });
    return newList;
  } else {
    return [
      ...list,
      {
        bookId,
        title,
        lstBookmark: [
          {
            chapterId,
            chapterName,
            index: chapterIndex,
            detail: [
              {
                id,
                chapterId,
                bookId,
                duration: durationTime,
                chapterName,
                comment
              }
            ]
          }
        ]
      }
    ];
  }
}

function getDeleteBookList(list, action) {
  const { bookId, chapterId, bookmarkId } = action;
  if(list.length == 1){
    return list
  }else{
    const newList = list.map((item, index) => {
      if(item.bookId != bookId){

      }else{
        
      }
    })
    return newList
  }
}

function bookmarkReducer(state = initState, action) {
  const currentItems = state.items;
  switch (action.type) {
    case FETCH_LIST_BOOKMARK_DATA:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_LIST_BOOKMARK_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: [...currentItems, ...action.items],
        nextPage: action.nextPage,
        error: null
      };
    case REFRESH_LIST_BOOKMARK_DATA:
      return {
        ...state,
        isFetching: false,
        items: action.items,
        nextPage: action.nextPage,
        error: null
      };
    case FETCH_LIST_BOOKMARK_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    // case POST_BOOKMARK_SUCCESS:
    //   return {
    //     ...state,
    //     items: getAddedBookList(state.items, action)
    //   };
    // case DELETE_BOOKMARK_SUCCESS:
    //   return {
    //     ...state,
    //     items: getDeleteBookList(state.items, action)
    //   };
    default:
      return state;
  }
}

export default bookmarkReducer;
