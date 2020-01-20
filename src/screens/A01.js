import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView
} from "react-native";

import styles from "./styles/A01Style";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TabComponent from "../components/A01/TabComponent";
import EmailTabComponent from "../components/A01/EmailTabComponent";
import CardTabComponent from "../components/A01/CardTabComponent";

class A01 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0
    };
  }

  onTabChange = index => {
    this.setState({ activeTab: index });
  };

  navToSignIn = () => {
    this.props.navigation.navigate("A02");
  };
  render() {
    const { activeTab } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={{ marginBottom: 30, width: "100%" }}>
              <Image
                source={require("../asset/images/logo.jpg")}
                style={styles.logo}
                resizeMode={"contain"}
              />
            </View>
            <TabComponent
              onTabChange={this.onTabChange}
              activeTab={activeTab}
            />
            <View style={styles.form}>
              {activeTab == 0 && <EmailTabComponent />}
              {activeTab == 1 && <CardTabComponent />}
              <TouchableOpacity
                onPress={() => this.navToSignIn()}
                style={{ alignSelf: "center" }}
              >
                <Text style={styles.link}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

export default A01;
