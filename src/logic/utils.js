// This provider is from Google's UniversalMusicPlayer demo for Android
import { useEffect, useRef } from "react";
import { Dimensions, Platform, StatusBar } from "react-native";
import DeviceInfo from "react-native-device-info"
import openConnection from "./realm";
import _ from "lodash"

const base = "http://storage.googleapis.com/automotive-media/";
const catalog = "music.json";

/**
 * Load tracks from Google's demo provider
 */

String.prototype.toHHMMSS = function() {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  // if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

export async function loadTracks() {
  console.log("api", base + catalog);
  let response = await fetch(base + catalog);
  let json = await response.json();
  console.log("json", json);
  let data = [];

  for (let i = 0; i < json.music.length; i++) {
    let track = json.music[i];
    // Parse the JSON into Track Structures
    // https://github.com/react-native-kit/react-native-track-player/wiki/Documentation#track-structure
    data.push({
      id: track.source,
      url: base + track.source,
      artwork: base + track.image,
      duration: track.duration,

      title: track.title,
      artist: track.artist,
      album: track.album,
      genre: track.genre
    });
  }

  return data;
}

function formatTwoDigits(n) {
  return n < 10 ? "0" + n : n;
}

/**
 * Format time to "HH:mm:ss" or "mm:ss"
 */
export function formatTime(seconds) {
  const ss = Math.floor(seconds) % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);
  const hour = hh > 0 ? `${formatTwoDigits(hh)}:` : "00:";
  return hour + formatTwoDigits(mm) + ":" + formatTwoDigits(ss);
}

export function getFormatTimeSecond(time) {
  if (time == null) return 0;
  const splitedTime = time.split(":").reverse();
  const second = splitedTime[0] ? Number(splitedTime[0]) : 0;
  const minute = splitedTime[1] ? Number(splitedTime[1]) * 60 : 0;
  const hour = splitedTime[2] ? Number(splitedTime[2]) * 60 * 60 : 0;
  const timeFormat = second + minute + hour;
  return timeFormat;
}

export function getTimeLeft(seconds) {
  const mm = Math.ceil(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600);
  return `CÒN ${hh > 0 ? `${hh} GIỜ ` : ""}${mm} PHÚT`;
}

const isIPhoneXSize = dim => {
  return dim.height == 812 || dim.width == 812;
};

const isIPhoneXrSize = dim => {
  return dim.height == 896 || dim.width == 896;
};

export const isIphoneX = () => {
  const dim = Dimensions.get("window");
  return (
    // This has to be iOS
    Platform.OS === "ios" &&
    // Check either, iPhone X or XR
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
};

export const getSnapPoints = (snap, compHeight) => {
  // if (Platform.OS === "ios") {
  const snapValue = snap.map((item, index) => {
    if (index == 0) {
      const firstSnap = isIphoneX()
        ? item + compHeight + 34
        : item + compHeight;
      return firstSnap;
    } else if (index == snap.length - 1) {
      const lastSnap =
        Platform.OS === "android" ? item : isIphoneX() ? item - 44 : item;
      return lastSnap;
    } else return item;
  });
  return snapValue;
  // }
  // return snap;
};

export const updateReadTime = (bookId, chapterId, time) => {
  openConnection().then(realm => {
    console.log("updateReadTime: ", bookId, chapterId, time);
    let chapters = realm.objects("Chapter");
    const chapterFilter = chapters
      .filtered(`id = "${chapterId}" AND bookId = "${bookId}"`)
      .snapshot();
    realm.write(() => {
      chapterFilter[0].read = time;
    });

    const books = realm.objects("Book");
    let bookFilter = books.filtered(`id = "${bookId}"`).snapshot();
    let bookReadTime = bookFilter[0].chapters.sum("read");
    realm.write(() => {
      bookFilter[0].read = bookReadTime;
    });
  });
};

export const getActiveRouteName = navigationState => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index]; // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
};

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const checkUpdate = config => {
  if (config == null) {
    return { needUpdate: false };
  }
  const {
    changeLogAndroid,
    changeLogIos,
    currentVersionAndroid,
    currentVersionIos,
    forceUpdateAndroid,
    forceUpdateIos
  } = config;
  const forceUpdate =
    Platform.OS == "android" ? forceUpdateAndroid : forceUpdateIos;
  const currentVersion =
    Platform.OS == "android" ? currentVersionAndroid : currentVersionIos;
  const changeLog =
    Platform.OS == "android" ? changeLogAndroid : changeLogIos;
  const newVersion = _.last(currentVersion.split("."));
  const oldVersion = _.last(DeviceInfo.getReadableVersion().split("."));
  console.log(newVersion, oldVersion);
  if (Number(newVersion) > Number(oldVersion)) {
    return { needUpdate: true, forceUpdate, changeLog, currentVersion };
  } else {
    return { needUpdate: false };
  }
};