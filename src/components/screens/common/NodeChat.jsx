import React from "react";
import { View, Text, Linking, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";

export default function NodeChat({ user_message, bot_message, data, tag }) {
  return (
    <View>
      {
        <View style={globalStyles.messages_user}>
          <View style={globalStyles.messages_userStyle}>
            <Text style={globalStyles.messages_userText}>
              {data[0].message}
            </Text>
          </View>
        </View>
      }
      {
        <View style={globalStyles.messages_bot}>
          <View style={globalStyles.messages_botStyle}>
            {Array.isArray(data[1]?.message) ? (
              data[1]?.message.map((url, i) => (
                <Text
                  key={i}
                  style={{ color: "blue" }}
                  onPress={() => Linking.openURL(url)}
                >
                  {url}
                </Text>
              ))
            ) : (
              <Text style={globalStyles.messages_botText}>
                {data[1]?.message}
              </Text>
            )}
          </View>
        </View>
      }
    </View>
  );
}
