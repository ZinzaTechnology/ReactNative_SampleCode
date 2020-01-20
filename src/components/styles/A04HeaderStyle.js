import { StyleSheet } from "react-native";
export default StyleSheet.create({
  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold"
  },
  icon: {
    bottom: 6,
    marginRight: 5
  },
  titleWrap: {
    flex: 1,
    height: 40,
    justifyContent: "center"
  },
  header: {
    flexDirection: "row"
  },
  search: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black"
  },
  btn: {
    padding: 10
  },
  input: {
    paddingVertical: 7,
    paddingRight: 7,
    paddingLeft: 30,
    fontSize: 16,
    backgroundColor: "#EEEFF0",
    borderRadius: 10
  },
  inputWrap: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#A9A9A9"
  },
  iconSearch: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 20,
    zIndex: 99,
    justifyContent: "center",
    alignItems: "center"
  }
});
