import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import styles from "./styles/A09Style";
import headerStyle from "../components/styles/A03HeaderStyle";
import IconSetting from "react-native-vector-icons/FontAwesome";
import { DrawerActions } from "react-navigation";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import * as constants from "../logic/constants";
import moment from "moment";

class A09 extends Component {
  componentDidMount() {
    this.props.fetchNotification(true);
  }

  onRefresh = () => {
    this.props.fetchNotification(true);
  };

  handleLoadMore(isFetching) {
    if (!isFetching) {
      this.props.fetchNotification(false);
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
          <Text style={styles.emptyText}>No notice</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  renderItem(data) {
    const { title, content, created } = data;
    const time = moment(created).format("HH:mm DD/MM/YYYY");
    return (
      <TouchableOpacity style={styles.itemWrap}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.contentWrap}>
            <Text style={styles.notiHeader}>{title}</Text>
            <Text style={styles.contentMess}>{content}</Text>
          </View>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  }

  openDrawer = () => {
    // this.props.hidePlayer();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  render() {
    const {
      isFetching,
      notificationData,
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
            <Text style={headerStyle.title}>Notice</Text>
          </View>
          <TouchableOpacity onPress={this.openDrawer} style={headerStyle.btn}>
            <IconSetting name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <FlatList
          data={notificationData}
          onRefresh={() => this.onRefresh()}
          refreshing={false}
          extraData={notificationData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderItem(item)}
          ListFooterComponent={() =>
            this.renderFooter(notificationData, isFetching, error)
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
  const { notification, netInfo, drawer, bottomSheet } = state;
  const { isFetching, items: notificationData, error } = notification;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isDrawerOpen } = drawer;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    isFetching,
    notificationData,
    error,
    connecting,
    isDrawerOpen,
    isBottomSheetOpen
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    fetchNotification: refresh =>
      dispatch(actions.fetchNotificationDataIfNeed(refresh))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(A09);
