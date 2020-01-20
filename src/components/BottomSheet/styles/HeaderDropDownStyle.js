import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
export default StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: 50,
    width,
    zIndex: 99
  },
  handlerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    alignSelf: "center",
    height: 50,
    width,
    justifyContent: "center",
    flexDirection: "row"
  },
  handlerBar: {
    position: "absolute",
    backgroundColor: "#D1D1D6",
    top: 5,
    borderRadius: 3,
    height: 5,
    width: 20
  }
});
