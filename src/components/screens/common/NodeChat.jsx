import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Linking,
  FlatList,
  ToastAndroid,
  Image,
  Modal,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import { globalStyles } from "../../../styles/global";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import RNUrlPreview from "react-native-url-preview";
import * as WebBrowser from "expo-web-browser";
import * as Font from "expo-font";

export default function NodeChat({
  user_message,
  bot_message,
  data,
  tag,
  navigation,
}) {
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

  const textContainUrl = (str) => {
    return str.match(/(https?:\/\/[^ ]*)/)[1].replace(",", "");
  };

  const splitText = (str) => {
    let text_split = str.split(textContainUrl(str));
    return text_split;
  };

  const copyToClipboard = (str) => {
    Clipboard.setString(str);
    ToastAndroid.show("Đã sao chép tin nhắn 😉", ToastAndroid.SHORT);
    console.log(str);
  };

  const [dialog, setDialog] = useState(null);
  const [result, setResult] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const handlePressButtonAsync = async (url) => {
    let result = await WebBrowser.openBrowserAsync(url);
    setResult(result);
  };

  // font for links
  let customFonts = {
    Helvetica: require("../../../../assets/fonts/Helvetica.ttf"),
  };

  const loadFontsAsync = async () => {
    await Font.loadAsync(customFonts);
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFontsAsync();
  });

  return (
    <View>
      {
        <View style={globalStyles.messages_user}>
          <View style={globalStyles.messages_userStyle}>
            {URL(data[0].message) ? (
              fontsLoaded && (
                <>
                  <TouchableOpacity
                    style={globalStyles.message_botText_shortLink_div}
                  >
                    <Text
                      style={globalStyles.messages_userText_link}
                      onLongPress={() => copyToClipboard(data[0].message)}
                      onPress={() => handlePressButtonAsync(data[0].message)}
                    >
                      {data[0].message}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onLongPress={() => copyToClipboard(data[0]?.message)}
                    onPress={() => handlePressButtonAsync(data[0]?.message)}
                  >
                    <RNUrlPreview
                      text={data[0]?.message}
                      titleStyle={{
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                      containerStyle={{
                        flexDirection: "column",
                        height: 250,
                        width: 200,
                        backgroundColor: "#f7f7f8",
                        borderRadius: 20,
                        // justifyContent: 'center',
                        alignItems: "center",
                        // padding: 20
                      }}
                      imageStyle={{
                        width: 200,
                        height: 150,
                        borderRadius: 20,
                        marginBottom: 3,
                        resizeMode: "cover",
                        // backgroundColor: 'red'
                      }}
                      textContainerStyle={{
                        padding: 10,
                        // justifyContent: 'center',
                        // alignItems: 'center'
                      }}
                    />
                  </TouchableOpacity>
                </>
              )
            ) : (
              <Text
                style={globalStyles.messages_userText}
                onLongPress={() => copyToClipboard(data[0].message)}
              >
                {data[0].message}
              </Text>
            )}
          </View>
        </View>
      }
      {
        <View style={globalStyles.messages_bot}>
          <View style={globalStyles.messages_botStyle}>
            {Array.isArray(data[1]?.message) ? (
              data[1]?.message.map((url, i) =>
                URL(url) ? (
                  i === 0 ? (
                    <TouchableOpacity
                      onLongPress={() => copyToClipboard(url)}
                      onPress={() => handlePressButtonAsync(url)}
                    >
                      <RNUrlPreview
                        text={url}
                        titleStyle={{
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                        containerStyle={{
                          flexDirection: "column",
                          height: 250,
                          width: 270,
                          backgroundColor: "#f7f7f8",
                          borderRadius: 20,
                          alignItems: "center",
                          marginBottom: 10,
                        }}
                        imageStyle={{
                          width: 200,
                          height: 150,
                          borderRadius: 20,
                          marginBottom: 3,
                          resizeMode: "cover",
                          // backgroundColor: 'red'
                        }}
                        textContainerStyle={{
                          padding: 10,
                          // justifyContent: 'center',
                          // alignItems: 'center'
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Text
                      onLongPress={() => copyToClipboard(url)}
                      key={i}
                      style={{
                        color: "blue",
                        textDecorationLine: "underline",
                      }}
                      onPress={() => handlePressButtonAsync(url)}
                    >
                      {url}
                    </Text>
                  )
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
                    onLongPress={() =>
                      copyToClipboard(`https://www.imdb.com/title/${url[1]}`)
                    }
                    onPress={() =>
                      handlePressButtonAsync(
                        `https://www.imdb.com/title/${url[1]}`
                      )
                    }
                    key={i}
                  >
                    <Image
                      style={globalStyles.messages_botFilmPoster}
                      source={{
                        uri: `https://img.omdbapi.com/?apikey=ea75cc5f&i=${url[1]}`,
                      }}
                    />
                    <View>
                      <Text style={globalStyles.messages_botText}>
                        {url[0]}{" "}
                        {isNaN(url[3]) ? `(${url[3].split("-")[0]})` : "?"}
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
                    source={{
                      uri: `data:image/png;base64,${data[1]?.image}`,
                    }}
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
                {data[1]?.message.indexOf(".png") > -1 ? (
                  splitText(data[1]?.message).reduce((first, second) => (
                    <>
                      {first}
                      <Image
                        style={globalStyles.message_botText_icon}
                        source={{
                          uri: textContainUrl(data[1]?.message),
                        }}
                      />
                      {second}
                    </>
                  ))
                ) : URL(data[1]?.message) ? (
                  <View>
                    <TouchableOpacity
                      style={globalStyles.message_botText_shortLink_div}
                    >
                      <Text
                        style={globalStyles.message_botText_shortLink}
                        onLongPress={() => copyToClipboard(data[1]?.message)}
                        onPress={() => handlePressButtonAsync(data[1]?.message)}
                      >
                        {data[1]?.message}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onLongPress={() =>
                        copyToClipboard(data[0]?.message.replace(":surl", ""))
                      }
                      onPress={() =>
                        handlePressButtonAsync(
                          data[0]?.message.replace(":surl", "")
                        )
                      }
                    >
                      <RNUrlPreview
                        text={data[0]?.message.replace(":surl", "")}
                        titleStyle={{
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                        containerStyle={{
                          flexDirection: "column",
                          height: 250,
                          width: 200,
                          backgroundColor: "#f7f7f8",
                          borderRadius: 20,
                          // justifyContent: 'center',
                          alignItems: "center",
                          // padding: 20
                        }}
                        imageStyle={{
                          width: 200,
                          height: 150,
                          borderRadius: 20,
                          marginBottom: 3,
                          resizeMode: "cover",
                          // backgroundColor: 'red'
                        }}
                        textContainerStyle={{
                          padding: 10,
                          // justifyContent: 'center',
                          // alignItems: 'center'
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  data[1]?.message
                )}
              </Text>
            )}
          </View>
        </View>
      }
    </View>
  );
}
