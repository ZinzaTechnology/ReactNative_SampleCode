import { StyleSheet } from "react-native";
import { Header } from "react-navigation";
export default StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
    fontWeight: "bold"
  },
  titleWrap: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 100
  },
  search: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  btn: {
    padding: 10
  },
  header: {
    flexDirection: "row",
    borderBottomColor: "#A9A9A9",
    borderBottomWidth: 1,
    height: Header.HEIGHT,
    alignItems: "center"
  }
});
