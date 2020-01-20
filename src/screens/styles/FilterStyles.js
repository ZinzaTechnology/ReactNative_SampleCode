import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  filterItem: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#A9A9A9",
    flexDirection: "row",
    alignItems: "center"
  },
  filterText: {
    fontSize: 14,
    color: "black",
    flex: 1
  },
  emptyText: {
    textAlign: "center",
    color: "#EF7225",
    fontSize: 14
  }
});
export default styles;
