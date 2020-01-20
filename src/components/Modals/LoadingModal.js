import React, { Component } from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";

const LoadingModal = (props) => {
  return (
    <Modal
      style={{ flex: 1 }}
      animationsType="slide"
      transparent={true}
      visible={props.open}
    >
      <View style={styles.modalOverlay}>
        <View style={{ flexDirection: "row" }}>
          <View style={styles.modalContainer}>
            <ActivityIndicator
              size={"large"}
              style={{ color: "#000", marginVertical: 10 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    flex: 1,
    paddingHorizontal: 20,
    flexDirection: "row"
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "transparent"
  },
  modalClose: {
    position: "absolute",
    top: -40,
    right: 0
  }
});

export default LoadingModal;
