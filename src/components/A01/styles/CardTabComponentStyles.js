import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  signupBtn: {
    backgroundColor: "#EF7225"
  },
  btn: {
    width: "60%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "black"
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  imageBtn: {
    flexDirection: "row",
    backgroundColor: "black",
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1
  },
  textImageBtn: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5
  },
  imageWrapper: {
    height: 200,
    marginBottom: 10
  },
  image: {
    width: "100%",
    height: "100%"
  },
  imgPickWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  label: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    fontStyle: "italic",
    marginRight: 10
  },
  imageEdit: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(256, 256, 256, 0.5)'
  }
});
export default styles;
