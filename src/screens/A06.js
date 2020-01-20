import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import styles from "./styles/A06Style";
import IconSetting from "react-native-vector-icons/FontAwesome";
import { DrawerActions } from "react-navigation";
import headerStyle from "../components/styles/A03HeaderStyle";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import * as constants from "../logic/constants";
import * as Utils from "../logic/utils";
import * as api from "../logic/api";

class A06 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchBookmark(true);
  }

  closeModal = () => {
    this.props.hideModal();
  };

  navToDetail = async data => {
    const { duration, chapterId: chapterRead, bookId } = data;
    const { connecting } = this.props;
    if (connecting) {
      try {
        const bookResult = await api.getBookData(bookId);
        if (bookResult.status == 200) {
          const bookData = bookResult.body;
          const readSecond = Utils.getFormatTimeSecond(duration);
          this.props.navigation.navigate("A10", {
            bookData,
            chapterRead,
            readSecond
          });
        } else {
          __DEV__ && console.log("error get book data: ", bookResult);
          this.props.showModal(
            {
              open: true,
              message: bookResult.errorMessage || constants.SOME_ERROR_HAPPEN,
              closeModal: this.closeModal
            },
            "alert"
          );
        }
      } catch (e) {
        __DEV__ && console.log("error get book data 2: ", e);
        this.props.showModal(
          {
            open: true,
            message: e.errorMessage || constants.SOME_ERROR_HAPPEN,
            closeModal: this.closeModal
          },
          "alert"
        );
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

  renderItem(data) {
    const { title: bookName, lstBookmark } = data;
    return (
      <View style={styles.itemWrap}>
        <Text style={styles.bookName}>{bookName}</Text>
        {lstBookmark.map((item, index) => (
          <View key={index} style={styles.sectionWrap}>
            {item.chapterName.length > 0 && (
              <Text style={styles.sectionName}>{item.chapterName}: </Text>
            )}
            {item.detail.map((itembm, indexbm) => (
              <TouchableOpacity
                key={indexbm}
                style={styles.bookmarkWrap}
                onPress={() => this.navToDetail(itembm)}
              >
                <Text style={styles.bookmarkMess}>- {itembm.comment}</Text>
                <Text style={styles.time}>{itembm.duration}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={styles.separator} />
      </View>
    );
  }

  openDrawer = () => {
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  onRefresh = () => {
    this.props.fetchBookmark(true);
  };

  handleLoadMore(isFetching) {
    if (!isFetching) {
      this.props.fetchBookmark(false);
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
          <Text style={styles.emptyText}>Error</Text>
        </View>
      );
    } else if (!isFetching && data.length === 0) {
      return (
        <View style={{ paddingVertical: 10 }}>
          <Text style={styles.emptyText}>Note</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    const {
      isFetching,
      bookmarkData,
      error,
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
            <Text style={headerStyle.title}>Note</Text>
          </View>
          <TouchableOpacity onPress={this.openDrawer} style={headerStyle.btn}>
            <IconSetting name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <FlatList
          data={bookmarkData}
          onRefresh={() => this.onRefresh()}
          refreshing={false}
          extraData={bookmarkData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() =>
            this.renderFooter(bookmarkData, isFetching, error)
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
  const { bookmark, netInfo, drawer, bottomSheet } = state;
  const { isFetching, items: bookmarkData, error } = bookmark;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isDrawerOpen } = drawer;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isFetching,
    bookmarkData,
    error,
    connecting,
    isDrawerOpen,
    isBottomSheetOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    fetchBookmark: refresh =>
      dispatch(actions.fetchListBookmarkDataIfNeed(refresh)),
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(A06);
