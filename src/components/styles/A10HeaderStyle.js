import { StyleSheet } from "react-native";
export default StyleSheet.create({
  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  search: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    flex: 1
  },
  btn: {
    paddingLeft: 10,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    zIndex: 99,
    width: 100
  },
  headerWrap: {
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 5,
    bottom: 3
  }
});
