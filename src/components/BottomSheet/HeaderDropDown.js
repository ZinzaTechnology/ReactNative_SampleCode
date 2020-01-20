import React, { Component } from "react";
import { View, TouchableOpacity } from "react-native";
import BottomSheetTouchable from "./BottomSheetTouchable";
import Animated from "react-native-reanimated";
import styles from "./styles/HeaderDropDownStyle";
const HeaderDropDown = props => {
  const { fall, onPress } = props;
  const AnimatedView = Animated.View;
  const animatedBar1Rotation = outputRange => {
    return Animated.interpolate(fall, {
      inputRange: [0, 1],
      outputRange: outputRange,
      extrapolate: Animated.Extrapolate.CLAMP
    });
  };
  const animatedZIndex = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [-99, 99].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  const animatedOpacity = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0, 1].slice().reverse(),
    extrapolate: Animated.Extrapolate.CLAMP
  });
  return (
    <AnimatedView
      style={[
        styles.wrapper,
        {
          zIndex: animatedZIndex,
          opacity: animatedOpacity
        }
      ]}
    >
      <BottomSheetTouchable
        accessible={true}
        accessibilityLabel="Thu nhỏ"
        style={styles.handlerContainer}
        onPress={onPress}
      >
        <View style={{ width: 20 }}>
          <AnimatedView
            style={[
              styles.handlerBar,
              {
                left: -7.5,
                transform: [
                  {
                    rotate: Animated.concat(
                      // @ts-ignore
                      animatedBar1Rotation([0.3, 0]),
                      "rad"
                    )
                  }
                ]
              }
            ]}
          />
          <AnimatedView
            style={[
              styles.handlerBar,
              {
                right: -7.5,
                transform: [
                  {
                    rotate: Animated.concat(
                      // @ts-ignore
                      animatedBar1Rotation([-0.3, 0]),
                      "rad"
                    )
                  }
                ]
              }
            ]}
          />
        </View>
      </BottomSheetTouchable>
    </AnimatedView>
  );
};

export default HeaderDropDown;
