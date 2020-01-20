import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";
import styles from "./styles/TabComponentStyles";
const TabComponent = props => {
    const {onTabChange, activeTab} = props
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        onPress={() => onTabChange(0)}
        style={[
          styles.tabWrapper,
          { backgroundColor: activeTab == 0 ? "#EF7225" : "black" }
        ]}
      >
        <Text style={styles.tabText}>Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onTabChange(1)}
        style={[
          styles.tabWrapper,
          { backgroundColor: activeTab == 1 ? "#EF7225" : "black" }
        ]}
      >
        <Text style={styles.tabText}>Image</Text>
      </TouchableOpacity>
    </View>
  );
};
export default TabComponent;
