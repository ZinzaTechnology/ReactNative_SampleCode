import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import BottomSheetTouchable from "./BottomSheetTouchable";
import Animated from "react-native-reanimated";
import playerStyles from "./styles/BottomPlayerStyle";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import AntIcon from "react-native-vector-icons/AntDesign";
import { connect } from "react-redux";
import TrackPlayer from "react-native-track-player";
import _ from "lodash";

const { width, height } = Dimensions.get("window");
const AnimatedView = Animated.View;
const playerWidth = [145, 300];
const playerHeight = [60, 100];
const playerTopPositions = [45, height / 2 + 50];
const playerLeftPositions = [165, width / 2 - playerWidth[1] / 2];

const PlayerComponent = props => {
  const fall = props.fall;
  const animatedPlayerTopPositions = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [playerTopPositions[0], playerTopPositions[1]]
      .slice()
      .reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedPlayerLeftPositions = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [playerLeftPositions[0], playerLeftPositions[1]]
      .slice()
      .reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedPlayerWidth = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [playerWidth[0], playerWidth[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedPlayerHeight = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [playerHeight[0], playerHeight[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedFadeOut = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedFadeOutZindex = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [-99, 99],
    extrapolate: Animated.Extrapolate.CLAMP
  });

  const playControl = () => {
    const { isPlaying } = props;
    if (isPlaying) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  };

  const skipToNext = async () => {
    try {
      const currentTrackId = await TrackPlayer.getCurrentTrack();
      const trackQueue = await TrackPlayer.getQueue();
      if (_.last(trackQueue).id !== currentTrackId) {
        TrackPlayer.skipToNext();
      }
    } catch (e) {
      console.log("error skipToNext: ", e);
    }
  };

  const skipToPrevious = async () => {
    try {
      const currentTrackId = await TrackPlayer.getCurrentTrack();
      const trackQueue = await TrackPlayer.getQueue();
      if (_.first(trackQueue).id !== currentTrackId) {
        TrackPlayer.skipToPrevious();
      }
    } catch (e) {
      console.log("error skipToPrevious: ", e);
    }
  };

  const stepForward30sec = async () => {
    try {
      const position = await TrackPlayer.getPosition();
      const duration = await TrackPlayer.getDuration();
      const positionForward = position + 30;
      if (positionForward >= duration) {
        TrackPlayer.skipToNext();
      } else {
        await TrackPlayer.seekTo(positionForward);
        await TrackPlayer.pause();
        await TrackPlayer.play();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const stepBack30sec = async () => {
    try {
      const position = await TrackPlayer.getPosition();
      const positionBack = position - 30;
      if (positionBack <= 0) {
        TrackPlayer.seekTo(0);
      } else {
        await TrackPlayer.seekTo(positionBack);
        await TrackPlayer.pause();
        await TrackPlayer.play();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const { isPlaying } = props;
  const animatedFadeIn = Animated.sub(1, animatedFadeOut);
  const animatedFadeInZindex = Animated.sub(1, animatedFadeOutZindex);
  return [
    <AnimatedView
      key={"small-player-component"}
      style={[
        playerStyles.playerGroup1,
        {
          height: animatedPlayerHeight,
          width: animatedPlayerWidth,
          top: animatedPlayerTopPositions,
          left: animatedPlayerLeftPositions,
          opacity: animatedFadeOut,
          zIndex: animatedFadeOutZindex
        }
      ]}
    >
      <BottomSheetTouchable
        accessible={true}
        accessibilityLabel="quay lại 30 giây trước"
        onPress={stepBack30sec}
      >
        <EvilIcon name="undo" size={50} color="#EF7225" />
        <View style={playerStyles.absolute}>
          <Text style={playerStyles.absoluteText}>30</Text>
        </View>
      </BottomSheetTouchable>
      <BottomSheetTouchable
        style={playerStyles.playBtn}
        onPress={playControl}
        accessible={true}
        accessibilityLabel={isPlaying ? "Tạm dừng" : "Phát"}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#EF7225", "#fcc9a9"]}
          style={playerStyles.linearGradient}
        >
          <IoniconsIcon
            style={!isPlaying && { left: 2 }}
            name={isPlaying ? "ios-pause" : "ios-play"}
            size={25}
            color="white"
          />
        </LinearGradient>
      </BottomSheetTouchable>
      <BottomSheetTouchable
        accessible={true}
        accessibilityLabel="tới 30 giây sau"
        onPress={stepForward30sec}
      >
        <EvilIcon name="redo" size={50} color="#EF7225" />
        <View style={playerStyles.absolute}>
          <Text style={playerStyles.absoluteText}>30</Text>
        </View>
      </BottomSheetTouchable>
    </AnimatedView>,

    <AnimatedView
      key={"large-player-component"}
      style={[
        playerStyles.playerGroup1,
        {
          height: animatedPlayerHeight,
          width: animatedPlayerWidth,
          top: animatedPlayerTopPositions,
          left: animatedPlayerLeftPositions,
          opacity: animatedFadeIn,
          zIndex: animatedFadeInZindex
        }
      ]}
    >
      <BottomSheetTouchable
        onPress={skipToPrevious}
        accessible={true}
        accessibilityLabel="quay lại chương trước"
      >
        <AntIcon name="stepbackward" size={30} color="#AAADAE" />
      </BottomSheetTouchable>
      <BottomSheetTouchable
        accessible={true}
        accessibilityLabel="quay lại 30 giây trước"
        onPress={stepBack30sec}
      >
        <EvilIcon name="undo" size={90} color="#EF7225" />
        <View style={playerStyles.absolute}>
          <Text style={playerStyles.absoluteText1}>30</Text>
        </View>
      </BottomSheetTouchable>
      <BottomSheetTouchable
        style={playerStyles.playBtn1}
        onPress={playControl}
        accessible={true}
        accessibilityLabel={isPlaying ? "Tạm dừng" : "Phát"}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={["#EF7225", "#fcc9a9"]}
          style={playerStyles.linearGradient}
        >
          <IoniconsIcon
            style={!isPlaying && { left: 2 }}
            name={isPlaying ? "ios-pause" : "ios-play"}
            size={40}
            color="white"
          />
        </LinearGradient>
      </BottomSheetTouchable>
      <BottomSheetTouchable
        accessible={true}
        accessibilityLabel="tới 30 giây sau"
        onPress={stepForward30sec}
      >
        <EvilIcon name="redo" size={90} color="#EF7225" />
        <View style={playerStyles.absolute}>
          <Text style={playerStyles.absoluteText1}>30</Text>
        </View>
      </BottomSheetTouchable>
      <BottomSheetTouchable
        onPress={skipToNext}
        accessible={true}
        accessibilityLabel="tới chương tiếp theo"
      >
        <AntIcon name="stepforward" size={30} color="#AAADAE" />
      </BottomSheetTouchable>
    </AnimatedView>
  ];
};

const mapStateToProps = state => {
  const { playback } = state;
  const { state: playbackState } = playback;
  const isPlaying = playbackState == "playing" || playbackState == 3;
  return { isPlaying };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerComponent);
