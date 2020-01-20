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
  author: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold"
  },
  length: {
    color: "#999999",
    fontSize: 14
  },
  language: {
    color: "#999999",
    fontSize: 14,
    textAlign: "right"
  },
  desciption: {
    marginTop: 10,
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
    paddingTop: 15
  },
  separator: {
    height: 1,
    backgroundColor: "#999999",
    marginTop: 15
  },
  emptyText: {
    textAlign: "center",
    color: "#EF7225",
    fontSize: 14
  },
  downloadWrap: {
    justifyContent: "center",
    alignItems: "center",
    width: 150
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
  downloadText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "white"
  },
  downloadingText: {
    fontSize: 14,
    fontStyle: "italic"
  },
  downloadedText: {
    fontSize: 14
  }
});
