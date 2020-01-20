import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ConfirmModal = ({
  closeModal,
  confirmModal,
  confirmTitle,
  title,
  message,
  cancelTitle
}) => {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.content}>{message}</Text>
      <View
        style={{
          marginTop: 10,
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <TouchableOpacity style={styles.button} onPress={closeModal}>
          <Text style={styles.btnText}>{cancelTitle || "Cancel"}</Text>
        </TouchableOpacity>

        {confirmModal && confirmTitle && (
          <TouchableOpacity
            style={[
              styles.button,
              { marginLeft: 15, backgroundColor: "#EF7225" }
            ]}
            onPress={confirmModal}
          >
            <Text style={styles.btnText}>{confirmTitle}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    justifyContent: "center"
  },
  btnText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 16,
    color: "black"
  },
  content: {
    textAlign: "center",
    color: "black",
    fontSize: 14
  }
});

export default ConfirmModal;
