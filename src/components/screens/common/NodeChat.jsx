import React, { useState } from "react";
import {
  View,
  Text,
  Linking,
  FlatList,
  ToastAndroid,
  Image,
  Modal,
  TouchableNativeFeedback,
} from "react-native";
import { globalStyles } from "../../../styles/global";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

export default function NodeChat({ user_message, bot_message, data, tag }) {
  const URL = (str) => {
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

  const copyToClipboard = (str) => {
    Clipboard.setString(str);
    ToastAndroid.show("Đã sao chép tin nhắn 😉", ToastAndroid.SHORT);
    console.log(str);
  };

  const [dialog, setDialog] = useState(null);

  return (
    <View>
      {
        <View style={globalStyles.messages_user}>
          <View style={globalStyles.messages_userStyle}>
            <Text
              style={globalStyles.messages_userText}
              onLongPress={() => copyToClipboard(data[0].message)}
            >
              {data[0].message}
            </Text>
          </View>
        </View>
      }
      {
        <View style={globalStyles.messages_bot}>
          <View style={globalStyles.messages_botStyle}>
            {Array.isArray(data[1]?.message) ? (
              data[1]?.message.map((url, i) =>
                URL(url) ? (
                  <Text
                    onLongPress={() => copyToClipboard(url)}
                    key={i}
                    style={{ color: "blue" }}
                    onPress={() => Linking.openURL(url)}
                  >
                    {url}
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={[
                      globalStyles.messages_botFilmText,
                      {
                        borderBottomWidth:
                          data[1]?.message?.length - 1 !== i ? 1 : 0,
                        marginBottom:
                          data[1]?.message?.length - 1 !== i ? 10 : 0,
                        paddingBottom:
                          data[1]?.message?.length - 1 !== i ? 10 : 0,
                      },
                    ]}
                    onPress={() =>
                      Linking.openURL(`https://www.imdb.com/title/${url[1]}`)
                    }
                  >
                    <Image
                      style={globalStyles.messages_botFilmPoster}
                      source={{
                        uri: `https://img.omdbapi.com/?apikey=ea75cc5f&i=${url[1]}`,
                      }}
                    />
                    <View>
                      <Text style={globalStyles.messages_botText}>
                        {url[0]} ({url[3].split("-")[0]})
                      </Text>
                      {/* // movie title */}
                      {/* <Text style={globalStyles.messages_botText}>{url[1]}</Text> */}
                      {/* // imdb id */}
                      <Text style={globalStyles.messages_botText}>
                        Time (hrs): {url[2]}
                      </Text>
                      {/* // runtime (hrs) */}
                      {/* <Text style={globalStyles.messages_botText}>{url[3]}</Text> */}
                      {/* // release date */}
                      <Text style={globalStyles.messages_botText}>
                        Vote: {url[4]}
                      </Text>
                      {/* // vote average */}
                    </View>
                  </TouchableOpacity>
                )
              )
            ) : data[1]?.image ? (
              <>
                <TouchableOpacity onPress={() => setDialog(0)}>
                  <Image
                    style={globalStyles.messages_botImage}
                    source={{ uri: `data:image/png;base64,${data[1]?.image}` }}
                  />
                </TouchableOpacity>
                <Text
                  style={globalStyles.messages_botText}
                  onLongPress={() => copyToClipboard(data[1]?.message)}
                >
                  {data[1]?.message}
                </Text>
                <Modal visible={dialog !== null} animationType="slide">
                  <TouchableNativeFeedback onPress={() => setDialog(null)}>
                    <MaterialIcons
                      name="cancel"
                      size={30}
                      color="black"
                      style={globalStyles.messages_botImage_modal_closeButton}
                    />
                  </TouchableNativeFeedback>
                  <View style={globalStyles.messages_botImage_modal}>
                    <Image
                      style={globalStyles.messages_botImage_modal}
                      source={
                        dialog !== null
                          ? { uri: `data:image/png;base64,${data[1]?.image}` }
                          : null
                      }
                    />
                  </View>
                </Modal>
              </>
            ) : (
              <Text
                style={globalStyles.messages_botText}
                onLongPress={() => copyToClipboard(data[1]?.message)}
              >
                {data[1]?.message}
              </Text>
            )}
          </View>
        </View>
      }
    </View>
  );
}
