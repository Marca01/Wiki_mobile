import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from "@react-native-voice/voice";

export default function Welcome({ navigation }) {
  // const [results, setResults] = useState([]);
  // const [isListening, setIsListening] = useState(false);
  // useEffect(() => {
  //   function onSpeechResults(e) {
  //     setResults(e.value ?? []);
  //     console.log(e);
  //   }
  //   function onSpeechError(e) {
  //     console.log(e);
  //   }
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;
  //   Voice.start("en-US");
  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);
  // async function toggleListening() {
  //   try {
  //     if (isListening) {
  //       await Voice.stop();
  //       setIsListening(false);
  //     } else {
  //       setResults([]);
  //       await Voice.start("en-US");
  //       setIsListening(true);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }
  // useEffect(() => {
  //   toggleListening();
  // }, []);
  // console.log(results);
  return (
    <View>
      <Image resizeMode="contain" style={{ width: width, height: height }} source={require("../../../../assets/5.png")} />
      <TouchableOpacity style={styles.pr} onPress={() => navigation.navigate("Main")}>
        <Text style={styles.title}>{"Let's talk".toUpperCase()}</Text>
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
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 3,
    color: "#FFF",
    marginRight: 20
  }
});
