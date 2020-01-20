import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import FastImage from "react-native-fast-image";

const bookCoverDefault = require("../../asset/images/bookCover.jpg");

const { width, height } = Dimensions.get("window");
const songCoverWidth = [80, 120];
const songCoverHeight = [120, 180];
const songCoverTopPositions = [
  0,
  (height * 5) / 12 - songCoverHeight[1] - (height * 1) / 20
];
const songCoverLeftPositions = [0, width / 2 - songCoverWidth[1] / 2];

const SongCover = props => {
  const AnimatedView = Animated.View;
  const { fall } = props;
  const animatedSongCoverHeight = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [songCoverHeight[0], songCoverHeight[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedSongCoverWidth = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [songCoverWidth[0], songCoverWidth[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedSongCoverLeftPosition = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: songCoverLeftPositions.slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedSongCoverTopPosition = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: songCoverTopPositions.slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const { trackData } = props;

  const { artwork } = trackData;
  return (
    <AnimatedView
      style={{
        position: "absolute",
        height: animatedSongCoverHeight,
        width: animatedSongCoverWidth,
        left: animatedSongCoverLeftPosition,
        top: animatedSongCoverTopPosition
      }}
    >
      <FastImage
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#333"
        }}
        source={artwork ? { uri: artwork } : bookCoverDefault}
      />
    </AnimatedView>
  );
};
export default SongCover;
