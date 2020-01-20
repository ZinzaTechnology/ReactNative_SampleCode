import { StyleSheet } from "react-native";
export default StyleSheet.create({
  topWrap: {
    flexDirection: "row",
    padding: 45,
    backgroundColor: "#F6F9FB"
  },
  mainImage: {
    width: "100%",
    height: "100%"
  },
  imageWrap: {
    flex: 2,
    height: 150,
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.6
  },
  content: {
    flex: 3,
    paddingLeft: 30
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black"
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  normal: {
    fontSize: 13,
    color: "black"
  },
  chapters: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "#E1E7ED",
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  item: {
    borderBottomWidth: 2,
    borderBottomColor: "#BDBDC4"
  },
  rowWrap: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 15
  },
  playBtn: {
    backgroundColor: "#EF7225",
    height: 28,
    width: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15
  },
  onPlay: {
    height: 28,
    width: 28
  },
  timeLeft: {
    color: "#606060",
    fontSize: 10
  },
  chapterTit: {
    color: "black",
    fontSize: 14
  },
  percent: {
    color: "#626262",
    fontSize: 16,
    marginRight: 15
  },
  bottomPlay: {
    height: 2,
    bottom: -2,
    backgroundColor: "#EF7225"
  },
  downloadText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white"
  },
  btnDownload: {
    height: 36,
    borderRadius: 18,
    overflow: "hidden"
  },
  linearGradient: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyText: {
    textAlign: "center",
    color: "#EF7225",
    fontSize: 14
  }
});
