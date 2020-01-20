import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "../../screens/styles/A10Style";
import * as Utils from "../../logic/utils";

const A10Item = props => {
  const {
    chapterData,
    playTrack,
    playingChapterId,
    isPlaying,
    bookTime,
    bookId,
    updateChapterTime
  } = props;
  const {
    name: chapterName,
    play,
    isDownloaded,
    id: chapterId,
    index,
    read,
    duration
  } = chapterData;

  const [currentTime, setTime] = useState(0);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentPosition = bookTime
    ? bookTime[chapterId]
      ? bookTime[chapterId].time
      : null
    : null;

  useEffect(() => {
    const readTime = currentPosition || read || 0;
    updateChapterTime(bookId, chapterId, readTime);
  }, []);

  useEffect(() => {
    if (currentPosition) {
      setTime(currentPosition);
    } else {
      return;
    }
  }, [currentPosition]);

  const totalTime = Utils.getFormatTimeSecond(duration);
  const calculatePercent = Math.floor((currentTime / totalTime) * 100);
  const readPercent = calculatePercent <= 100 ? calculatePercent : 100;
  const timeLeft = totalTime - currentTime >= 0 ? totalTime - currentTime : 0;
  const timeLeftText = Utils.getTimeLeft(timeLeft);
  return (
    <TouchableOpacity
      activeOpacity={isDownloaded ? 0.2 : 1}
      style={[styles.item, play && { backgroundColor: "#ECECEC" }]}
      onPress={playTrack}
    >
      <View style={styles.rowWrap}>
        <View style={styles.titleWrapper}>
          <Text style={styles.chapterTit}>Chapter {index}: {chapterName}</Text>
          <Text style={styles.timeLeft}>{timeLeftText}</Text>
        </View>
        <View style={styles.downloadWrapper}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {readPercent < 100 ? (
              <Text style={styles.percent}>{readPercent}%</Text>
            ) : (
              <Icon
                style={{ marginRight: 15 }}
                name="check-circle"
                size={32}
                color="#51CB0A"
              />
            )}

            {chapterId == playingChapterId ? (
              <View style={styles.onPlay}>
                <FeatherIcon name="bar-chart-2" size={30} color="#EF7225" />
              </View>
            ) : (
              <View style={styles.playBtn}>
                <Ionicons
                  name="ios-play"
                  size={20}
                  color="white"
                  style={{ left: 2, top: 1 }}
                />
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.bottomPlay, { width: `${readPercent}%` }]} />
    </TouchableOpacity>
  );
};

export default A10Item;
