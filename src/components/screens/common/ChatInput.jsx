import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { globalStyles } from "../../../styles/global";

export default function ChatInput({ message, onChangeText, onPress }) {
  return (
    <View style={globalStyles.textInput}>
      <TouchableOpacity style={globalStyles.textInputMessageContainer}>
        <TextInput
          value={message}
          onChangeText={onChangeText}
          placeholder="Say something..."
          multiline
          style={globalStyles.textInput_message}
        />
        {message ? (
          <TouchableOpacity onPress={onPress}>
            <Text>Send</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity disabled>
            <Text>Send</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}
