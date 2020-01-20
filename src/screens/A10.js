import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import headerStyle from "../components/styles/A10HeaderStyle";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import _ from "lodash";
import A10Item from "../components/A10/Item";
import A10Header from "../components/A10/Header";
import A10Footer from "../components/A10/Footer";
import TrackPlayer from "react-native-track-player";
import RNFS from "react-native-fs";
import * as constants from "../logic/constants";
import openConnection from "../logic/realm";
import * as Utils from "../logic/utils";

import schema from "../logic/realm";
import Realm from "realm";

class A10 extends Component {
  static navigationOptions = ({ navigation }) => {
    const bookData = navigation.getParam("bookData");
    const { title } = bookData;
    return {
      headerTitle: (
        <View style={headerStyle.headerWrap}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={headerStyle.btn}
          >
            <Icon
              style={headerStyle.icon}
              name="angle-left"
              size={25}
              color="black"
            />
            <Text style={headerStyle.search}>Quay lại</Text>
          </TouchableOpacity>
          <View style={{ paddingHorizontal: 100 }}>
            <Text
              style={headerStyle.title}
              ellipsizeMode={"tail"}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </View>
      ),
      headerRight: null,
      headerLeft: null,
      headerStyle: {
        borderBottomColor: "#A9A9A9",
        shadowOpacity: 0,
        shadowOffset: {
          height: 0
        },
        shadowRadius: 0,
        borderBottomWidth: 1
      }
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      playing: null,
      downloadJobId: null,
      downloading: false,
      modifiedBook: null,
      chapterFinish: 0
    };
  }

  componentDidMount() {
    const bookData = this.props.navigation.getParam("bookData");
    const chapterRead = this.props.navigation.getParam("chapterRead");
    const readSecond = this.props.navigation.getParam("readSecond");

    this.props.getBookDetail(bookData);

    const { bookChapter, isFetching } = this.props;
    if (chapterRead && !isFetching && bookChapter.length > 0) {
      this.playFromNavigate({
        chapterId: chapterRead,
        readSecond,
        bookId: bookData.id
      });
    }
    const realm = new Realm(schema);
    this.bookListen = realm.objects("Book").filtered(`id = "${bookData.id}"`);
    this.setState({ modifiedBook: this.bookListen[0] });
    this.bookListen.addListener(this.listener);
  }

  componentDidUpdate(prevProps) {
    const chapterRead = this.props.navigation.getParam("chapterRead");
    const readSecond = this.props.navigation.getParam("readSecond");
    const bookData = this.props.navigation.getParam("bookData");
    const { bookChapter, isFetching, isDownloading, stopDownload } = this.props;

    if (
      chapterRead &&
      !isFetching &&
      prevProps.isFetching &&
      bookChapter.length > 0
    ) {
      this.playFromNavigate({
        chapterId: chapterRead,
        readSecond,
        bookId: bookData.id
      });
    }
    if (isDownloading && !prevProps.isDownloading) {
      this.props.showModal(
        {
          open: true,
          stopDownload,
          closeModal: this.closeModal
        },
        "download"
      );
    } else if (!isDownloading && prevProps.isDownloading) {
      this.closeModal();
    }
  }

  componentWillUnmount() {
    this.bookListen.removeAllListeners();
  }

  listener = (books, changes) => {
    // Update UI in response to modified objects
    changes.modifications.forEach(index => {
      let modifiedBook = books[index];
      this.setState({ modifiedBook });
    });
  };

  closeModal = () => {
    this.props.hideModal();
  };

  playFromNavigate = async data => {
    const { chapterId, readSecond, bookId } = data;
    const chapterPathExist = await RNFS.exists(
      `${RNFS.TemporaryDirectoryPath}.Books/${bookId}/${chapterId}.mp3`
    );
    if (chapterPathExist) {
      this.playTrack({ id: chapterId, bookId, second: readSecond });
    } else {
      this.props.showModal(
        {
          open: true,
          message: "Not download yet",
          closeModal: this.closeModal
        },
        "alert"
      );
    }
  };

