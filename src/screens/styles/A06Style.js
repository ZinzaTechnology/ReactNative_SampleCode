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
    fontWeight: "bold",
    marginBottom: 5
  },
  sectionName: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5
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
  bookmarkWrap: {
    flexDirection: "row",
    marginLeft: 20,
    paddingVertical: 5
  },
  bookmarkMess: {
    flex: 1,
    paddingRight: 10
  },
  sectionWrap: {
    marginLeft: 20
  },
  time: { 
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
