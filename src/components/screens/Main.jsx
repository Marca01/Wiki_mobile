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
import {
  getBotMessage,
  sendImage,
  sendNewsCategory,
  sendUserMessage,
} from "../../api";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAccessoryView } from "@flyerhq/react-native-keyboard-accessory-view";
import { SafeAreaProvider } from "react-native-safe-area-context";
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
        console.log(botMessages);
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
    file &&
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
            file &&
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
                  {
                    id: nextBotId++,
                    message: res.data.text,
                    image: res.data.image,
                    tag: "botMessage",
                  },
                ]);
              })
              .catch((err) => console.log(err));
          }
          if (err.response.config.data._parts[0][1] == ":totext&eng") {
            file &&
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
                  {
                    id: nextBotId++,
                    message: res.data.text,
                    image: res.data.image,
                    tag: "botMessage",
                  },
                ]);
              })
              .catch((err) => console.log(err));
          }
        }
      });
  };

  // news categories
  const NEWS_CAT = [
    {
      id: 1,
      cat: "Trang chủ",
    },
    {
      id: 2,
      cat: "Thế giới",
    },
    {
      id: 3,
      cat: "Thời sự",
    },
    {
      id: 4,
      cat: "Kinh doanh",
    },
    {
      id: 5,
      cat: "Startup",
    },
    {
      id: 6,
      cat: "Giải trí",
    },
    {
      id: 7,
      cat: "Thể thao",
    },
    {
      id: 8,
      cat: "Pháp luật",
    },
    {
      id: 9,
      cat: "Giáo dục",
    },
    {
      id: 10,
      cat: "Tin mới nhất",
    },
    {
      id: 11,
      cat: "Tin nổi bật",
    },
    {
      id: 12,
      cat: "Sức khỏe",
    },
    {
      id: 13,
      cat: "Đời sống",
    },
    {
      id: 14,
      cat: "Du lịch",
    },
    {
      id: 15,
      cat: "Khoa học",
    },
    {
      id: 16,
      cat: "Số hóa",
    },
    {
      id: 17,
      cat: "Xe",
    },
    {
      id: 18,
      cat: "Ý kiến",
    },
    {
      id: 19,
      cat: "Tâm sự",
    },
    {
      id: 20,
      cat: "Cười",
    },
    {
      id: 21,
      cat: "Tin xem nhiều",
    },
  ];

  const renderNone = () => <></>;

  const [news, setNews] = useState("");

  const handleSendNewsCat = (category) => {
    const categoryData = new FormData();
    categoryData.append("news_cat", category);

    sendNewsCategory(categoryData)
      .then((res) => {
        // setNews({
        //   id: botMessages.map((messId) => messId.id++),
        //   message: res.data,
        //   tag: "botMessage",
        // });
        setUserMessages([
          ...userMessages,
          { id: nextUserId++, message: category, tag: "userMessage" },
        ]);
        setBotMessages([
          ...botMessages,
          { id: nextBotId++, message: res.data, tag: "botMessage" },
        ]);
        console.log(news);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={globalStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={8}
      >
        <SafeAreaProvider>
          <Header title="Wiki" navigation={navigation} />
          <ChatList
            user_messages={userMessages}
            bot_messages={botMessages}
            navigation={navigation}
          />
          <ChatInput
            message={message}
            botMessages={botMessages}
            onChangeText={(message) => setMessage(message)}
            onPress={
              file
                ? () => handleSendImageMessage(message)
                : () => handleSendMessage(message)
            }
            onPressFile={handlePickFile}
            newsCat={NEWS_CAT}
            handleSendNewsCat={handleSendNewsCat}
          />
        </SafeAreaProvider>
      </KeyboardAvoidingView>
    </View>
  );
}
