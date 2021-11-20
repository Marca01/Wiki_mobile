import React, { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import AppNavigation from "./src/navigation/AppNavigation";
import { StatusBar } from "expo-status-bar";
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from "@react-native-voice/voice";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <AppNavigation />
    </NavigationContainer>
  );
}
