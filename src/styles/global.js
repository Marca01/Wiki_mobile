import React from "react";
import { View, Text, Dimensions, StyleSheet, StatusBar } from "react-native";
import color from "../constants/color";

let height = Dimensions.get("window").height;
let width = Dimensions.get("window").width;
let statusBarHeight = StatusBar.currentHeight;

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F1F2F6",
        paddingHorizontal: 15,
        marginTop: statusBarHeight
    },

    // =================================================================
    // Main.jsx

    messages: {
        flex: 1,
        // backgroundColor: 'grey',
        flexDirection: "row"
    },
    messages_user: {
        alignSelf: "flex-end",
        marginLeft: 100
    },
    messages_userStyle: {
        backgroundColor: "#4173FF",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 3
    },
    messages_userText_link: {
        color: 'white',
        textDecorationLine: 'underline',
        paddingBottom: 5,

    },
    messages_userText: {
        color: "white"
    },
    messages_bot: {
        alignSelf: "flex-start",
        marginTop: 10,
        marginRight: 100,
    },
    messages_botStyle: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 3,
        zIndex: 100
    },
    messages_botFilmText: {
        // backgroundColor: "aqua",
        // marginBottom: 10,
        // paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#d0d0d0",
        flexDirection: "row",
        alignItems: "center"
    },
    messages_botFilmPoster: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 8
    },
    messages_botImage: {
        width: 300,
        height: 150,
        marginBottom: 10,
        borderRadius: 20
    },
    messages_botText: {
        color: "black",
    },
    messages_botImage_modal_closeButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        zIndex: 100,
        paddingRight: 20
    },
    messages_botImage_modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    messages_botImage_modal: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    message_botText_icon: {
        width: 35,
        height: 35,
        backgroundColor: "red"
    },
    message_botText_shortLink_div: {
        alignItems: "center",
    },
    message_botText_shortLink: {
        color: "blue",
        textDecorationLine: "underline",
        paddingBottom: 5,
    },
    textInput: {
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "center"
            // paddingHorizontal: 20
    },
    textInputMessageContainer: {
        backgroundColor: "white",
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop: 6,
        width: width - 30
    },
    textInput_message: {
        // height: 40,
        marginLeft: 5,
        flex: 1,
        // paddingVertical: 10,
        fontSize: 16,
        fontWeight: "600"
    },

    // =================================================================
    // Header.jsx
    header: {
        // backgroundColor: 'red'
    },
    headerDiv: {
        paddingVertical: 15,
        marginTop: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    header_backIcon: {
        marginLeft: -10,
        marginRight: 8
    },
    headerTitle: {
        flexDirection: "row"
    },
    headerTitle_title: {
        fontSize: 24,
        fontWeight: "bold"
    },
    headerRight: {},
    header_questionIcon: {
        padding: 2
    },

    // =================================================================
    // Guide.jsx
    guideHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    guideHeader_title: {
        marginVertical: 25
    },
    guideFeature_header: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 5
    },
    guideFeature: {},
    guideFeature_title: {
        fontSize: 18,
        marginTop: 12,
        marginBottom: 8,
        paddingBottom: 10,
        fontWeight: "bold",
        color: "#141414",
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0"
    },
    guideFeature_body: {
        color: "#404040"
    },
    guideFeature_syntax: {},
    guideFeature_description: {},

    // =================================================================
    // Webview.jsx
    webview: {
        flex: 1
    },
    webview_header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 25,
        paddingLeft: 20
    },
    webview_header_backIcon: {
        marginLeft: -10,
        marginRight: 8
    },

    // test style
    testStyle: {
        backgroundColor: "gray",
        flex: 1,
        height: height
    }
});