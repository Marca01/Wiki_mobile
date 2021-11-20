import React from "react";
import { View, Text, Linking, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";

export default function NodeChat({ user_message, bot_message, data, tag }) {
  return (
    <View>
      {
        <View style={globalStyles.messages_user}>
          <View style={globalStyles.messages_userStyle}>
            <Text style={globalStyles.messages_userText}>{data[0].message}</Text>
          </View>
        </View>
      }
      {
        <View style={globalStyles.messages_bot}>
          <View style={globalStyles.messages_botStyle}>
            {data[1]?.message.replace(/\[|\]/g, "").split(",").length > 1 ? (
              data[1]?.message
                .replace(/\[|\]/g, "")
                .split(",")
                .map((url, i) => (
                  <Text key={i} style={{ color: "blue" }} onPress={() => Linking.openURL(JSON.parse(url.replace(/'/g, '"')))}>
                    {JSON.parse(url.replace(/'/g, '"'))}
                  </Text>
                ))
            ) : (
              <Text style={globalStyles.messages_botText}>{data[1]?.message}</Text>
            )}
          </View>
        </View>
      }
    </View>
  );
}
