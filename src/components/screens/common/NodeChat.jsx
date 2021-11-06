import React from "react";
import { View, Text, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";

export default function NodeChat({ user_message, bot_message, data, tag }) {
  return (
    <View>
      {data?.map((message) => message?.tag === "userMessage") && (
        <View style={globalStyles.messages_user}>
          <View style={globalStyles.messages_userStyle}>
            <Text style={globalStyles.messages_userText}>
              {data?.map((message) => message?.message)[0]}
            </Text>
          </View>
        </View>
      )}
      {data?.map((message) => message?.tag === "botMessage") && (
        <View style={globalStyles.messages_bot}>
          <View style={globalStyles.messages_botStyle}>
            <Text style={globalStyles.messages_botText}>
              {data?.map((message) => message?.message)[1]}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
