import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import styles from "./styles/A07Style";
import headerStyle from "../components/styles/A03HeaderStyle";
import IconSetting from "react-native-vector-icons/FontAwesome";
import { DrawerActions } from "react-navigation";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import moment from "moment";
import * as constants from "../logic/constants";

class A07 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchHistory(true);
  }

  renderItem(data) {
    const { title: bookName, lstRead, index } = data;
    return (
      <View>
        <View style={styles.itemWrap}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bookName}>{bookName}</Text>
            {lstRead.map((item, indexKey) => (
              <Text style={styles.chapter} key={indexKey}>
                Chương {item.index}: {item.chapterName}
              </Text>
            ))}
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
    this.props.fetchHistory(true);
  };

  handleLoadMore(isFetching) {
    if (!isFetching) {
      this.props.fetchHistory(false);
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
          <Text style={styles.emptyText}>No history</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  render() {
    const {
      isFetching,
      historyData,
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
            <Text style={headerStyle.title}>History</Text>
          </View>
          <TouchableOpacity onPress={this.openDrawer} style={headerStyle.btn}>
            <IconSetting name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <FlatList
          data={historyData}
          onRefresh={() => this.onRefresh()}
          refreshing={false}
          extraData={historyData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() =>
            this.renderFooter(historyData, isFetching, error)
          }
          onEndReachedThreshold={0.2}
          onEndReached={() => this.handleLoadMore(isFetching)}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { history, netInfo, drawer, bottomSheet } = state;
  const { isFetching, items: historyData, error } = history;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isDrawerOpen } = drawer;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isFetching,
    historyData,
    error,
    connecting,
    isDrawerOpen,
    isBottomSheetOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    fetchHistory: refresh => dispatch(actions.fetchHistoryDataIfNeed(refresh))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(A07);
