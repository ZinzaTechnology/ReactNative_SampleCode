import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  tabContainer: {
    height: 40,
    borderRadius: 25,
    overflow: "hidden",
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 30
  },
  tabWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  tabText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14
  }
});
export default styles;
