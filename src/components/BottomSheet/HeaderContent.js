import React, { Component } from "react";
import { View, Text, Dimensions } from "react-native";
import BottomSheetTouchable from "./BottomSheetTouchable";
import Animated from "react-native-reanimated";
import playerStyles from "./styles/BottomPlayerStyle";
import styles from "./styles/BottomSheetStyle";
import Icon from "react-native-vector-icons/MaterialIcons";
import Util from "../../logic/utils";
import { useTrackPlayerProgress } from "react-native-track-player";
import BottomSheetBookmark from "./BottomSheetBookmark";

const { height, width } = Dimensions.get("window");
const headerHeight = [123, (height * 5) / 12];

const HeaderContent = props => {
  const AnimatedView = Animated.View;
  const {
    fall,
    data,
    extendPlayer,
    showBookmark,
    trackBookmark,
    removeBookmark,
    editBookmark,
    isGetFetching,
    errorGet,
    connecting,
    seekToBookmark
  } = props;
  const animatedHeaderHeight = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [headerHeight[0], headerHeight[1]].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });

  const animatedHeaderContentOpacity = Animated.interpolate(fall, {
    inputRange: [0.75, 1],
    outputRange: [0, 1],
    extrapolate: Animated.Extrapolate.CLAMP
  });

  const animatedHeaderContentZIndex = Animated.interpolate(fall, {
    inputRange: [0.75, 1],
    outputRange: [-99, 99].slice(),
    extrapolate: Animated.Extrapolate.CLAMP
  });

  const animatedBoomarkOpacity = Animated.sub(
    1,
    this.animatedHeaderContentOpacity
  );
  const animatedBoomarkZIndex = Animated.sub(
    1,
    this.animatedHeaderContentZIndex
  );
  const { trackData } = props;
  const { title } = trackData;
  const { position, duration } = useTrackPlayerProgress();
  const positionSecond = Math.floor(position);
  const durationSecond = Math.floor(duration);

  return (
    <AnimatedView
      style={[styles.contentContainer, { height: animatedHeaderHeight }]}
    >
      {showBookmark && (
        <AnimatedView
          style={[
            styles.bookmarkContainer,
            {
              opacity: animatedBoomarkOpacity,
              zIndex: animatedBoomarkZIndex
            }
          ]}
        >
          <BottomSheetBookmark
            trackBookmark={trackBookmark}
            removeBookmark={removeBookmark}
            editBookmark={editBookmark}
            isGetFetching={isGetFetching}
            errorGet={errorGet}
            connecting={connecting}
            seekToBookmark={seekToBookmark}
          />
        </AnimatedView>
      )}
      <AnimatedView
        style={[
          playerStyles.container,
          {
            opacity: animatedHeaderContentOpacity,
            zIndex: animatedHeaderContentZIndex
          }
        ]}
      >
        <View style={playerStyles.mainImage} />
        <View style={playerStyles.mainPlayer}>
          <AnimatedView style={{ opacity: animatedHeaderContentOpacity }}>
            <Text
              style={playerStyles.title}
              ellipsizeMode={"tail"}
              numberOfLines={1}
            >
              {title}
            </Text>
          </AnimatedView>
          <View style={playerStyles.player}>
            <View style={playerStyles.timer}>
              <Text style={playerStyles.timeText}>
                {`${positionSecond}`.toHHMMSS()}
              </Text>
              <Text style={playerStyles.timeText}>
                {`${durationSecond}`.toHHMMSS()}
              </Text>
            </View>
            <View style={playerStyles.playerGroup} />
          </View>
        </View>
        <AnimatedView
          style={{ opacity: animatedHeaderContentOpacity, width: 50 }}
        >
          <BottomSheetTouchable
            accessible={true}
            accessibilityLabel="Mở rộng"
            style={playerStyles.showMore}
            onPress={() => extendPlayer()}
          >
            <Icon name="more-horiz" size={25} color="black" />
          </BottomSheetTouchable>
        </AnimatedView>
      </AnimatedView>
    </AnimatedView>
  );
};

export default HeaderContent;
