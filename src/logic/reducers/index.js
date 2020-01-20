import { combineReducers } from "redux";
import playbackReducer from "./playbackReducer";
import modalReducer from "./modalReducer";
import playerReducer from "./playerReducer";
import bookmarkReducer from "./bookmarkReducer";
import historyReducer from "./historyReducer";
import authorReducer from "./authorReducer";
import categoryReducer from "./categoryReducer";
import searchReducer from "./searchReducer";
import speakerReducer from "./speakerReducer";
import sponsorReducer from "./sponsorReducer";
import detailReducer from "./detailReducer";
import libraryReducer from "./libraryReducer";
import bookmarkDetailReducer from "./bookmarkDetailReducer";
import netInfoReducer from "./netInfoReducer";
import downloadReducer from "./downloadReducer";
import notificationReducer from "./notificationReducer";
import timeReducer from "./timeReducer";
import configReducer from "./configReducer";
import drawerReducer from "./drawerReducer";
import bottomSheetReducer from "./bottomSheetReducer"

const appReducer = combineReducers({
  playback: playbackReducer,
  player: playerReducer,
  modal: modalReducer,
  bookmark: bookmarkReducer,
  history: historyReducer,
  author: authorReducer,
  category: categoryReducer,
  search: searchReducer,
  speaker: speakerReducer,
  sponsor: sponsorReducer,
  detail: detailReducer,
  bookmarkDetail: bookmarkDetailReducer,
  netInfo: netInfoReducer,
  library: libraryReducer,
  download: downloadReducer,
  notification: notificationReducer,
  time: timeReducer,
  config: configReducer,
  drawer: drawerReducer,
  bottomSheet: bottomSheetReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "SIGN_OUT") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
