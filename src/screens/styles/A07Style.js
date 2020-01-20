import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1
  },
  textHeader: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "#F6F9FA",
    paddingVertical: 5,
    paddingHorizontal: 15
  },
  bookName: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold"
  },
  chapter: {
    marginTop: 5,
    color: "black",
    fontSize: 14,
    fontWeight: "bold"
  },
  length: {
    color: "#999999",
    fontSize: 14
  },
  desciption: {
    color: "black",
    fontSize: 14
  },
  separator: {
    height: 10,
    width: "100%",
    backgroundColor: "black"
  },
  itemWrap: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingTop: 15,
    flexDirection: "row",
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: "#999999",
    marginTop: 15
  },
  downloadText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white"
  },
  btnDownload: {
    height: 36,
    borderRadius: 18,
    marginVertical: 20,
    overflow: "hidden"
  },
  linearGradient: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  time: {
    width: 100,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    paddingTop: 5
  },
  latestListen: {
    color: "#999999",
    fontSize: 14,
    textAlign: "right"
  },
  emptyText: {
    textAlign: "center",
    color: "#EF7225",
    fontSize: 14
  }
});
