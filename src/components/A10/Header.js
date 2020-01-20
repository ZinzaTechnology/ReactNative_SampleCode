import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import styles from "../../screens/styles/A10Style";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Utils from "../../logic/utils";
import * as constants from "../../logic/constants";

const bookCoverDefault = require("../../asset/images/bookCover.jpg");
var timeInteval = null;

const A10Header = props => {
  const { bookData, chapterData, playingBookId, isPlaying, bookTime } = props;
  const {
    id: bookId,
    title,
    avatar: artwork,
    duration,
    speakerName,
    authorName,
    read
  } = bookData;

  const [currentTime, setTime] = useState(0);
  const [numberChapterDone, setChapterDone] = useState(0);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const getCurrentPosition = bookTimeData => {
    let currentPosition = 0;
    let countChapterDone = 0;
    if (bookTimeData) {
      Object.keys(bookTimeData).forEach(function(item) {
        currentPosition += bookTimeData[item].time;
        bookTimeData[item].isDone && countChapterDone++;
      });
    }
    return { currentPosition, countChapterDone };
  };

  useEffect(() => {
    setTime(read);
  }, []);

  useEffect(() => {
    const positionData = getCurrentPosition(bookTime);
    const readTime = positionData.currentPosition || read || 0;
    const chapterDone = positionData.countChapterDone || 0;
    setTime(readTime);
    setChapterDone(chapterDone);
  }, [bookTime]);

  const bookCover = artwork ? { uri: artwork } : bookCoverDefault;
  const numberOfChapter = chapterData ? chapterData.length : 0;
  const totalTime = Utils.getFormatTimeSecond(duration);
  const timeLeft = totalTime - currentTime >= 0 ? totalTime - currentTime : 0;
  const timeLeftText = Utils.formatTime(timeLeft);
  return (
    <View>
      <View style={styles.topWrap}>
        <View style={styles.imageWrap}>
          <FastImage
            style={styles.mainImage}
            source={bookCover}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.content}>
          <View style={{ marginBottom: 5 }}>
            <Text style={[styles.title, { marginBottom: 5 }]}>{title}</Text>
            <Text style={[styles.title, { marginBottom: 5 }]}>
              Tác giả: {authorName}
            </Text>
            <Text style={styles.title}>Giọng đọc: {speakerName}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Ionicons name="ios-book" size={25} color="#105AFF" />
            <View style={{ marginLeft: 7 }}>
              <Text style={styles.titleText}>Chapter {numberOfChapter}</Text>
              <Text style={styles.normal}>Duration {duration}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Icon name="check-circle" size={25} color="#51CB0A" />
            <View style={{ marginLeft: 7 }}>
              <Text style={styles.titleText}>
                Finish {numberChapterDone}
              </Text>
              <Text style={styles.normal}>Left {timeLeftText}</Text>
            </View>
          </View>
        </View>
      </View>
      <Text style={styles.chapters}>Chapter</Text>
    </View>
  );
};

export default A10Header;
