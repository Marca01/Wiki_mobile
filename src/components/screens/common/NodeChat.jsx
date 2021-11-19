import React from "react";
import { View, Text, Linking, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";
import { WebView } from "react-native-webview";

export default function NodeChat({ user_message, bot_message, data, tag }) {
  console.log(data[1]?.message.replace(/\[|\]/g, "").split(","));
  return (
    <View>
      {data?.map(message => message?.tag === "userMessage") && (
        <View style={globalStyles.messages_user}>
          <View style={globalStyles.messages_userStyle}>
            <Text style={globalStyles.messages_userText}>{data?.map(message => message?.message)[0]}</Text>
          </View>
        </View>
      )}
      {data?.map(message => message?.tag === "botMessage") && (
        <View style={globalStyles.messages_bot}>
          <View style={globalStyles.messages_botStyle}>
            {data[1]?.message.replace(/\[|\]/g, "").split(",").length > 1 ? (
              data[1]?.message
                .replace(/\[|\]/g, "")
                .split(",")
                .map((url, i) => (
                  <Text style={{ color: "blue" }} onPress={() => Linking.openURL(JSON.parse(url.replace(/'/g, '"')))}>
                    {JSON.parse(url.replace(/'/g, '"'))}
                  </Text>
                ))
            ) : (
              <Text style={globalStyles.messages_botText}>{data?.map(message => message?.message)[1]}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
