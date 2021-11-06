import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Welcome({ navigation }) {
  return (
    <View>
      <Text>Welcome to wiki chatbot</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Main")}>
        <Text>Let's talk</Text>
      </TouchableOpacity>
    </View>
  );
}