  playTrack = async data => {
    try {
      const { id: chapterId, bookId, second } = data;
      const playtime = second || 0;
      const { bookChapter, playingBookId, connecting, connectionType } = this.props;
      const bookData = this.props.navigation.getParam("bookData");

      const bookChapterData = connecting
        ? bookChapter
        : bookData.chapters;  
      const hasCurrentPlayInThisBook = playingBookId == bookId;
      const trackId = `${chapterId}`;
      const trackPlay = bookChapterData.map(item => {
        return { ...item, url: item.url || item.audioUrl };
      });
      await Utils.updateReadTime(Number(bookId), Number(chapterId), 0);
      console.warn("trackPlay: ", trackPlay);
      if (!hasCurrentPlayInThisBook) {
        await TrackPlayer.reset();
        await TrackPlayer.add([...trackPlay]);
      }
      await TrackPlayer.pause();
      await TrackPlayer.play();
      await TrackPlayer.skip(trackId);
      await TrackPlayer.seekTo(playtime);
    } catch (e) {
      console.warn("error: ", e);
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
          bookExist[0].chapters.push(chapterWriteData);
        }
      } else {
        realm.write(() => {
          realm.create("Book", {
            ...bookData,
            isDownloaded: true,
            read: 0,
            chapters: [chapterWriteData]
          });
        });
      }
    });
  }

  downloadBegin = (data, chapterId) => {
    const { jobId, contentLength } = data;
    this.props.startDownload(jobId, chapterId, contentLength);
  };

  onDownloadProgress = (bookId, chapterId, data) => {
    const { contentLength, bytesWritten } = data;
    const { progress: currentProgress } = this.props;
    const progressPoint =
      Math.round((bytesWritten / contentLength) * 100 * 10) / 10;
    currentProgress != progressPoint && this.props.downloading(progressPoint);
  };

  downloadBook = async chapterData => {
    const { connecting } = this.props;
    if (connecting) {
      const bookData = this.props.navigation.getParam("bookData");
      const { id: bookId } = bookData;
      const { id: chapterId, audioUrl } = chapterData;
      try {
        this.props.showModal({ open: true }, "loading");
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
        this.props.showModal({ open: false }, "loading");
        let dirs = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}`;
        const chapterResult = await RNFS.downloadFile({
          fromUrl: audioUrl, // URL to download file from
          toFile: dirs + `/${chapterId}.mp3`,
          progressInterval: 1000,
          begin: res => this.downloadBegin(res, chapterId),
          progress: res => this.onDownloadProgress(bookId, chapterId, res)
        }).promise;

        __DEV__ && console.log("download response: ", chapterResult);
        if (chapterResult.statusCode == 200) {
          if (this.props.contentLength == chapterResult.bytesWritten) {
            // Download successful
            this.props.downloadSuccess(bookId, chapterId);
            await this.addDownloadChapterToDb(bookData, chapterData);
            this.props.getLibrary();
          } else {
            console.log("stop");
            var path = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}/${chapterId}.mp3`;

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
        }
        // this.props.endDownload();
      } catch (e) {
        __DEV__ && console.log("download error 2: ", e);
        // this.props.endDownload();
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

  render() {
    const {
      bookChapter,
      error,
      isFetching,
      connecting,
      isPlaying,
      playingChapterId,
      playingBookId,
      bookTime,
      isBottomSheetOpen
    } = this.props;
    const bookData = this.props.navigation.getParam("bookData");
    const { modifiedBook } = this.state;
    const chapterData = modifiedBook
      ? modifiedBook.chapters
      : bookData.chapters;
    const { id: bookId } = bookData;
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        importantForAccessibility={
          isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <FlatList
          data={chapterData}
          refreshing={false}
          extraData={chapterData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <A10Item
              chapterData={item}
              bookId={bookId}
              index={index}
              playingChapterId={playingChapterId}
              isPlaying={isPlaying}
              bookTime={bookTime}
              downloadBook={this.downloadBook}
              playTrack={() => this.playTrack(item)}
              updateChapterTime={this.props.updateChapterTime}
            />
          )}
          ListHeaderComponent={
            <A10Header
              bookData={modifiedBook || bookData}
              chapterData={chapterData}
              isPlaying={isPlaying}
              playingBookId={playingBookId}
              bookTime={bookTime}
            />
          }
          ListFooterComponent={
            <A10Footer
              data={chapterData}
              isFetching={isFetching}
              error={error}
              connecting={connecting}
            />
          }
        />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state, props) => {
  const { id: bookId } = props.navigation.getParam("bookData");
  const { playback, detail, netInfo, download, time, bottomSheet } = state;
  const {
    state: playbackState,
    currentTrack: playingChapterId,
    bookId: playingBookId
  } = playback;
  const { isDownloading, jobId, contentLength, progress } = download;
  const isPlaying = playbackState == "playing" || playbackState == 3;
  const bookChapter = detail[bookId] ? detail[bookId].items : [];
  const error = detail[bookId] ? detail[bookId].error : null;
  const isFetching = detail[bookId] ? detail[bookId].isFetching : false;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const bookTime = time[bookId];
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isPlaying,
    bookChapter,
    error,
    isFetching,
    playingChapterId,
    playingBookId,
    connecting,
    jobId,
    isDownloading,
    contentLength,
    progress,
    bookTime,
    isBottomSheetOpen,
    connectionType
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    getBookDetail: bookData =>
      dispatch(actions.fetchDetailDataIfNeed(bookData)),
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
    updateChapterTime: (bookId, chapterId, time) =>
      dispatch(actions.updateChapterTime(bookId, chapterId, time))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(A10);
