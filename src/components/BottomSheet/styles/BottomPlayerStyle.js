import { StyleSheet, Platform } from "react-native";
export default StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    height: 120,
    marginBottom: 3
  },
  mainImage: {
    height: 120,
    width: 80
  },
  mainPlayer: {
    flex: 1,
    padding: 15
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10
  },
  player: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center"
  },
  progressBar: {
    flexDirection: "row",
    height: 3
  },
  showMore: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  playerGroup: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  timer: {
    width: 70,
    justifyContent: "center"
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden"
  },
  linearGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  absolute: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center"
  },
  absoluteText: {
    fontSize: 12,
    color: "#EF7225",
    bottom: Platform.OS == "ios" ? 2 : 0
  },
  timeText: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold"
  },

  playerGroup1: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  absoluteText1: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EF7225",
    bottom: Platform.OS == "ios" ? 2 : 0
  },
  playBtn1: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden"
  },
  
});
