import React from "react";
import { View, Text, Linking, FlatList } from "react-native";
import { globalStyles } from "../../../styles/global";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function NodeChat({ user_message, bot_message, data, tag }) {
  const URL = str => {
    let pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return pattern.test(str);
  };
  const copyToClipborad = str => {
    Clipboard.setString(str);
    console.log(str);
  };
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
            {Array.isArray(data[1]?.message) ? (
              data[1]?.message.map((url, i) =>
                URL(url) ? (
                  <Text onLongPress={() => copyToClipborad(data[0].message)} key={i} style={{ color: "blue" }} onPress={() => Linking.openURL(url)}>
                    {url}
                  </Text>
                ) : (
                  <Text style={globalStyles.messages_botText}>{url}</Text>
                )
              )
            ) : (
              <Text style={globalStyles.messages_botText}>{data[1]?.message}</Text>
            )}
          </View>
        </View>
      }
    </View>
  );
}
