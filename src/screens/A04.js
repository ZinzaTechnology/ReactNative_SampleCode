import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import styles from "./styles/A04Style";
import headerStyle from "../components/styles/A04HeaderStyle";
import Icon from "react-native-vector-icons/EvilIcons";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import * as constants from "../logic/constants";
import openConnection from "../logic/realm";
import LinearGradient from "react-native-linear-gradient";
import * as api from "../logic/api";
import RNFS from "react-native-fs";
import _ from "lodash";

const WAIT_INTERVAL = 750;
const ENTER_KEY = 13;
const MAX_DOWNLOAD = 3;

class A04 extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    const isBottomSheetOpen = params ? params.isBottomSheetOpen : false;
    return {
      headerTitle: (
        <Text
          style={headerStyle.title}
          importantForAccessibility={isBottomSheetOpen ? "no" : "auto"}
        >
          Tìm kiếm sách
        </Text>
      ),
      headerRight: (
        <View
          importantForAccessibility={
            isBottomSheetOpen ? "no-hide-descendants" : "auto"
          }
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Filter")}
            style={headerStyle.btn}
          >
            <Text style={headerStyle.search}>Bộ lọc</Text>
          </TouchableOpacity>
        </View>
      ),
      headerLeft: (
        <View
          importantForAccessibility={
            isBottomSheetOpen ? "no-hide-descendants" : "auto"
          }
        >
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Quay lại thư viện"
            onPress={() => navigation.navigate("A03")}
            style={headerStyle.btn}
          >
            <Icon name="close-o" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
        borderBottomWidth: 0,
        shadowOpacity: 0,
        shadowOffset: {
          height: 0
        },
        shadowRadius: 0,
        elevation: 0
      }
    };
  };

  componentWillMount() {
    this.timer = null;
    const { setParams } = this.props.navigation;
    setParams({ isBottomSheetOpen: this.props.isBottomSheetOpen });
  }

  componentDidMount() {
    this.props.fetchSearch(true);
  }

  componentDidUpdate(prevProps) {
    const {
      authorFilter,
      categoryFilter,
      speakerFilter,
      sponsorFilter,
      isBottomSheetOpen
    } = this.props;
    if (
      prevProps.authorFilter !== authorFilter ||
      prevProps.categoryFilter !== categoryFilter ||
      prevProps.speakerFilter !== speakerFilter ||
      prevProps.sponsorFilter !== sponsorFilter
    ) {
      this.props.fetchSearch(true);
    }
    if (prevProps.isBottomSheetOpen != isBottomSheetOpen) {
      const { setParams } = this.props.navigation;
      setParams({ isBottomSheetOpen });
    }
  }

  componentWillUnmount() {
    this.props.changeSearchText("");
    this.props.deactiveFilterAuthor();
    this.props.deactiveFilterCategory();
    this.props.deactiveFilterSpeaker();
    this.props.deactiveFilterSponsor();
  }

  navToDetail = async data => {
    await this.addBookToDb(data);
    this.props.navigation.navigate("A10", { bookData: data });
  };

  addBookToDb = async bookData => {
    const realm = await openConnection();
    const books = realm.objects("Book");
    const bookFilter = books.filtered(`id = "${bookData.id}"`);
    const bookExist = bookFilter.length > 0;
    if (!bookExist) {
      realm.write(() => {
        realm.create("Book", {
          ...bookData,
          read: 0,
          isDownloaded: false
        });
      });
    }
  };

  closeModal = () => {
    this.props.hideModal();
  };

  startDownloadNewBook = async bookData => {
    const { id } = bookData;
    try {
      this.props.showModal({ open: true }, "loading");
      const bookDetail = await api.getBookDetail(id, 0, 999);
      const chapterData = bookDetail.body.content;
      this.closeModal();
      console.log("log data: ", { bookData, bookDetail, chapterData });
      this.props.updateChapterDownload(bookData, chapterData);
    } catch (e) {
      console.log("error: ", e);
      this.props.showModal(
        {
          open: true,
          message: constants.SOME_ERROR_HAPPEN,
          closeModal: this.closeModal
        },
        "alert"
      );
    }
  };

  confirmDownloadNewBook = async bookData => {
    const { currentReadBookId, downloadingBookData } = this.props;
    if (currentReadBookId !== downloadingBookData.id) {
      await this.cancelCurrentDownload();
      await this.startDownloadNewBook(bookData);
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

  cancelCurrentDownload = async () => {
    const { jobId, downloadingBookData, isDownloading } = this.props;
    if (jobId && isDownloading) {
      await RNFS.stopDownload(jobId);
    }
    downloadingBookData && (await this.removeBook(downloadingBookData.id));
    this.props.endDownload();
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
        bookFilter[0].downloadAt = null;
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

  confirmRemoveOldBook = async bookData => {
    const { downloadedBooks, currentReadBookId } = this.props;
    const sortBook = _.sortBy(downloadedBooks, [
      function(o) {
        return o.downloadAt;
      }
    ]);
    const removeBookId = sortBook[0].id;
    if (removeBookId !== currentReadBookId) {
      await this.removeBook(removeBookId);
      await this.startDownloadNewBook(bookData);
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

  downloadBook = async bookData => {
    const { connecting, chapters, downloadedBooks } = this.props;
    if (connecting) {
      if (chapters.length > 0) {
        this.props.showModal(
          {
            open: true,
            message:
              "Downloading",
            confirmModal: () => this.confirmDownloadNewBook(bookData),
            confirmTitle: "Continue",
            cancelTitle: "No",
            closeModal: this.closeModal
          },
          "confirm"
        );
      } else if (downloadedBooks.length == MAX_DOWNLOAD) {
        const sortBook = _.sortBy(downloadedBooks, [
          function(o) {
            return o.downloadAt;
          }
        ]);
        const removeBookName = sortBook[0].title;
        this.props.showModal(
          {
            open: true,
            message: `Downloading`,
            confirmModal: () => this.confirmRemoveOldBook(bookData),
            confirmTitle: "Continue",
            cancelTitle: "No",
            closeModal: this.closeModal
          },
          "confirm"
        );
      } else {
        this.startDownloadNewBook(bookData);
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

  renderDownloadBtn(isDownloaded, isDownloading, data) {
    if (isDownloaded) {
      return <Text style={styles.downloadedText}>Đã tải</Text>;
    } else if (isDownloading) {
      return <Text style={styles.downloadingText}>Đang tải...</Text>;
    } else {
      return (
        <TouchableOpacity
          style={styles.btnDownload}
          onPress={() => this.downloadBook(data)}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#EF7225", "#fcc9a9"]}
            style={styles.linearGradient}
          >
            <Text style={styles.downloadText}>Tải xuống</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  }

  renderItem(data) {
    const { title, authorName, duration, description, id } = data;
    const { downloadingBookData, bookIdDownloaded } = this.props;
    const isDownloaded = bookIdDownloaded.includes(id);
    const isDownloading = downloadingBookData
      ? downloadingBookData.id == id
      : false;
    return (
      <View style={styles.itemWrap}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.navToDetail(data)}
          >
            <Text style={styles.bookName}>{title}</Text>
            <Text style={styles.author}>Tác giả: {authorName}</Text>
            <Text style={styles.length}>Độ dài: {duration}</Text>
            <Text style={styles.desciption}>{description}</Text>
          </TouchableOpacity>
          <View style={styles.downloadWrap}>
            {this.renderDownloadBtn(isDownloaded, isDownloading, data)}
          </View>
        </View>
        <View style={styles.separator} />
      </View>
    );
  }

  openDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  onRefresh = () => {
    this.props.fetchSearch(true);
  };

  handleLoadMore(isFetching) {
    if (!isFetching) {
      this.props.fetchSearch(false);
    }
  }

  renderFooter = (data, isFetching, error) => {
    if (!this.props.connecting) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.emptyText}>{constants.CONNECTION_FAIL}</Text>
        </View>
      );
    } else if (isFetching) {
      return (
        <ActivityIndicator
          size={"large"}
          style={{ color: "#000", marginVertical: 10 }}
        />
      );
    } else if (error) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.emptyText}>Có lỗi xảy ra</Text>
        </View>
      );
    } else if (!isFetching && data.length === 0) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.emptyText}>Không tìm được kết quả</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  onChangeText = text => {
    clearTimeout(this.timer);
    this.props.changeSearchText(text);
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  };

  handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange();
    }
  };

  triggerChange = () => {
    this.props.fetchSearch(true);
  };

  render() {
    const {
      searchData,
      isFetching,
      error,
      textSearch,
      isBottomSheetOpen
    } = this.props;
    return (
      <SafeAreaView
        style={styles.container}
        importantForAccessibility={
          isBottomSheetOpen ? "no-hide-descendants" : "auto"
        }
      >
        <View style={headerStyle.inputWrap}>
          <View style={headerStyle.iconSearch}>
            <Icon name="search" size={20} color="#828389" />
          </View>

          <TextInput
            style={headerStyle.input}
            onChangeText={this.onChangeText}
            value={textSearch}
            onKeyPress={this.handleKeyDown}
            placeholder={"Book name"}
            placeholderTextColor={"#828389"}
          />
        </View>
        <FlatList
          data={searchData}
          onRefresh={() => this.onRefresh()}
          refreshing={false}
          extraData={searchData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListHeaderComponent={
            <Text style={styles.textHeader}>Sách tìm kiếm</Text>
          }
          stickyHeaderIndices={[0]}
          ListFooterComponent={() =>
            this.renderFooter(searchData, isFetching, error)
          }
          onEndReachedThreshold={0.2}
          onEndReached={() => {
            return this.handleLoadMore(isFetching);
          }}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const {
    search,
    author,
    category,
    speaker,
    sponsor,
    netInfo,
    download,
    library,
    playback,
    bottomSheet
  } = state;
  const { items: searchData, isFetching, error, textSearch } = search;
  const { books: downloadedBooks } = library;
  const { activeFilter: authorFilter } = author;
  const {
    bookData: downloadingBookData,
    isDownloading,
    chapters,
    jobId
  } = download;

  const bookIdDownloaded = downloadedBooks.map(item => item.id);
  const { activeFilter: categoryFilter } = category;
  const { activeFilter: speakerFilter } = speaker;
  const { activeFilter: sponsorFilter } = sponsor;
  const { type: connectionType } = netInfo;
  const { bookId: currentReadBookId } = playback;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    connecting,
    textSearch,
    searchData,
    isFetching,
    error,
    authorFilter,
    categoryFilter,
    speakerFilter,
    sponsorFilter,
    isDownloading,
    chapters,
    jobId,
    bookIdDownloaded,
    downloadedBooks,
    downloadingBookData,
    currentReadBookId,
    isBottomSheetOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSearch: refresh => dispatch(actions.fetchSearchDataIfNeed(refresh)),
    changeSearchText: text => dispatch(actions.changeSearchText(text)),
    deactiveFilterAuthor: _ => dispatch(actions.deactiveFilterAuthor()),
    deactiveFilterCategory: _ => dispatch(actions.deactiveFilterCategory()),
    deactiveFilterSpeaker: _ => dispatch(actions.deactiveFilterSpeaker()),
    deactiveFilterSponsor: _ => dispatch(actions.deactiveFilterSponsor()),
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    updateChapterDownload: (bookData, chapters) =>
      dispatch(actions.updateChapterDownload(bookData, chapters)),
    endDownload: () => dispatch(actions.endDownload())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(A04);
