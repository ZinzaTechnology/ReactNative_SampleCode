import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import styles from "./styles/A02Style";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import RNSecureStorage, { ACCESSIBLE } from "rn-secure-storage";
import FormInput from "../components/FormInput";
import * as constants from "../logic/constants";
import { connect } from "react-redux";
import * as actions from "../logic/actions";
import * as api from "../logic/api";
import firebase from "react-native-firebase";
import DeviceInfo from "react-native-device-info";
import * as Utils from "../logic/utils";
import TrackPlayer from "react-native-track-player";

class A02 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.checkPermission();
  }

  componentDidUpdate(prevProps) {
    const {
      configError,
      configData,
      configFetched,
      configFetching
    } = this.props;
    if (prevProps.configFetching != configFetching) {
      this.props.showModal(
        {
          open: configFetching
        },
        "loading"
      );
    }

    if (!prevProps.configFetched && configFetched) {
      console.log({ configError, configData });
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

  checkPermission = async () => {
    __DEV__ && console.log("checkPermission");

    const enabled = await firebase.messaging().hasPermission();
    if (!enabled) {
      this.requestPermission();
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
    } catch (error) {
      __DEV__ && console.log("permission rejected");
    }
  };

  closeModal = () => {
    this.props.hideModal();
  };

  handleSubmit = async values => {
    if (this.props.connecting) {
      try {
        this.props.showModal({ open: true }, "loading");
        const uniqueId = DeviceInfo.getUniqueID();
        const fcmToken = (await firebase.messaging().getToken()) || "";
        const { username, password } = values;
        const result = await api.signIn(username, password, fcmToken, uniqueId);
        const auth_token = result.headers.map.authorization;
        console.log("LOGIN WITH TOKEN: ", auth_token);

        await RNSecureStorage.set(constants.AS_AUTHORIZATION, auth_token, {
          accessible: ACCESSIBLE.ALWAYS
        });
        this.props.fetchConfigData();
        this.props.showModal({ open: false }, "loading");
      } catch (e) {
        console.log("catch login error: ", e);
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

  navToSignUp = () => {
    this.props.navigation.navigate("A01");
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={{ marginBottom: 60, width: "100%" }}>
              <Image
                source={require("../asset/images/logo.jpg")}
                style={styles.logo}
                resizeMode={"contain"}
              />
            </View>
            <View style={styles.form}>
              <Formik
                validateOnChange={false}
                initialValues={{ username: "", password: "" }}
                onSubmit={this.handleSubmit}
                validationSchema={Yup.object().shape({
                  username: Yup.string()
                    .email("Địa chỉ Email không hợp lệ")
                    .required("Vui lòng nhập địa chỉ Email"),
                  password: Yup.string().required("Vui lòng nhập mật khẩu")
                })}
                render={({ values, handleSubmit, errors, setFieldValue }) => {
                  return (
                    <React.Fragment>
                      <FormInput
                        value={values.username}
                        // autoFocus={true}
                        label={"Tên đăng nhập:"}
                        containStyle={{ width: "100%" }}
                        onChangeText={value =>
                          setFieldValue("username", value.trim())
                        }
                        accessibilityLabel={"Ô Nhập tên đăng nhập"}
                        autoCapitalize={"none"}
                        error={errors.username || " "}
                      />
                      <FormInput
                        value={values.password}
                        label={"Mật khẩu:"}
                        containStyle={{ width: "100%" }}
                        onChangeText={value =>
                          setFieldValue("password", value.trim())
                        }
                        accessibilityLabel={"Ô Nhập mật khẩu"}
                        autoCapitalize={"none"}
                        secureTextEntry={true}
                        error={errors.password || " "}
                      />
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center"
                        }}
                      >
                        <TouchableOpacity
                          onPress={handleSubmit}
                          style={[styles.btn, styles.loginBtn]}
                        >
                          <Text style={styles.textButton}>Login</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => this.navToSignUp()}
                          style={[styles.btn, styles.signupBtn]}
                        >
                          <Text style={styles.textButton}>Register</Text>
                        </TouchableOpacity>
                      </View>
                    </React.Fragment>
                  );
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { netInfo, config } = state;
  const { type: connectionType } = netInfo;
  const {
    error: configError,
    data: configData,
    isFetched: configFetched,
    isFetching: configFetching
  } = config;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  return { connecting, configError, configData, configFetched, configFetching };
}

function mapDispatchToProps(dispatch) {
  return {
    showPlayer: () => dispatch(actions.showPlayer()),
    hidePlayer: () => dispatch(actions.hidePlayer()),
    updatePlayback: chapterId => dispatch(actions.playbackTrack(chapterId)),
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    fetchConfigData: () => dispatch(actions.fetchConfigData()),
    hideModal: forceHide => dispatch(actions.hideModal(forceHide)),
    showModal: (modalProps, modalType, alwaysShow) => {
      dispatch(actions.showModal({ modalProps, modalType, alwaysShow }));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(A02);
