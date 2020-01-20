import React from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import RNSecureStorage from "rn-secure-storage";
import * as constants from "../logic/constants";
import TrackPlayer from "react-native-track-player";
import * as Utils from "../logic/utils";
import * as api from "../logic/api";

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  componentDidUpdate(prevProps) {
    const { configError, configData, configFetched } = this.props;

    if (!prevProps.configFetched && configFetched) {
      if (configError) {
        if (configError.status == 401) {
          __DEV__ && console.log("loading not authen: 401");
          api.resetAuthorization();
          this.signOut();
        } else {
          this.props.showPlayer();
          this.props.navigation.navigate("MainStack");
        }
      } else {
        const {
          needUpdate,
          forceUpdate,
          changeLog,
          currentVersion
        } = Utils.checkUpdate(configData);
        if (needUpdate) {
          this.props.showModal(
            {
              open: true,
              changeLog,
              currentVersion,
              closeable: !forceUpdate,
              closeModal: () => this.props.hideModal(true)
            },
            "update",
            true
          );
          if (forceUpdate) return;
        }
        this.props.showPlayer();
        this.props.navigation.navigate("MainStack");
      }
    }
  }

  signOut = async () => {
    try {
      await RNSecureStorage.remove(constants.AS_AUTHORIZATION);
      this.props.hidePlayer();
      await TrackPlayer.reset();
      this.props.navigation.navigate("AuthStack");
      this.props.updatePlayback(null);
      const authorization = await RNSecureStorage.get(
        constants.AS_AUTHORIZATION
      );
      console.log("AUTHEN TOKEN AFTER REMOVE: ", authorization);
    } catch (e) {
      __DEV__ && console.log("error signout: ", e);
    }
  };

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    //--------------FIXED MAIN STACK-------------//

    RNSecureStorage.get(constants.AS_AUTHORIZATION)
      .then(userToken => {
        __DEV__ && console.log("AUTHEN_TOKEN: ", userToken);
        if (userToken == null) {
          console.log("==> need login");
          this.signOut();
        } else {
          this.props.fetchConfigData();
        }
      })
      .catch(err => {
        console.log("==> need login 1: ", err);
        RNSecureStorage.remove(constants.AS_AUTHORIZATION);
        this.props.hidePlayer();
        this.props.navigation.navigate("AuthStack");
      });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { config } = state;
  const {
    error: configError,
    data: configData,
    isFetched: configFetched
  } = config;
  return { configError, configData, configFetched };
}

function mapDispatchToProps(dispatch) {
  return {
    hidePlayer: () => dispatch(actions.hidePlayer()),
    showPlayer: () => dispatch(actions.showPlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    fetchConfigData: () => dispatch(actions.fetchConfigData()),
    hideModal: forceHide => dispatch(actions.hideModal(forceHide)),
    showModal: (modalProps, modalType, alwaysShow) => {
      dispatch(actions.showModal({ modalProps, modalType, alwaysShow }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
