import React from "react";
import { View, Text, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";
import NodeChat from "./NodeChat";

export default function ChatList({ user_messages, bot_messages }) {
  const zip = (arrays) => {
    return arrays[0].map(function (_, i) {
      return arrays.map(function (array) {
        return array[i];
      });
    });
  };

  const messages = zip([user_messages, bot_messages]);

  return (
    <View style={globalStyles.messages}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <NodeChat data={item} />}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      ></FlatList>
    </View>
  );
}
