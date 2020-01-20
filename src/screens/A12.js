import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image
} from "react-native";
import FormInput from "../components/FormInput";
import styles from "./styles/A12Style";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import headerStyle from "../components/styles/A03HeaderStyle";
import IconSetting from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { DrawerActions } from "react-navigation";
import * as api from "../logic/api";
import * as constants from "../logic/constants";
import * as actions from "../logic/actions";

class A12 extends Component {
  openDrawer = () => {
    // this.props.hidePlayer();
    this.props.navigation.dispatch(DrawerActions.openDrawer());
  };

  closeModal = () => {
    this.props.hideModal();
  };

  handleSubmit = async values => {
    const { connecting } = this.props;
    const { oldPassword, password, confirmPassword } = values;
    if (connecting) {
      try {
        this.props.showModal({ open: true }, "loading");
        const result = await api.changePassword(
          oldPassword,
          password,
          confirmPassword
        );
        console.log(result);
        this.props.showModal(
          {
            open: true,
            title: null,
            message: "Change Password Success",
            closeModal: () => {
              this.closeModal();
              this.props.navigation.navigate("A03");
            }
          },
          "alert"
        );
      } catch (e) {
        __DEV__ && console.log("change pass error: ", e);
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

  render() {
    const { isDrawerOpen, isBottomSheetOpen } = this.props;
    return (
      <SafeAreaView
        style={{ flex: 1 }}
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
              Change password
            </Text>
          </View>
          <TouchableOpacity onPress={this.openDrawer} style={headerStyle.btn}>
            <IconSetting name="bars" size={20} color="black" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={{ marginBottom: 60, width: "100%" }}>
              <Image
                source={require("../asset/images/logo.jpg")}
                style={styles.logo}
                resizeMode={"contain"}
              />
            </View>
            <Formik
              validateOnChange={false}
              initialValues={{
                oldPassword: "",
                password: "",
                confirmPassword: ""
              }}
              onSubmit={this.handleSubmit}
              validationSchema={Yup.object().shape({
                oldPassword: Yup.string().required("Old password"),
                password: Yup.string().required("New password"),
                confirmPassword: Yup.string().required(
                  "New password retype"
                )
              })}
              render={({ values, handleSubmit, errors, setFieldValue }) => {
                return (
                  <React.Fragment>
                    <FormInput
                      value={values.oldPassword}
                      label={"Mật khẩu cũ:"}
                      containStyle={{ width: "100%" }}
                      onChangeText={value =>
                        setFieldValue("oldPassword", value.trim())
                      }
                      accessibilityLabel={"Old password"}
                      autoCapitalize={"none"}
                      secureTextEntry={true}
                      error={errors.oldPassword || " "}
                    />
                    <FormInput
                      value={values.password}
                      label={"Mật khẩu mới:"}
                      containStyle={{ width: "100%" }}
                      onChangeText={value =>
                        setFieldValue("password", value.trim())
                      }
                      accessibilityLabel={"Password"}
                      autoCapitalize={"none"}
                      secureTextEntry={true}
                      error={errors.password || " "}
                    />
                    <FormInput
                      value={values.confirmPassword}
                      label={"Nhập lại mật khẩu:"}
                      containStyle={{ width: "100%" }}
                      onChangeText={value =>
                        setFieldValue("confirmPassword", value.trim())
                      }
                      accessibilityLabel={"Password retype"}
                      autoCapitalize={"none"}
                      secureTextEntry={true}
                      error={errors.confirmPassword || " "}
                    />
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center"
                      }}
                    >
                      <TouchableOpacity
                        onPress={handleSubmit}
                        style={styles.btn}
                      >
                        <Text style={styles.textButton}>Change Password</Text>
                      </TouchableOpacity>
                    </View>
                  </React.Fragment>
                );
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { netInfo, drawer, bottomSheet } = state;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  const { isOpen: isDrawerOpen } = drawer;
  const { isOpen: isBottomSheetOpen } = bottomSheet;
  return {
    connecting,
    isDrawerOpen,
    isBottomSheetOpen
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideModal: _ => dispatch(actions.hideModal()),
    showModal: (modalProps, modalType) => {
      dispatch(actions.showModal({ modalProps, modalType }));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(A12);
