import React from "react";
import { View, Text, Dimensions, StyleSheet, StatusBar } from "react-native";
import color from "../constants/color";

let height = Dimensions.get("window").height;
let width = Dimensions.get("window").width;
let statusBarHeight = StatusBar.currentHeight;

export const globalStyles = StyleSheet.create({
  // =================================================================
  // Main.jsx
  container: {
    flex: 1,
    backgroundColor: "#F1F2F6",
    paddingHorizontal: 15,
    marginTop: statusBarHeight
  },
  messages: {
    flex: 1,
    // backgroundColor: 'grey',
    flexDirection: "row"
  },
  messages_user: {
    alignSelf: "flex-end"
  },
  messages_userStyle: {
    backgroundColor: "#4173FF",
    borderRadius: 50,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 3
  },
  messages_userText: {
    color: "white"
  },
  messages_bot: {
    alignSelf: "flex-start",
    marginTop: 10
  },
  messages_botStyle: {
    backgroundColor: "#e3e3e3",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 3
  },
  messages_botText: {
    color: "black"
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
    marginTop: 30,
    paddingHorizontal: 10,
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
    fontSize: 39,
    fontWeight: "bold"
  },

  // test style
  testStyle: {
    backgroundColor: "gray",
    flex: 1,
    height: height
  }
});
