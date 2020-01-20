import React, { useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Text, View } from "react-native";
import TrackPlayer from "react-native-track-player";
import {
  DrawerActions,
  NavigationActions,
  withNavigationFocus
} from "react-navigation";
import styles from "./styles/DrawerStyles";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import RNSecureStorage from "rn-secure-storage";
import * as constants from "../logic/constants";
import IconFeather from "react-native-vector-icons/Feather";
import IconAweSome from "react-native-vector-icons/FontAwesome";
import IconEntypo from "react-native-vector-icons/Entypo";
import * as api from "../logic/api";
import DeviceInfo from "react-native-device-info";
import firebase from "react-native-firebase";
import * as Utils from "../logic/utils";
import RNFS from "react-native-fs";
import openConnection from "../logic/realm";

const DrawerComponent = props => {
  const { downloadDoneState } = props;
  const { isDrawerOpen } = props.navigation.state;
  useEffect(() => {
    createNotificationListeners();
    initPlayer();
    return () => {
      __DEV__ && console.log("drawer unmount");
      notificationListener();
      notificationOpenedListener();
    };
  }, []);

  useEffect(() => {
    props.updateDrawerState(isDrawerOpen);
  }, [isDrawerOpen]);

  const prevAmount = Utils.usePrevious({ downloadDoneState });

  useEffect(() => {
    const prevDownloadDoneState = downloadDoneState
      ? prevAmount.downloadDoneState
      : null;
    if (!prevDownloadDoneState && downloadDoneState) {
      const currentScreen = Utils.getActiveRouteName(props.navigation.state);
      props.endDownload();
      if (currentScreen == "A11") {
        props.navigation.navigate("A03");
      }
    }
  }, [downloadDoneState]);

  const initPlayer = async () => {
    await TrackPlayer.setupPlayer({});
  };

  const navToScreen = screen => {
    const navigateAction = NavigationActions.navigate({
      routeName: screen
    });
    props.navigation.dispatch(navigateAction);
    props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  getFirebaseToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.warn("TOKEN: ", fcmToken);
      // user has a device token
    } else {
      console.warn("TOKEN: user doesn't have a device token yet");
      // user doesn't have a device token yet
    }
  };

  closeModal = () => {
    props.hideModal();
  };

  signOut = async () => {
    props.showModal(
      {
        open: true,
        message:
          "Are you sure to signout?",
        confirmModal: () => this.confirmSignOut(),
        confirmTitle: "Continue",
        cancelTitle: "No",
        closeModal
      },
      "confirm"
    );
  };

  confirmSignOut = async () => {
    try {
      closeModal();
      const uniqueId = DeviceInfo.getUniqueID();
      await removeBook();
      props.navigation.dispatch(DrawerActions.closeDrawer());
      props.updatePlayback(null);
      props.hidePlayer();
      await TrackPlayer.reset();
      await api.signOut(uniqueId);
      await api.resetAuthorization();
      await RNSecureStorage.remove(constants.AS_AUTHORIZATION);
      props.navigation.navigate("AuthStack");
    } catch (err) {
      props.showModal(
        {
          open: true,
          message: constants.SOME_ERROR_HAPPEN,
          closeModal
        },
        "alert"
      );
      console.log("sign out error: ", err);
    }
  };

  removeBook = async _ => {
    try {
      var path = `${RNFS.TemporaryDirectoryPath}.Books`;
      const isPathExist = await RNFS.exists(path);
      if (isPathExist) {
        await RNFS.unlink(path);
        const realm = await openConnection();
        const books = realm.objects("Book");
        const chapters = realm.objects("Chapter");
        realm.write(() => {
          realm.delete(books);
          realm.delete(chapters);
        });
      }
    } catch (err) {
      props.showModal(
        {
          open: true,
          message: constants.SOME_ERROR_HAPPEN,
          closeModal
        },
        "alert"
      );
      console.log("remove book error: ", err.message);
    }
  };

  createNotificationListeners = async () => {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        __DEV__ && console.log("==> getNotification 0: ", notification);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        __DEV__ && console.log("==> getNotification 1: ", notificationOpen);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      __DEV__ && console.log("==> getNotification 2: ", notificationOpen);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    messageListener = firebase.messaging().onMessage(message => {
      //process data message
      __DEV__ && console.log("message: ", JSON.stringify(message));
    });
  };

  const version = DeviceInfo.getReadableVersion();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.tabWrapper}
        onPress={() => navToScreen("A03")}
      >
        <View style={styles.iconWrap}>
          <IconAweSome name={"book"} color={"black"} size={20} />
        </View>

        <Text style={styles.tabLabel}>Youre book</Text>
        <IconFeather
          style={{ left: 10 }}
          name={"chevron-right"}
          color={"#A9A9A9"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabWrapper}
        onPress={() => navToScreen("A06")}
      >
        <View style={styles.iconWrap}>
          <IconAweSome name={"star-o"} color={"black"} size={20} />
        </View>
        <Text style={styles.tabLabel}>Note</Text>
        <IconFeather
          style={{ left: 10 }}
          name={"chevron-right"}
          color={"#A9A9A9"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabWrapper}
        onPress={() => navToScreen("A07")}
      >
        <View style={styles.iconWrap}>
          <IconAweSome name={"history"} color={"black"} size={20} />
        </View>
        <Text style={styles.tabLabel}>History</Text>
        <IconFeather
          style={{ left: 10 }}
          name={"chevron-right"}
          color={"#A9A9A9"}
          size={30}
        />
      </TouchableOpacity>
      {props.haveChapterDownload && (
        <TouchableOpacity
          style={styles.tabWrapper}
          onPress={() => navToScreen("A11")}
        >
          <View style={styles.iconWrap}>
            <IconEntypo name={"download"} color={"black"} size={20} />
          </View>
          <Text style={styles.tabLabel}>Download</Text>
          <IconFeather
            style={{ left: 10 }}
            name={"chevron-right"}
            color={"#A9A9A9"}
            size={30}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.tabWrapper}
        onPress={() => navToScreen("A09")}
      >
        <View style={styles.iconWrap}>
          <IconAweSome name={"bell-o"} color={"black"} size={20} />
        </View>
        <Text style={styles.tabLabel}>Notice</Text>
        <IconFeather
          style={{ left: 10 }}
          name={"chevron-right"}
          color={"#A9A9A9"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.tabWrapper}
        onPress={() => navToScreen("A12")}
      >
        <View style={styles.iconWrap}>
          <IconAweSome name={"lock"} color={"black"} size={20} />
        </View>
        <Text style={styles.tabLabel}>Change password</Text>
        <IconFeather
          style={{ left: 10 }}
          name={"chevron-right"}
          color={"#A9A9A9"}
          size={30}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabWrapper} onPress={this.signOut}>
        <View style={styles.iconWrap}>
          <IconAweSome name={"sign-out"} color={"black"} size={20} />
        </View>
        <Text style={styles.tabLabel}>Sign out</Text>
        <IconFeather
          style={{ left: 10 }}
          name={"chevron-right"}
          color={"#A9A9A9"}
          size={30}
        />
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <Text style={styles.version}>{`Version: ${version}`}</Text>
    </SafeAreaView>
  );
};

function mapStateToProps(state, props) {
  const { playback, download } = state;
  const { chapters, downloadDone: downloadDoneState } = download;
  const haveChapterDownload = chapters.length > 0;
  return { playback, haveChapterDownload, downloadDoneState };
}

function mapDispatchToProps(dispatch) {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    showPlayer: () => dispatch(actions.showPlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    endDownload: () => dispatch(actions.endDownload()),
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    updateDrawerState: state => dispatch(actions.updateDrawerState(state))
  };
}

const MainDrawer = withNavigationFocus(DrawerComponent);

export default connect(mapStateToProps, mapDispatchToProps)(MainDrawer);
