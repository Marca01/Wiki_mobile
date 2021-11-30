import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  ToastAndroid,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { globalStyles } from "../../styles/global";
import ChatList from "./common/ChatList";
import ChatInput from "./common/ChatInput";
import Header from "./common/Header";
import { getBotMessage, sendImage, sendUserMessage } from "../../api";
import * as ImagePicker from "expo-image-picker";
let nextUserId = 0;
let nextBotId = 50;

export default function Main({ navigation }) {
  const [message, setMessage] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [botMessages, setBotMessages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const handlePickFile = async () => {
    try {
      const rs = await ImagePicker.launchImageLibraryAsync({
        mediaType: "photo",
        allowsEditing: true,
      });
      if (!rs?.cancelled) {
        setFile(rs?.uri);
        ToastAndroid.show(`Đã chọn ảnh và chờ chút 🥳`, ToastAndroid.SHORT);
        console.log(file);
      }
      if (rs?.cancelled) {
        ToastAndroid.show(`Chưa chọn ảnh nhé ⚠️`, ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show(`${error} ⚠️`, ToastAndroid.SHORT);
    }
  };

  const handleSendMessage = (user_message) => {
    const messageData = new FormData();
    messageData.append("msg", user_message);

    sendUserMessage(messageData)
      .then((res) => {
        setMessage("");
        setUserMessages([
          ...userMessages,
          { id: nextUserId++, message: message, tag: "userMessage" },
        ]);
        setBotMessages([
          ...botMessages,
          { id: nextBotId++, message: res.data, tag: "botMessage" },
        ]);
        console.log(...botMessages);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally((rs) => {
        setMessage("");
      });
  };

  const handleSendImageMessage = (user_message) => {
    const [fileName, type] = file.split("/")[11].split(".");
    const messageData = new FormData();
    const imageMessage = new FormData();
    messageData.append("msg", user_message);
    messageData.append("file", {
      uri: file,
      name: `image.${fileName}`,
      type: `image/${type}`,
    });
    sendUserMessage(messageData)
      .then((res) => {
        setMessage("");
      })
      .catch((err) => {
        console.log({ ...err });
        if (err.response.status === 307) {
          if (err.response.config.data._parts[0][1] == ":totext") {
            imageMessage.append("file", {
              uri: file,
              name: `image.${fileName}`,
              type: `image/${type}`,
            });
            sendImage("vie", imageMessage)
              .then((res) => {
                setMessage("");
                setFile(null);
                setUserMessages([
                  ...userMessages,
                  { id: nextUserId++, message: message, tag: "userMessage" },
                ]);
                setBotMessages([
                  ...botMessages,
                  { id: nextBotId++, message: res.data, tag: "botMessage" },
                ]);
              })
              .catch((err) => console.log(err));
          }
          if (err.response.config.data._parts[0][1] == ":totext&eng") {
            imageMessage.append("file", {
              uri: file,
              name: `image.${fileName}`,
              type: `image/${type}`,
            });
            sendImage("eng", imageMessage)
              .then((res) => {
                setMessage("");
                setFile(null);
                setUserMessages([
                  ...userMessages,
                  { id: nextUserId++, message: message, tag: "userMessage" },
                ]);
                setBotMessages([
                  ...botMessages,
                  { id: nextBotId++, message: res.data, tag: "botMessage" },
                ]);
              })
              .catch((err) => console.log(err));
          }
        }
      });
  };
  // useEffect(() => {
  //   if (!!file) {
  //     const [fileName, type] = file.split("/")[11].split(".");
  //     const messageData = new FormData();
  //     messageData.append([
  //       "msg",
  //       ":totext",
  //       "file",
  //       {
  //         name: fileName,
  //         type: `image/${type}`,
  //         uri: file,
  //       },
  //     ]);
  //     sendUserMessage(messageData)
  //       .then((res) => {
  //         setUserMessages([
  //           ...userMessages,
  //           { id: nextUserId++, message: message, tag: "userMessage" },
  //         ]);
  //         setBotMessages([
  //           ...botMessages,
  //           { id: nextBotId++, message: res.data, tag: "botMessage" },
  //         ]);
  //         console.log(...botMessages);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
  //       .finally((rs) => {
  //         setFile();
  //       });
  //   }
  // }, [!!file]);

  return (
    <View style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={8}
      >
        <Header title="Wiki" navigation={navigation} />
        <ChatList user_messages={userMessages} bot_messages={botMessages} />
        <ChatInput
          message={message}
          onChangeText={(message) => setMessage(message)}
          onPress={
            file
              ? () => handleSendImageMessage(message)
              : () => handleSendMessage(message)
          }
          onPressFile={handlePickFile}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
