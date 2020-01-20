import React, { Component } from "react";
import { AppState, View, StatusBar } from "react-native";
import { Provider, connect } from "react-redux";
import TrackPlayer from "react-native-track-player"; // TODO remove temp code
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import reducers from "./logic/reducers";
import createEventHandler from "./logic/event-handler";
import RootNavigator from "./route";
import BottomSheet from "./components/BottomSheet/BottomSheet";
import RNSecureStorage from "rn-secure-storage";
import * as constants from "./logic/constants";
import NavigatorService from "./logic/services/navigator";
import { createLogger } from "redux-logger";
import ModalRoot from "./components/ModalRoot";
import { isIphoneX } from "./logic/utils";
import _ from "lodash";
import * as api from "./logic/api";
import * as actions from "./logic/actions";
import openConnection from "./logic/realm";
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import RNFS from "react-native-fs";
import DeviceInfo from "react-native-device-info";
import { NavigationActions } from "react-navigation";

class NavigationWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogedIn: false,
      currentTrack: null
    };
    openConnection().then(realm => {
      const realmPath = realm.path;
      console.log("local db path: ", realmPath);
    });
    console.log(`local storage: ${RNFS.TemporaryDirectoryPath}.Books/`);
  }

  async componentDidMount() {
    console.warn(DeviceInfo.getUniqueID())

    StatusBar.setBarStyle("dark-content");
    SplashScreen.hide();
    NetInfo.addEventListener(
      "connectionChange",
      this._handleConnectionInfoChange
    );

    AppState.addEventListener("change", this._handleStateChange);
    // TODO remove temp code
    await TrackPlayer.setupPlayer({});
    TrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SEEK_TO,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS
      ]
    });

    _handleConnectionInfoChange = connectionInfo => {
      this.props.netInfoChange(connectionInfo.type);
    };

    // check login
    RNSecureStorage.get(constants.AS_AUTHORIZATION)
      .then(userToken => {
        if (userToken == null) {
          this.setState({ isLogedIn: false });
        } else {
          this.setState({ isLogedIn: true });
        }
      })
      .catch(err => {
        __DEV__ && console.log("RNSecureStorage: ", { err });

        this.setState({ isLogedIn: false });
      });
  }

  _handleConnectionInfoChange = connectionInfo => {
    console.log({ connectionInfo });

    this.props.netInfoChange(connectionInfo.type);
  };

  componentDidUpdate = async prevProps => {
    const {
      currentTrack,
      bookId,
      chapters,
      retryState,
      currentDownloadChapterId
    } = this.props;
    if (currentTrack != prevProps.currentTrack || bookId != prevProps.bookId) {
      const currentPlayId = await TrackPlayer.getCurrentTrack();
      const queue = await TrackPlayer.getQueue();
      const currentTrackInfo = await _.find(queue, function(o) {
        return o.id == currentPlayId;
      });
      this.setState({
        currentTrack: currentTrackInfo
        // currentListBookmark
      });
    }

    if (chapters.length > 0 && prevProps.chapters.length == 0) {
      this.downloadBook(chapters);
    }

    if (!prevProps.retryState && retryState) {
      const chapterDownload = _.filter(chapters, function(o) {
        return o.id >= currentDownloadChapterId;
      });
      this.downloadBook(chapterDownload);
    }
  };

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleStateChange);
    NetInfo.removeEventListener(
      "connectionChange",
      this._handleConnectionInfoChange
    );
  }

  downloadBegin = (data, chapterId) => {
    const { jobId, contentLength } = data;
    this.props.startDownload(jobId, chapterId, contentLength);
  };

  onDownloadProgress = data => {
    if (this.retryId) {
      clearInterval(this.retryId);
    }
    const { contentLength, bytesWritten } = data;
    const { progress: currentProgress } = this.props;
    const progressPoint =
      Math.round((bytesWritten / contentLength) * 100 * 10) / 10;
    currentProgress != progressPoint && this.props.downloading(progressPoint);
  };

  addDownloadChapterToStack = async (bookData, chapterData) => {
    const { id: bookId, authorName, title } = bookData;
    const { playingBookId } = this.props;
    if (playingBookId == bookId) {
      const { id: chapterId, name: chapterName } = chapterData;
      const localPath = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}/${chapterId}`;
      const trackData = {
        id: chapterId,
        title: chapterName,
        album: title,
        artist: authorName,
        artwork: "",
        url: `file://${localPath}`
      };
      const chapterHigherId = _.find(queue, function(o) {
        return o.id > chapterId;
      });
      if (chapterHigherId) {
        TrackPlayer.add(trackData, chapterHigherId.id);
      } else {
        TrackPlayer.add(trackData);
      }
    }
  };

  downloadBook = async chapters => {
    console.log({ chapters });
    const { connecting, downloadingBookData: bookData } = this.props;
    if (connecting) {
      const { id: bookId } = bookData;
      const { id: chapterId, audioUrl } = chapters[0];
      try {
        const rootPathExist = await RNFS.exists(
          `${RNFS.TemporaryDirectoryPath}.Books`
        );
        const bookPathExist = await RNFS.exists(
          `${RNFS.TemporaryDirectoryPath}.Books/${bookId}`
        );
        if (!rootPathExist) {
          await RNFS.mkdir(`${RNFS.TemporaryDirectoryPath}.Books`);
        }
        if (!bookPathExist) {
          await RNFS.mkdir(`${RNFS.TemporaryDirectoryPath}.Books/${bookId}`);
        }
        let dirs = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}`;
        this.downloadJob = RNFS.downloadFile({
          fromUrl: audioUrl, // URL to download file from
          toFile: dirs + `/${chapterId}.mp3`,
          progressInterval: 1000,
          begin: res => this.downloadBegin(res, chapterId),
          progress: res => this.onDownloadProgress(res),
          resumable: () => {
            console.warn("===> DownloadResumable");
            this.retryId = setInterval(() => {
              RNFS.resumeDownload(this.downloadJob.jobId);
              console.warn("retry download");
            }, 2500);
          }
        });

        const chapterResult = await this.downloadJob.promise;

        __DEV__ && console.log("download response: ", chapterResult);
        if (chapterResult.statusCode == 200) {
          // __DEV__ && console.log("abcd: ", abcd);
          if (this.props.contentLength == chapterResult.bytesWritten) {
            // Download successful
            this.props.downloadSuccess(bookId, chapterId);
            await this.addDownloadChapterToDb(bookData, chapters[0]);
            this.props.getLibrary();
            if (chapters.length > 1) {
              const newChapters = _.drop(chapters);
              this.downloadBook(newChapters);
            } else {
              this.props.downloadDone();
            }
          } else {
            console.log("stop");
            var path = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}/${chapterId}.mp3`;
            this.props.downloadError("stop when download not done");
            this.props.showModal(
              {
                open: true,
                message: constants.SOME_ERROR_HAPPEN,
                closeModal: this.closeModal
              },
              "alert"
            );
            return (
              RNFS.unlink(path)
                .then(() => {
                  console.log("FILE DELETED");
                })
                // `unlink` will throw an error, if the item to unlink does not exist
                .catch(err => {
                  console.log(err.message);
                })
            );
          }
        } else {
          this.props.showModal(
            {
              open: true,
              message: constants.SOME_ERROR_HAPPEN,
              closeModal: this.closeModal
            },
            "alert"
          );
          __DEV__ && console.log("download error 1: ", chapterResult);
          this.props.downloadError(chapterResult);
        }
        // this.props.endDownload();
      } catch (e) {
        __DEV__ && console.log("download error 2: ", e);
        this.props.downloadError(e);
      }
    } else {
      this.props.showModal(
        {
          open: true,
          message: constants.CONNECTION_FAIL,
          closeModal: this.closeModal
        },
        "alert"
      );
    }
  };

  addDownloadChapterToDb(bookData, chapterData) {
    openConnection().then(realm => {
      const books = realm.objects("Book");
      let bookFilter = books.filtered(`id = "${bookData.id}"`).snapshot();
      const bookExist = bookFilter.length > 0;
      const localPath = `file://${RNFS.TemporaryDirectoryPath}.Books/${bookData.id}/${chapterData.id}.mp3`;
      const chapterWriteData = {
        ...chapterData,
        url: `${localPath}`,
        read: 0,
        isDownloaded: true
      };
      if (bookExist) {
        realm.write(() => {
          bookFilter[0].isDownloaded = true;
          if (!bookFilter[0].downloadAt) {
            bookFilter[0].downloadAt = new Date().getTime();
          }
        });
        let chapters = realm.objects("Chapter");
        const chapterFilter = chapters
          .filtered(
            `id = "${chapterData.id}" AND bookId = "${chapterData.bookId}"`
          )
          .snapshot();
        const chapterExist = chapterFilter.length > 0;
        if (chapterExist) {
          realm.write(() => {
            chapterFilter[0].isDownloaded = true;
          });
        } else {
          realm.write(() => {
            bookFilter[0].chapters.push(chapterWriteData);
          });
        }
      } else {
        realm.write(() => {
          realm.create("Book", {
            ...bookData,
            isDownloaded: true,
            read: 0,
            chapters: [chapterWriteData],
            downloadAt: new Date().getTime()
          });
        });
      }
    });
  }

  closeModal = () => {
    this.props.hideModal();
  };

  _handleStateChange = appState => {
    if (appState == "active") {
      // Updates the playback information when the app is back from background mode
      this.props.updatePlayback();
    }
  };

  render() {
    const { currentTrack, currentListBookmark } = this.state;
    const { playerShow } = this.props;
    const showPlayer = playerShow && currentTrack != null;
    const marginBottom = isIphoneX() ? 123 + 44 : 123;
    return (
      <View style={{ flex: 1 }}>
        <RootNavigator
          ref={navigatorRef => {
            NavigatorService.setContainer(navigatorRef);
          }}
        />
        <ModalRoot />

        {showPlayer && [
          <View
            style={{
              height: marginBottom,
              zIndex: -99,
              backgroundColor: "transparent"
            }}
            key={"maginBottom"}
          />,
          <BottomSheet
            key={"bottomSheet"}
            trackData={currentTrack}
            trackBookmark={currentListBookmark}
          />
        ]}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { player, playback, download, netInfo } = state;
  const { playerShow } = player;
  const { currentTrack, bookId } = playback;
  const {
    chapters,
    bookData: downloadingBookData,
    contentLength,
    progress,
    downloadDone: downloadDoneState,
    chapterId: currentDownloadChapterId,
    retry: retryState
  } = download;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  return {
    playerShow,
    currentTrack,
    bookId,
    chapters,
    downloadingBookData,
    contentLength,
    progress,
    connecting,
    downloadDoneState,
    retryState,
    currentDownloadChapterId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updatePlayback: () => dispatch(actions.updatePlayback()),
    netInfoChange: netInfoType => dispatch(actions.netInfoChange(netInfoType)),
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    downloadSuccess: (bookId, chapterId) =>
      dispatch(actions.downloadSuccess(bookId, chapterId)),
    getLibrary: () => dispatch(actions.getLibraryData()),
    downloadProgress: (chapterId, bookId, data) =>
      dispatch(actions.downloadProcess(chapterId, bookId, data)),
    startDownload: (jobId, chapterId, contentLength) =>
      dispatch(actions.startDownload(jobId, chapterId, contentLength)),
    downloading: progress => dispatch(actions.downloading(progress)),
    endDownload: () => dispatch(actions.endDownload()),
    stopDownload: () => dispatch(actions.stopDownload()),
    downloadError: error => dispatch(actions.downloadError(error)),
    downloadDone: () => dispatch(actions.downloadDone())
  };
}

export const AppRootRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationWrapper);

const loggerMiddleware = createLogger();
const configureStore = preloadedState => {
  return createStore(
    reducers,
    preloadedState,
    applyMiddleware(thunkMiddleware, loggerMiddleware)
  );
};
export const store = configureStore();

TrackPlayer.registerEventHandler(createEventHandler(store));

export default class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <AppRootRedux />
      </Provider>
    );
  }
}
