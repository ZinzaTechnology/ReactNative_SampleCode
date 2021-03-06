import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60
  },
  logo: {
    width: "100%",
    height: 200,
    alignSelf: "center"
  },
  form: {
    paddingHorizontal: 40,
    width: "100%"
  },
  loginBtn: {
    backgroundColor: "#EF7225",
    marginTop: 20,
    marginBottom: 15,
  },
  signupBtn: {
    backgroundColor: "black"
  },
  btn: {
    width: "60%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20
  },
  textButton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  link: {
    fontSize: 14,
    color: "black",
    marginTop: 20,
    fontWeight: "bold",
    textDecorationLine: "underline"
  }
});
export default styles;
