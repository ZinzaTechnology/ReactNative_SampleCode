import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EF7225",
    marginBottom: 10
  },
  btnEdit: {
    height: 30,
    paddingHorizontal: 15,
    backgroundColor: "#EF7225",
    borderRadius: 15,
    marginLeft: 10,
    justifyContent: "center"
  },
  inputEdit:{
    flex: 1,
    fontSize: 16
  },
  editText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold"
  },
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center"
  },
  contentWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  removeBtn: {
    marginRight: 10
  },
  timeWrap: {
    height: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 10
  },
  timeText: {
    fontSize: 14
  },
  content: {
    fontSize: 16,
    flex: 1
  },
  emptyText: {
    textAlign: "center",
    color: "#EF7225",
    fontSize: 14
  },
  textWrap:{
    flex: 1,
    flexDirection: "row"
  }
});

export default styles;
