import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

const AlertModal = ({ title, message, content }) => {
  return (
    <View style={styles.container}>
      {title !== null && (
        <Text style={styles.title}>{title ? title : "Error!"}</Text>
      )}
      {content || <Text style={styles.content}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 14,
    color: "black"
  }
});

export default AlertModal;
