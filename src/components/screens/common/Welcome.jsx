import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

export default function Welcome({ navigation }) {
  return (
    <View>
      <Image
        resizeMode="contain"
        style={{ width: width, height: height }}
        source={require("../../../../assets/5.png")}
      />
      <TouchableOpacity
        style={styles.pr}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.title}>{"Let's chat".toUpperCase()}</Text>
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pr: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4173FF",
    borderRadius: 50,
    paddingLeft: 30,
    paddingRight: 20,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 3,
    color: "#FFF",
    marginRight: 20,
  },
});
