import React, { Component } from "react";
import { Dimensions, View, Platform, StatusBar } from "react-native";
import { connect } from "react-redux";
// import BottomPlayer from "../BottomPlayer";
import BottomSheet from "reanimated-bottom-sheet";
import { getSnapPoints } from "../../logic/utils";
import Animated from "react-native-reanimated";
import PlayerComponent from "./PlayerComponent";
import PlayerBar from "./PlayerBar";
import BottomSheetContent from "./BottomSheetContent";
import SongCover from "./SongCover";
import HeaderDropDown from "./HeaderDropDown";
import HeaderContent from "./HeaderContent";
import Util, { isIphoneX } from "../../logic/utils";
import ExtraDimensions from "react-native-extra-dimensions-android";
import * as constants from "../../logic/constants";
import * as actions from "../../logic/actions";
import * as api from "../../logic/api";
import TrackPlayer from "react-native-track-player";

const { height } = Dimensions.get("window");
// const androidRealHeight = ExtraDimensions.getRealWindowHeight()
const androidStatusBarHeight = ExtraDimensions.getStatusBarHeight();
const androidMenuBarHeight = ExtraDimensions.getSoftMenuBarHeight();
console.log({ androidStatusBarHeight, androidMenuBarHeight });

const androidBottomBarHeight = height - StatusBar.currentHeight;
const snapPointHeight =
  Platform.OS == "android" ? androidBottomBarHeight : height;
const snapPoints = getSnapPoints([0, snapPointHeight], 123);
const data = {
  album: "Jazz & Blues",
  artwork: "http://storage.googleapis.com/automotive-media/album_art.jpg",
  totalDuration: 471,
  playedDuration: 66,
  id: "Jazz_In_Paris.mp3",
  title: "Jazz in Paris",
  url: "http://storage.googleapis.com/automotive-media/Jazz_In_Paris.mp3"
};

class BottomSheetComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0.3,
      bookmark: [],
      showBookmark: false
    };
    this.fall = new Animated.Value(1);
  }

  componentDidMount() {
    const {
      currentChapterId,
      currentBookId,
      connecting,
      getBookmarkData
    } = this.props;
    if (connecting && currentChapterId !== null && currentBookId !== null) {
      getBookmarkData(currentBookId, currentChapterId);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      errorGet,
      errorPost,
      isGetFetching,
      loading,
      currentChapterId,
      currentBookId,
      connecting,
      getBookmarkData,
      playBackState
    } = this.props;

    if (
      (currentBookId !== null &&
        currentChapterId !== null &&
        prevProps.currentBookId !== currentBookId &&
        connecting) ||
      (currentBookId !== null &&
        currentChapterId !== null &&
        prevProps.currentChapterId !== currentChapterId &&
        connecting)
    ) {
      getBookmarkData(currentBookId, currentChapterId);
    }

    if (
      connecting &&
      // prevProps.currentBookId !== null &&
      // prevProps.currentChapterId !== null &&
      prevProps.currentBookId == currentBookId &&
      prevProps.currentChapterId !== currentChapterId
    ) {
      console.log("================update history 1====================");
      this.updateHistory(currentBookId, currentChapterId);
    }

    if (
      connecting &&
      // prevProps.currentBookId !== null &&
      // prevProps.currentChapterId !== null &&
      prevProps.currentBookId !== currentBookId
    ) {
      console.log("================update history 2====================");
      this.updateHistory(currentBookId, currentChapterId);
    }

    if (prevProps.errorGet !== errorGet) {
      this.props.showModal(
        {
          open: true,
          message: errorGet.errorMessage || constants.SOME_ERROR_HAPPEN,
          closeModal: this.closeModal
        },
        "alert"
      );
    }
    if (prevProps.errorPost !== errorPost) {
      this.props.showModal(
        {
          open: true,
          message: errorPost.errorMessage || constants.SOME_ERROR_HAPPEN,
          closeModal: this.closeModal
        },
        "alert"
      );
    }
    if (prevProps.isGetFetching != isGetFetching) {
      this.props.showModal(
        {
          open: isGetFetching
        },
        "loading"
      );
    }
    if (prevProps.loading != loading) {
      this.props.showModal(
        {
          open: loading
        },
        "loading"
      );
    }
  }

  updateHistory = async (bookId, chapterId) => {
    try {
      await api.addHistory(bookId, chapterId);
      __DEV__ && console.log("Update history success");
      this.props.fetchHistory(true);
    } catch (e) {
      this.props.showModal(
        {
          open: true,
          message: e.errorMessage || constants.SOME_ERROR_HAPPEN,
          closeModal: this.closeModal
        },
        "alert"
      );
    }
  };

  closeModal = () => {
    this.props.hideModal();
  };

  onHeaderPress = () => {
    this.setState({
      showBookmark: false
    });
    this.bottomSheetRef.snapTo(0);
  };

  extendPlayer = () => {
    this.bottomSheetRef.snapTo(1);
  };

  switchViewBookmark = () => {
    this.setState({
      showBookmark: !this.state.showBookmark
    });
  };

  removeBookmark = bookmarkId => {
    const { currentBookId, currentChapterId, deleteBookmark } = this.props;
    deleteBookmark(currentBookId, currentChapterId, bookmarkId);
  };

  editBookmark = (bookmarkId, content) => {
    const { currentBookId, currentChapterId, editBookmark } = this.props;
    editBookmark(currentBookId, currentChapterId, bookmarkId, content);
  };

  seekToBookmark = async second => {
    await TrackPlayer.seekTo(second);
    await TrackPlayer.pause();
    await TrackPlayer.play();
  };

  closeSheet = () => {
    this.setState({
      showBookmark: false
    });
  };

  renderContent = () => {
    const {
      trackData,
      bookmark,
      isGetFetching,
      errorGet,
      connecting
    } = this.props;
    const { showBookmark } = this.state;
    const showCover = !showBookmark;
    const bottomHeight =
      Platform.OS == "android"
        ? androidBottomBarHeight
        : isIphoneX()
        ? height - 44
        : height;
    return (
      <View
        style={{
          height: bottomHeight,
          borderTopColor: "#A9A9A9",
          borderTopWidth: 1
        }}
      >
        <HeaderDropDown fall={this.fall} onPress={this.onHeaderPress} />
        <HeaderContent
          trackData={trackData}
          fall={this.fall}
          data={data}
          showBookmark={showBookmark}
          trackBookmark={bookmark}
          extendPlayer={this.extendPlayer}
          removeBookmark={this.removeBookmark}
          editBookmark={this.editBookmark}
          isGetFetching={isGetFetching}
          errorGet={errorGet}
          connecting={connecting}
          seekToBookmark={this.seekToBookmark}
        />
        <PlayerBar fall={this.fall} trackBookmark={bookmark} />
        {showCover && <SongCover fall={this.fall} trackData={trackData} />}
        <PlayerComponent fall={this.fall} />
        <BottomSheetContent
          fall={this.fall}
          switchViewBookmark={this.switchViewBookmark}
          showBookmark={showBookmark}
        />
      </View>
    );
  };

  render() {
    return (
      <BottomSheet
        ref={ref => (this.bottomSheetRef = ref)}
        initialSnap={0}
        callbackNode={this.fall}
        snapPoints={snapPoints}
        renderContent={() => this.renderContent()}
        renderHeader={() => null}
        enabledContentGestureInteraction={true}
        onOpenEnd={() => this.props.updateBottomSheetState(true)}
        onCloseEnd={() => this.props.updateBottomSheetState(false)}
        onCloseStart={this.closeSheet}
      />
    );
  }
}

function mapStateToProps(state) {
  const { bookmarkDetail, playback, netInfo } = state;
  const {
    currentTrack,
    bookId: currentBookId,
    state: playBackState
  } = playback;
  const currentChapterId = Number(currentTrack);
  const {
    errorGet,
    errorPost,
    isGetFetching,
    loading,
    items: bookmark
  } = bookmarkDetail;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  return {
    errorGet,
    errorPost,
    isGetFetching,
    loading,
    bookmark,
    currentChapterId,
    currentBookId,
    connecting,
    playBackState
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    getBookmarkData: (bookId, chapterId) =>
      dispatch(actions.getBookmarkData(bookId, chapterId)),
    deleteBookmark: (bookId, chapterId, bookmarkId) =>
      dispatch(actions.deleteBookmarkData(bookId, chapterId, bookmarkId)),
    editBookmark: (bookId, chapterId, bookmarkId, content) =>
      dispatch(
        actions.editBookmarkData(bookId, chapterId, bookmarkId, content)
      ),
    updateBottomSheetState: state =>
      dispatch(actions.updateBottomSheetState(state)),
    fetchHistory: refresh => dispatch(actions.fetchHistoryDataIfNeed(refresh))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BottomSheetComponent);
