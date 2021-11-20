import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, ScrollView, FlatList } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { globalStyles } from "../../styles/global";
import ChatList from "./common/ChatList";
import ChatInput from "./common/ChatInput";
import Header from "./common/Header";
import { getBotMessage, sendUserMessage } from "../../api";

let nextUserId = 0;
let nextBotId = 50;

export default function Main({ navigation }) {
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);

  const handleSendMessage = user_message => {
    const messageData = new FormData();
    messageData.append("msg", user_message);

    sendUserMessage(messageData)
      .then(res => {
        setMessage("");
        setUserMessages([...userMessages, { id: nextUserId++, message: message, tag: "userMessage" }]);
        setBotMessages([...botMessages, { id: nextBotId++, message: res.data, tag: "botMessage" }]);
        console.log(...botMessages);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={globalStyles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }} keyboardVerticalOffset={8}>
        <Header title="Wiki" navigation={navigation} />
        <ChatList user_messages={userMessages} bot_messages={botMessages} />
        <ChatInput message={message} onChangeText={message => setMessage(message)} onPress={() => handleSendMessage(message)} />
      </KeyboardAvoidingView>
    </View>
  );
}
