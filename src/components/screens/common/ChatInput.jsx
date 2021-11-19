import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Feather } from "@expo/vector-icons";
export default function ChatInput({ message, onChangeText, onPress }) {
  return (
    <View style={globalStyles.textInput}>
      <TouchableOpacity style={globalStyles.textInputMessageContainer}>
        <TextInput value={message} onChangeText={onChangeText} placeholder="Say something..." multiline style={globalStyles.textInput_message} />
        <TouchableOpacity onPress={onPress} disabled={!message}>
          <Feather name="send" size={24} color={!message ? "gray" : "blue"} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
