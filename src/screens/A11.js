import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity
} from "react-native";
import styles from "./styles/A11Style";
import headerStyle from "../components/styles/A03HeaderStyle";
import IconSetting from "react-native-vector-icons/FontAwesome";
import { DrawerActions } from "react-navigation";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import openConnection from "../logic/realm";
import { ProgressBar } from "../components/Modals/DownloadModal";
import Icon from "react-native-vector-icons/FontAwesome";
import RNFS from "react-native-fs";
import constants from "../logic/constants";

class A11 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeModal = () => {
    this.props.hideModal();
  };

  renderItem = data => {
    const { name, id } = data;
    const {
      progress,
      chapterId,
      downloadDoneState,
      downloadError
    } = this.props;

    return (
      <View style={styles.itemWrap}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.contentWrap}>
            <Text style={styles.notiHeader}>{name}</Text>
          </View>
          <View style={styles.progressWrap}>
            {chapterId && id < chapterId && !downloadDoneState && (
              <Text style={styles.downloadText}>Đã tải</Text>
            )}
            {chapterId && id == chapterId && !downloadError && (
              <ProgressBar downloadProcess={progress} />
            )}
            {chapterId && id == chapterId && downloadError && (
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={this.retryDownload}
              >
                <Icon name={"undo"} size={25} color={"black"} />
              </TouchableOpacity>
            )}
            {chapterId && id > chapterId && !downloadDoneState && (
              <Text style={[styles.downloadText, { fontStyle: "italic" }]}>
                Đang chờ...
              </Text>
            )}
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  };

  retryDownload = () => {
    this.props.retryDownload();
  };

  openDrawer = () => {
    // this.props.hidePlayer();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  cancelCurrentDownload = async () => {
    const { jobId, bookData, isDownloading, currentReadBookId } = this.props;
    if (bookData.id !== currentReadBookId) {
      if (jobId && isDownloading) {
        await RNFS.stopDownload(jobId);
      }
      bookData && (await this.removeBook(bookData.id));
      this.props.downloadDone();
      this.closeModal();
    } else {
      this.props.showModal(
        {
          open: true,
          message: "Cannot delete book",
          closeModal: this.closeModal
        },
        "alert"
      );
    }
  };

  removeBook = async bookId => {
    try {
      var path = `${RNFS.TemporaryDirectoryPath}.Books/${bookId}`;
      await RNFS.unlink(path);
      const realm = await openConnection();
      const books = realm.objects("Book");
      let bookFilter = books.filtered(`id = "${bookId}"`);
      let chapters = realm.objects("Chapter");
      const chaptersRemove = chapters
        .filtered(`bookId = "${bookId}"`)
        .snapshot();
      realm.write(() => {
        bookFilter[0].isDownloaded = false;
        chaptersRemove.map(item => {
          item.isDownloaded = false;
        });
      });
    } catch (err) {
      this.props.showModal(
        {
          open: true,
          message: constants.SOME_ERROR_HAPPEN,
          closeModal: this.closeModal
        },
        "alert"
      );
      console.log("remove book error: ", err.message);
    }
  };

  cancelDownload = () => {
    this.props.showModal(
      {
        open: true,
        message: "Do you want to cancel?",
        confirmModal: () => this.cancelCurrentDownload(),
        confirmTitle: "Continue",
        cancelTitle: "No",
        closeModal: this.closeModal
      },
      "confirm"
    );
  };

  render() {
    const {
      chapters,
      bookData,
      progress,
      chapterId,
      downloadDone,
      downloadError,
      isDrawerOpen,
      isBottomSheetOpen
    } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isDrawerOpen || isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <View style={headerStyle.header}>
          <View style={headerStyle.titleWrap}>
            <Text
              style={headerStyle.title}
              ellipsizeMode={"tail"}
              numberOfLines={1}
            >
              {bookData && bookData.title}
            </Text>
          </View>
          <TouchableOpacity onPress={this.openDrawer} style={headerStyle.btn}>
            <IconSetting name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={this.cancelDownload}
            style={headerStyle.btn}
          >
            <Text style={styles.cancel}>Huỷ</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={chapters}
          refreshing={false}
          extraData={{ progress, chapterId, downloadDone, downloadError }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { download, playback, drawer, bottomSheet } = state;
  const {
    bookData,
    chapters,
    jobId,
    contentLength,
    progress,
    chapterId,
    downloadDone: downloadDoneState,
    isDownloading,
    error: downloadError
  } = download;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  const { bookId: currentReadBookId } = playback;
  const { isOpen: isDrawerOpen } = drawer;
  return {
    bookData,
    chapters,
    jobId,
    contentLength,
    progress,
    chapterId,
    downloadDoneState,
    downloadError,
    isDownloading,
    currentReadBookId,
    isDrawerOpen,
    isBottomSheetOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    retryDownload: () => dispatch(actions.retryDownload()),
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    downloadDone: () => dispatch(actions.downloadDone())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(A11);
