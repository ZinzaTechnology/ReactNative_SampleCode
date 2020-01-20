import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    tabLabel: {
        fontSize: 16,
        color: "black",
        flex: 1,
        marginLeft: 10
    },
    tabWrapper: {
        height: 70,
        paddingHorizontal: 20,
        borderBottomColor: "#A9A9A9",
        borderBottomWidth: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    version: {
        textAlign: "center",
        fontSize: 14,
        color: "black"
    },
    iconWrap: {
        width: 30,
        justifyContent: "center",
        alignItems: "center"
    }
})
export default styles
