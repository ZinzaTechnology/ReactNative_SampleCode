import React, { Component } from "react";
import {
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback
} from "react-native";
import {
  TouchableOpacity as RNGHTouchableOpacity,
  TouchableWithoutFeedback as RNGHTouchableWithoutFeedback
} from "react-native-gesture-handler";
const BottomSheetTouchable = props => {
  const { children, ...otherProps } = props;
  return Platform.select({
    android: (
      <RNGHTouchableOpacity {...otherProps}>{children}</RNGHTouchableOpacity>
    ),
    ios: <TouchableOpacity {...otherProps}>{children}</TouchableOpacity>
  });
};
export default BottomSheetTouchable;

export const BSTouchableWithoutFeedback = props => {
  const { children, ...otherProps } = props;
  return Platform.select({
    android: (
      <RNGHTouchableWithoutFeedback {...otherProps}>
        {children}
      </RNGHTouchableWithoutFeedback>
    ),
    ios: (
      <TouchableWithoutFeedback {...otherProps}>
        {children}
      </TouchableWithoutFeedback>
    )
  });
};
