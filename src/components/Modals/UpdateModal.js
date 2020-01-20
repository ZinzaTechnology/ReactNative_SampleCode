import React from "react";
import {
  View,
  Dimensions,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity
} from "react-native";
import { isIphoneX } from "../../logic/utils";
import { URL_GOOGLE_STORE, URL_APPLE_STORE } from "../../logic/constants";

const { height } = Dimensions.get("window");
const extraHeightIphoneX = isIphoneX() ? 34 + 44 : 0;
const maxHeight = height - 100 - extraHeightIphoneX;
const logo = require("../../asset/images/logo.jpg");
const ContentModal = ({ changeLog, currentVersion }) => {
  linkToStore = () => {
    const linkApp = Platform.OS == "ios" ? URL_APPLE_STORE : URL_GOOGLE_STORE;
    Linking.openURL(linkApp).catch(
      err => __DEV__ && console.error("An error occurred", err)
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1
      }}
      style={{ maxHeight }}
    >
      <View style={styles.container}>
        <Image
          source={logo}
          style={{
            width: "70%",
            height: 100,
            alignSelf: "center",
            marginBottom: 20
          }}
          resizeMode={"contain"}
        />
        <View style={styles.row}>
          <Text style={styles.titleText}>New version</Text>
          <Text style={styles.titleText}>v{currentVersion}</Text>
        </View>
        <Text style={styles.content}>{changeLog}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10
          }}
        >
          <TouchableOpacity
            style={[styles.btn, styles.signupBtn]}
            onPress={() => linkToStore()}
          >
            <Text style={[styles.titleText, { color: "white" }]}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ContentModal;

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  titleText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 16
  },
  content: {
    color: "black",
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 10
  },
  btn: {
    width: "60%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  },
  signupBtn: {
    backgroundColor: "#EF7225"
  }
});
