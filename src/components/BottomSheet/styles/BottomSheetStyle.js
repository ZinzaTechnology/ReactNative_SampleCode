import { StyleSheet, Dimensions } from "react-native";
export default StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    height: Dimensions.get("window").height,
    overflow: "visible",
    backgroundColor: "#EF7225"
  },
  largeThumbStyles: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: "white",
    borderColor: "#EF7225",
    borderWidth: 5
  },
  alarm: {
    borderWidth: 0,
    borderRadius: 23,
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    backgroundColor: "white"
  },
  submitWrap: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10
  },
  submitBtn: { borderRadius: 20, overflow: "hidden" },
  linear: {
    paddingHorizontal: 10,
    height: 40,
    width: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  modalTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 20
  },
  modalContainer: {
    padding: 20
  },
  switchBtn: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "#EF7225",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  switchText: {
    color: "black",
    fontSize: 14,
    marginLeft: 5
  },
  bookmarkContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#EFEFEF"
  }
});
