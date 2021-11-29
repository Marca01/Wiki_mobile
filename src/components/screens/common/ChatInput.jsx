import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { globalStyles } from "../../../styles/global";
import { Feather } from "@expo/vector-icons";
export default function ChatInput({ message, onChangeText, onPress, onPressFile }) {
  return (
    <View style={globalStyles.textInput}>
      <TouchableOpacity style={globalStyles.textInputMessageContainer}>
        <TouchableOpacity onPress={onPressFile}>
          <Feather name="image" size={24} color="gray" />
        </TouchableOpacity>
        <TextInput
          value={message}
          onChangeText={onChangeText}
          placeholder="Cho wiki biết bạn đang nghĩ gì nè..."
          multiline
          style={globalStyles.textInput_message}
        />
        <TouchableOpacity onPress={onPress} disabled={!message}>
          <Feather name="send" size={24} color={!message ? "gray" : "blue"} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
