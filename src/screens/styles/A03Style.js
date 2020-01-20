import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  textHeader: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
    paddingHorizontal: 10,
    marginTop: 10
  },
  itemWrapper: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "50%",
    alignSelf: "flex-start"
  },
  itemTouch: {
    backgroundColor: "white",
    borderRadius: 10,
    // height: 260,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  contentWrap: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    width: "100%",
    flex: 1
  },
  imgWrap: {
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.4
  },
  mainImage: {
    width: "100%",
    height: 170,
    borderRadius: 5
  },
  bookName: {
    alignSelf: "center",
    marginVertical: 7,
    color: "black",
    fontWeight: "bold",
    fontSize: 14
  },
  readPercent: {
    color: "#B0B0B0",
    fontWeight: "bold",
    fontSize: 14
  },
  processWrap: {
    height: 2,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#B0B0B0",
    borderRadius: 1
  }
});
