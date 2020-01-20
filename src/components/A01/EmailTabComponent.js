import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../FormInput";
import { connect } from "react-redux";
import styles from "./styles/EmailTabComponentStyles";
import * as api from "../../logic/api";
import * as actions from "../../logic/actions";
import * as constants from "../../logic/constants";

const EmailTabComponent = props => {
  const handleSubmit = async values => {
    if (props.connecting) {
      try {
        props.showModal({ open: true }, "loading");
        const { email } = values;
        await api.signUpWithEmail(email);
        props.showModal(
          {
            open: true,
            message: constants.SIGN_UP_SUCCESS_CONTENT,
            title: constants.SIGN_UP_SUCCESS_TITLE,
            closeModal: props.hideModal
          },
          "alert"
        );
      } catch (e) {
        __DEV__ && console.log("error register email: ", e);
        props.showModal(
          {
            open: true,
            message: e.errorMessage || constants.SOME_ERROR_HAPPEN,
            closeModal: props.hideModal
          },
          "alert"
        );
      }
    } else {
      props.showModal(
        {
          open: true,
          message: constants.CONNECTION_FAIL,
          closeModal: props.hideModal
        },
        "alert"
      );
    }
  };
  return (
    <Formik
      validateOnChange={false}
      initialValues={{ email: "" }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Địa chỉ Email không hợp lệ")
          .required("Vui lòng nhập địa chỉ Email")
      })}
      render={({ values, handleSubmit, errors, setFieldValue }) => {
        return (
          <React.Fragment>
            <FormInput
              value={values.email}
              autoFocus={true}
              label={"Địa chỉ E-Mail:"}
              containStyle={{ width: "100%" }}
              onChangeText={value => setFieldValue("email", value.trim())}
              autoCapitalize={"none"}
              error={errors.email || " "}
            />
            <View
              style={{
                width: "100%",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.btn, styles.signupBtn]}
              >
                <Text style={styles.textButton}>REGISTER</Text>
              </TouchableOpacity>
            </View>
          </React.Fragment>
        );
      }}
    />
  );
};

const mapStateToProps = state => {
  const { netInfo } = state;
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  return { connecting };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmailTabComponent);
