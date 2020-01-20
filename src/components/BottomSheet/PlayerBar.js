import React, { useEffect, useState, useRef } from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import Slider from "react-native-slider";
import Animated from "react-native-reanimated";
import styles from "./styles/PlayerBarStyle";
import {
  useTrackPlayerProgress,
  seekTo,
  pause,
  play
} from "react-native-track-player";
import * as Utils from "../../logic/utils";
import BottomSheetTouchable, {
  BSTouchableWithoutFeedback
} from "./BottomSheetTouchable";
import { connect } from "react-redux";
import * as constants from "../../logic/constants";
import * as actions from "../../logic/actions";

const interval = constants.TIME_UPDATE_INTERVAL;

const { height, width } = Dimensions.get("window");
const playerBarBottomPosition = [120, height / 2];
const PlayerBar = props => {
  const {
    fall,
    trackBookmark,
    currentChapterId,
    currentBookId,
    playBackState
  } = props;
  const AnimatedView = Animated.View;

  const [seekTime, setSeekTime] = useState(-1);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const animatedPlayerBarTopPosition = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [playerBarBottomPosition[0], playerBarBottomPosition[1]]
      .slice()
      .reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });

  const animatedPlayerBarPadding = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0, 10].slice().reverse(),
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

  const animatedFadeInZindex = Animated.sub(1, this.animatedFadeOutZindex);
  const animatedFadeIn = Animated.sub(1, animatedFadeOut);
  const { position, duration } = useTrackPlayerProgress();
  const currentPosition =
    Math.ceil(position) <= duration ? Math.ceil(position) : duration;
  const progressPosition = isNaN(currentPosition / duration)
    ? 0
    : currentPosition / duration;
  const timeLeft =
    duration - currentPosition > 0 ? duration - currentPosition : 0;

  const onStartSeeking = value => {
    setSeekTime(value);
  };

  const onCompleteSeeking = async value => {
    const timeSeek = value * duration;
    try {
      await seekTo(timeSeek);
      await pause();
      await play();
      setSeekTime(-1);
    } catch (e) {
      console.log(e);
    }
  };

  const prevAmount = Utils.usePrevious({ playBackState, position });
  const positionRef = useRef(position);
  positionRef.current = position;

  useEffect(() => {
    const prevPlayBackState = prevAmount ? prevAmount.playBackState : null;
    const isPlaying = playBackState == "playing" || playBackState == 3;
    const prevIsPlaying =
      prevPlayBackState == "playing" || prevPlayBackState == 3;
    console.log(
      "prevPlayBackState: ",
      prevPlayBackState,
      " currentState: ",
      playBackState
    );
    if (prevIsPlaying && !isPlaying) {
      console.log("==========CLEAR INTERVAL===========");
      Utils.updateReadTime(
        Number(currentBookId),
        Number(currentChapterId),
        Math.ceil(positionRef.current)
      );
    }
  }, [playBackState]);

  useEffect(() => {
    if (currentPosition && (currentPosition % interval == 0 || timeLeft == 0)) {
      Utils.updateReadTime(
        Number(currentBookId),
        Number(currentChapterId),
        currentPosition
      );
    }
  }, [currentPosition]);

  const timeUpdate = Math.ceil(position);
  useEffect(() => {
    props.updateChapterTime(
      Number(currentBookId),
      Number(currentChapterId),
      timeUpdate
    );
  }, [timeUpdate]);

  const sliderRef = useRef(null);

  tapSliderHandler = evt => {
    console.warn(evt);
    // sliderRef.current.measure(async (fx, fy, width, height, px, py) => {
    //   const valueTrack = ((evt.nativeEvent.locationX - px) / width) * duration;
    //   if (valueTrack >= 0) {
    //     await seekTo(valueTrack);
    //     await pause();
    //     await play();
    //   }
    // });
  };

  return [
    <AnimatedView
      key={"small-player-bar"}
      style={{
        position: "absolute",
        top: animatedPlayerBarTopPosition,
        opacity: animatedFadeOut,
        zIndex: animatedFadeOutZindex,
        paddingHorizontal: animatedPlayerBarPadding,
        width: "100%"
      }}
    >
      <Slider
        value={progressPosition}
        disabled={true}
        thumbStyle={{ backgroundColor: "transparent" }}
        minimumTrackTintColor={"#EF7225"}
        style={{ height: 3, width: "100%" }}
        onValueChange={value => null}
      />
    </AnimatedView>,
    <AnimatedView
      key={"large-player-bar"}
      style={{
        position: "absolute",
        top: animatedPlayerBarTopPosition,
        opacity: animatedFadeIn,
        zIndex: animatedFadeInZindex,
        width: "100%",
        paddingHorizontal: animatedPlayerBarPadding
      }}
    >
      <View ref={sliderRef}>
        {/* <BSTouchableWithoutFeedback onPressIn={tapSliderHandler}> */}
        <Slider
          value={seekTime != -1 ? seekTime : progressPosition}
          thumbStyle={styles.largeThumbStyles}
          thumbTouchSize={{
            width: 50,
            height: 50
          }}
          thumbTintColor="white"
          minimumTrackTintColor={"#EF7225"}
          trackStyle={{ height: 2 }}
          style={{ height: 50, width: "100%" }}
          onSlidingComplete={onCompleteSeeking}
          onSlidingStart={onStartSeeking}
        />
        {/* </BSTouchableWithoutFeedback> */}
      </View>
      <View
        style={{
          paddingHorizontal: 10,
          width: "100%",
          position: "absolute",
          bottom: 40,
          height: 10
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%"
          }}
          onLayout={event => {
            var { x, y, width, height } = event.nativeEvent.layout;
            setProgressBarWidth(width);
          }}
        >
          {trackBookmark.map((item, index) => {
            const leftPosition = duration
              ? (item.duration / duration) * progressBarWidth
              : 0;
            return (
              <View
                key={index}
                style={{
                  position: "absolute",
                  left: leftPosition,
                  width: 5,
                  height: 10
                }}
              >
                <BottomSheetTouchable
                  onPress={() => alert(item.comment)}
                  style={{
                    backgroundColor: "#EF7225",
                    width: "100%",
                    height: "100%"
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.timePlaying}>
        <Text style={styles.timeText}>{`${position}`.toHHMMSS()}</Text>
        <Text style={styles.timeText}>-{`${timeLeft}`.toHHMMSS()}</Text>
      </View>
    </AnimatedView>
  ];
};

const mapDispatchToProps = dispatch => {
  return {
    updateChapterTime: (bookId, chapterId, time) =>
      dispatch(actions.updateChapterTime(bookId, chapterId, time))
  };
};

const mapStateToProps = state => {
  const { playback } = state;
  const {
    currentTrack: currentChapterId,
    bookId: currentBookId,
    state: playBackState
  } = playback;
  return {
    currentChapterId,
    currentBookId,
    playBackState
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PlayerBar);
