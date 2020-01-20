import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import FastImage from "react-native-fast-image";
import styles from "../screens/styles/A03Style";
import * as Utils from "../logic/utils";

const A03Item = props => {
  const [currentTime, setTime] = useState(0);
  const { data, onPress, timeRead } = props;
  const {
    id: bookId,
    title,
    avatar: bookCover,
    authorName,
    speakerName,
    read,
    duration
  } = data;

  const currentBookRead = timeRead[bookId];

  const getCurrentPosition = bookTimeData => {
    let currentPosition = 0;
    if (bookTimeData) {
      Object.keys(bookTimeData).forEach(function(item) {
        currentPosition += bookTimeData[item].time;
      });
    }
    return currentPosition;
  };

  useEffect(() => {
    setTime(read);
  }, []);

  useEffect(() => {
    const bookReadTime = getCurrentPosition(currentBookRead) || read || 0;
    setTime(bookReadTime);
  }, [currentBookRead]);

  const totalTime = Utils.getFormatTimeSecond(duration);
  const currentRead = currentTime < totalTime ? currentTime : totalTime;
  const percentRead = Math.ceil((currentRead / totalTime) * 100) || 0;
  const flexRead = currentRead / totalTime;
  const flexLeft = (totalTime - currentRead) / totalTime;
 
  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity style={styles.itemTouch} onPress={onPress}>
        <View style={styles.contentWrap}>
          <View style={styles.imgWrap}>
            <FastImage
              style={styles.mainImage}
              source={{
                uri: bookCover || ""
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>

          <Text
            ellipsizeMode={"tail"}
            numberOfLines={3}
            style={styles.bookName}
          >
            {title} - {authorName} - Voice {speakerName}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.readPercent}>{percentRead}%</Text>
          <View style={{ padding: 10 }}>
            <View style={styles.processWrap}>
              <View
                style={{
                  flex: flexRead,
                  backgroundColor: "#EF7225",
                  borderRadius: 1
                }}
              />
              <View style={{ flex: flexLeft }} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default A03Item;
