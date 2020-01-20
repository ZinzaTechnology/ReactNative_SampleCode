import { StyleSheet } from "react-native";
export default StyleSheet.create({
  timePlaying: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    bottom: 25
  },
  largeThumbStyles: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "white",
    borderColor: "#EF7225",
    borderWidth: 5
  },
  timeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#AAADAE"
  }
});
