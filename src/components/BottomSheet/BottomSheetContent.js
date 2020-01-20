import React, { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Button,
  Switch
} from "react-native";
import BottomSheetTouchable from "./BottomSheetTouchable";
import Slider from "react-native-slider";
import Animated from "react-native-reanimated";
import IconAwesome from "react-native-vector-icons/FontAwesome";
import IconIonic from "react-native-vector-icons/Ionicons";
import styles from "./styles/BottomSheetStyle";
import { isIphoneX, formatTime } from "../../logic/utils";
import TrackPlayer from "react-native-track-player";
import { connect } from "react-redux";
import * as actions from "../../logic/actions";
import * as constants from "../../logic/constants";
import FormInput from "../../components/FormInput";
import * as api from "../../logic/api";
import LinearGradient from "react-native-linear-gradient";
import RNExitApp from "react-native-exit-app";

const { width, height } = Dimensions.get("window");
const AnimatedView = Animated.View;

const FormComment = props => {
  const [comment, setComment] = useState("");
  const { position, bookId, chapterId, submitBookmark } = props;
  const submit = async () => {
    submitBookmark(bookId, chapterId, comment, position);
  };

  return (
    <View style={{ width: "100%" }}>
      <FormInput
        value={comment}
        autoFocus={true}
        multiline={true}
        containStyle={{
          width: "100%"
        }}
        onChangeText={value => {
          setComment(value);
        }}
      />
      <View style={styles.submitWrap}>
        <TouchableOpacity onPress={submit} style={styles.submitBtn}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#EF7225", "#fcc9a9"]}
            style={styles.linear}
          >
            <Text style={styles.submitText}>OK</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BottomSheetContent = props => {
  const { fall, switchViewBookmark, showBookmark } = props;
  const [volume, setVolume] = useState(1);
  const [minuteOff, setMinuteOff] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [enableTimerOff, setEnableTimerOff] = useState(false);
  const [timerOff, setTimerOff] = useState(null);

  animatedContentOpacity = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Animated.Extrapolate.CLAMP
  });

  animatedContentZIndex = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [-99, 99].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });

  const getCurrentVolume = async () => {
    const currentVolume = await TrackPlayer.getVolume();
    setVolume(currentVolume);
  };

  const closeModal = () => {
    props.hideModal();
  };

  const onChangeVolume = async value => {
    try {
      await TrackPlayer.setVolume(value);
    } catch (e) {
      props.showModal(
        {
          open: true,
          message: e.errorMessage || constants.SOME_ERROR_HAPPEN,
          closeModal: closeModal
        },
        "alert"
      );
    }
  };
  const { position } = TrackPlayer.useTrackPlayerProgress();

  submitBookmark = async (bookId, chapterId, comment, position) => {
    const duration = Math.floor(position);
    props.addBookmark(bookId, chapterId, comment, duration);
  };

  addBookmark = bookmarkPosition => {
    const { currentChapterId, currentBookId, connecting } = props;
    if (connecting) {
      props.showModal(
        {
          open: true,
          title: "Bookmark",
          content: (
            <FormComment
              position={bookmarkPosition}
              bookId={currentBookId}
              chapterId={currentChapterId}
              submitBookmark={submitBookmark}
            />
          ),
          closeModal
        },
        "alert"
      );
    } else {
      props.showModal(
        {
          open: true,
          message: constants.CONNECTION_FAIL,
          closeModal
        },
        "alert"
      );
    }
  };

  displayModalTimerOff = () => {
    props.showModal(
      {
        open: true,
        content: renderSetTimerModal(),
        closeModal: closeModal
      },
      "content"
    );
  };

  renderSetTimerModal = () => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{"HẸN GIỜ TẮT"}</Text>
        <Switch
          value={minuteOff > 0}
          onValueChange={value => onSetTimerChange(value)}
        />
        <FormInput
          textContentType={"telephoneNumber"}
          containStyle={{
            width: "100%"
          }}
          placeholder="Nhập số phút"
          onChangeText={value => setMinuteOff(value)}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            justifyContent: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => closeModal()}
            style={[
              styles.submitBtn,
              styles.linear,
              { marginRight: 10, backgroundColor: "black" }
            ]}
          >
            <Text style={styles.submitText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => confirmSetupTimerOff()}
            style={styles.submitBtn}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["#EF7225", "#fcc9a9"]}
              style={styles.linear}
            >
              <Text style={styles.submitText}>Agree</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  onSetTimerChange = value => {
    console.log("====onSetTimerChange");
    console.log({ value });
    console.log({ countdown });

    if (!value && countdown > 0) {
      // stop timer
      setMinuteOff("-1");
      setCountdown(0);
      if (timerOff) {
        clearTimeout(timerOff);
      }
      // close modal
      closeModal();
    }
  };

  confirmSetupTimerOff = () => {
    if (timerOff) {
      clearTimeout(timerOff);
    }
    console.log({ minuteOff });

    var count = parseInt(minuteOff) * 60 - 1; // convert minute to second
    console.log({ count });

    var interval = 1000;

    const timer = setInterval(() => {
      setCountdown(count);
      count -= 1;
    }, interval);
    setTimerOff(timer);

    // close modal
    closeModal();
  };

  useEffect(() => {
    console.log({ countdown });

    if (countdown < 0) {
      RNExitApp.exitApp();
    }
  }, [countdown]);

  getCurrentVolume();

  onSetTimerChange = value => {
    console.log({ value });
    setEnableTimerOff(value);
    console.log({ enableTimerOff });
  };

  confirmSetupTimerOff = () => {
    console.log({ minuteOff });
    var count = parseInt(minuteOff) * 60 - 1; // convert minute to second
    var interval = 1000;

    setInterval(() => {
      console.log({ count });
      setCountdown(count);
      count -= 1;
    }, interval);

    setTimeout(() => {
      RNExitApp.exitApp();
    }, (count + 1) * interval);

    // close modal
    closeModal();
  }

  getCurrentVolume();
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AnimatedView
        style={{
          opacity: animatedContentOpacity,
          zIndex: animatedContentZIndex,
          padding: 20,
          flexDirection: "row"
        }}
      >
        <BottomSheetTouchable style={styles.switchBtn} onPress={switchViewBookmark}>
          <IconIonic name={"ios-bookmark"} size={18} color={"#EF7225"} />
          <Text style={styles.switchText}>{showBookmark ? "Bìa sách" : "Ghi chú"}</Text>
        </BottomSheetTouchable>
      </AnimatedView>
      <AnimatedView
        style={{
          position: "absolute",
          bottom: isIphoneX() ? 34 + 20 : 20,
          opacity: animatedContentOpacity,
          zIndex: animatedContentZIndex,
          width: 280,
          left: width / 2 - 280 / 2
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            alignItems: "center"
          }}
        >
          <IconAwesome
            name="volume-off"
            size={25}
            color="#EF7225"
            style={{ paddingHorizontal: 10 }}
          />
          <Slider
            value={volume}
            thumbStyle={styles.largeThumbStyles}
            thumbTouchSize={{
              width: 50,
              height: 50
            }}
            thumbTintColor="white"
            minimumTrackTintColor={"#EF7225"}
            trackStyle={{ height: 2 }}
            style={{ height: 50, flex: 1 }}
            onSlidingComplete={onChangeVolume}
          />
          <IconAwesome
            name="volume-down"
            size={25}
            color="#EF7225"
            style={{ paddingHorizontal: 10 }}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <BottomSheetTouchable
            onPress={() => displayModalTimerOff()}
            accessible={true}
            accessibilityLabel="Hẹn giờ"
            style={{ marginRight: 30, ...styles.alarm }}
          >
            <IconIonic name="ios-alarm" size={25} color="#EF7225" />
          </BottomSheetTouchable>

          <BottomSheetTouchable
            onPress={() => addBookmark(position)}
            accessible={true}
            accessibilityLabel="Bookmark"
            style={styles.alarm}
          >
            <IconIonic name="ios-star" size={25} color="#EF7225" />
          </BottomSheetTouchable>
        </View>
        {countdown > 0 && (
          <Text style={{ color: "black", textAlign: "center", marginTop: 10 }}>
            OffTime: {`${countdown}`.toHHMMSS()}
          </Text>
        )}
      </AnimatedView>
    </View>
  );
};

const mapStateToProps = state => {
  const { playback, netInfo } = state;
  const { currentTrack, bookId: currentBookId } = playback;
  const currentChapterId = Number(currentTrack);
  const { type: connectionType } = netInfo;
  const connecting = connectionType !== "none" && connectionType !== "unknown";
  return { currentChapterId, currentBookId, connecting };
};

const mapDispatchToProps = dispatch => {
  return {
    showModal: (modalProps, modalType) =>
      dispatch(actions.showModal({ modalProps, modalType })),
    hideModal: () => dispatch(actions.hideModal()),
    addBookmark: (bookId, chapterId, comment, duration) =>
      dispatch(actions.postBookmarkData(bookId, chapterId, comment, duration))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(BottomSheetContent);
