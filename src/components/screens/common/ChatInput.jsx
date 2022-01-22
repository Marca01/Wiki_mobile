import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { globalStyles } from "../../../styles/global";
import { Feather } from "@expo/vector-icons";
import { KeyboardAccessoryView } from "@flyerhq/react-native-keyboard-accessory-view";
import { sendNewsCategory } from "../../../api";

export default function ChatInput({
  message,
  botMessages,
  onChangeText,
  onPress,
  onPressFile,
  newsCat,
  handleSendNewsCat,
}) {
  // // news categories
  // const NEWS_CAT = [
  //   {
  //     id: 1,
  //     cat: "Trang chủ",
  //   },
  //   {
  //     id: 2,
  //     cat: "Thế giới",
  //   },
  //   {
  //     id: 3,
  //     cat: "Thời sự",
  //   },
  //   {
  //     id: 4,
  //     cat: "Kinh doanh",
  //   },
  //   {
  //     id: 5,
  //     cat: "Startup",
  //   },
  //   {
  //     id: 6,
  //     cat: "Giải trí",
  //   },
  //   {
  //     id: 7,
  //     cat: "Thể thao",
  //   },
  //   {
  //     id: 8,
  //     cat: "Pháp luật",
  //   },
  //   {
  //     id: 9,
  //     cat: "Giáo dục",
  //   },
  //   {
  //     id: 10,
  //     cat: "Tin mới nhất",
  //   },
  //   {
  //     id: 11,
  //     cat: "Tin nổi bật",
  //   },
  //   {
  //     id: 12,
  //     cat: "Sức khỏe",
  //   },
  //   {
  //     id: 13,
  //     cat: "Đời sống",
  //   },
  //   {
  //     id: 14,
  //     cat: "Du lịch",
  //   },
  //   {
  //     id: 15,
  //     cat: "Khoa học",
  //   },
  //   {
  //     id: 16,
  //     cat: "Số hóa",
  //   },
  //   {
  //     id: 17,
  //     cat: "Xe",
  //   },
  //   {
  //     id: 18,
  //     cat: "Ý kiến",
  //   },
  //   {
  //     id: 19,
  //     cat: "Tâm sự",
  //   },
  //   {
  //     id: 20,
  //     cat: "Cười",
  //   },
  //   {
  //     id: 21,
  //     cat: "Tin xem nhiều",
  //   },
  // ];

  const renderNone = () => <></>;

  // const [news, setNews] = useState("");

  // const handleSendNewsCat = (category) => {
  //   const categoryData = new FormData();
  //   categoryData.append("news_cat", category);

  //   sendNewsCategory(categoryData)
  //     .then((res) => {
  //       setNews({
  //         // id: botMessages.map((messId) => messId.id++),
  //         message: res.data,
  //         tag: "botMessage",
  //       });
  //       console.log(news);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <>
      <KeyboardAccessoryView
        renderScrollable={renderNone}
        scrollableContainerStyle={{
          // backgroundColor: "blue",
          flex: 0,
        }}
        contentOffsetKeyboardClosed={-100}
      >
        {botMessages[botMessages?.length - 1]?.message.indexOf("👇") > -1 && (
          <View
            style={{
              marginTop: 36,
              // backgroundColor: "red",
            }}
          >
            <FlatList
              data={newsCat}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    backgroundColor: "#CDEDF6",
                    borderRadius: 12,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginBottom: 80,
                    marginRight: 5,
                    flex: 1,
                  }}
                  // onPress={() => handleSendNewsCat(item.cat)}
                  onPress={() => handleSendNewsCat(item.cat)}
                >
                  <Text>{item.cat}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </KeyboardAccessoryView>
      <View style={globalStyles.textInput}>
        <TouchableOpacity style={globalStyles.textInputMessageContainer}>
          <TouchableOpacity onPress={onPressFile}>
            <Feather name="image" size={24} color="gray" />
          </TouchableOpacity>
          <TextInput
            value={message}
            onChangeText={onChangeText}
            placeholder="Cho wiki biết bạn đang nghĩ gì nè..."
            multiline
            style={globalStyles.textInput_message}
          />
          <TouchableOpacity onPress={onPress} disabled={!message}>
            <Feather name="send" size={24} color={!message ? "gray" : "blue"} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </>
  );
}
