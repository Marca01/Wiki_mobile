import React, { useCallback } from "react";
import { View, Text, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";
import NodeChat from "./NodeChat";

export default function ChatList({ user_messages, bot_messages, navigation }) {
  const zip = (arrays) => {
    return arrays[0].map(function (_, i) {
      return arrays.map(function (array) {
        return array[i];
      });
    });
  };

  const messages = zip([user_messages, bot_messages]);

  const renderItem = useCallback(
    ({ item }) => <NodeChat data={item} navigation={navigation} />,
    []
  );
  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={globalStyles.messages}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        inverted
        contentContainerStyle={{ flexDirection: "column-reverse" }}
      />
    </View>
  );
}
