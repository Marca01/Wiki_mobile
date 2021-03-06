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
  InputAccessoryView,
} from "react-native";
import { globalStyles } from "../../../styles/global";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import RNUrlPreview from "react-native-url-preview";
import * as WebBrowser from "expo-web-browser";
import * as Font from "expo-font";

const { width } = Dimensions.get("window");

export default function NodeChat({
  user_message,
  bot_message,
  data,
  tag,
  navigation,
  index,
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

  const renderItemNews = ({ item, index }) => (
    <TouchableOpacity
      onLongPress={() => copyToClipboard(item)}
      onPress={() => handlePressButtonAsync(item)}
    >
      <RNUrlPreview
        text={item}
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
        }}
        containerStyle={{
          flexDirection: "column",
          width: width * 0.6,
          backgroundColor: "#f7f7f8",
          borderRadius: 20,
          // justifyContent: 'center',
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
          marginRight: 10,
          // shadowColor: "#000",
          // shadowOffset: {
          //   width: 0,
          //   height: 10,
          // },
          // shadowOpacity: 0.53,
          // shadowRadius: 13.97,

          // elevation: 21,
        }}
        imageStyle={{
          width: width * 0.6,
          height: width * 0.5 * 0.75,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginBottom: 5,
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
  );

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
  const regUrl =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
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
                        width: width * 0.6,
                        backgroundColor: "#f7f7f8",
                        borderRadius: 20,
                        // justifyContent: 'center',
                        alignItems: "center",
                        marginTop: 10,
                        marginBottom: 10,
                        // shadowColor: "#000",
                        // shadowOffset: {
                        //   width: 0,
                        //   height: 10,
                        // },
                        // shadowOpacity: 0.53,
                        // shadowRadius: 13.97,

                        // elevation: 21,
                      }}
                      imageStyle={{
                        width: width * 0.6,
                        height: width * 0.5 * 0.75,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        marginBottom: 5,
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
            ) : regUrl.test(data[0].message) ? (
              <>
                {splitText(data[0].message).reduce((before, after) => (
                  <TouchableOpacity
                    onLongPress={() => copyToClipboard(data[0].message)}
                    onPress={() =>
                      regUrl.test(data[0].message)
                        ? handlePressButtonAsync(
                            data[0].message.match(regUrl)[0]
                          )
                        : () => {}
                    }
                  >
                    <Text>
                      <Text style={globalStyles.messages_userText}>
                        {before}
                      </Text>
                      <Text style={globalStyles.messages_userText_link}>
                        {data[0].message.match(regUrl)[0]}
                      </Text>
                      <Text style={globalStyles.messages_userText}>
                        {after}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() =>
                    handlePressButtonAsync(data[0]?.message.match(regUrl)[0])
                  }
                  onLongPress={() =>
                    copyToClipboard(data[0]?.message.match(regUrl)[0])
                  }
                >
                  <RNUrlPreview
                    text={data[0].message.match(regUrl)[0]}
                    titleStyle={{
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                    containerStyle={{
                      flexDirection: "column",
                      width: width * 0.6,
                      backgroundColor: "#f7f7f8",
                      borderRadius: 20,
                      // justifyContent: 'center',
                      alignItems: "center",
                      marginTop: 10,
                      marginBottom: 10,
                      // shadowColor: "#000",
                      // shadowOffset: {
                      //   width: 0,
                      //   height: 10,
                      // },
                      // shadowOpacity: 0.53,
                      // shadowRadius: 13.97,

                      // elevation: 21,
                    }}
                    imageStyle={{
                      width: width * 0.6,
                      height: width * 0.5 * 0.75,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      marginBottom: 5,
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
            ) : (
              <Text
                style={globalStyles.messages_userText}
                onLongPress={() => copyToClipboard(data[0].message)}
                onPress={() =>
                  regUrl.test(data[0].message)
                    ? handlePressButtonAsync(data[0].message.match(regUrl)[0])
                    : () => {}
                }
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
              data[1]?.message.map((item, i) =>
                URL(item) ? (
                  i === 0 ? (
                    <TouchableOpacity
                      onLongPress={() => copyToClipboard(item)}
                      onPress={() => handlePressButtonAsync(item)}
                    >
                      <RNUrlPreview
                        text={item}
                        titleStyle={{
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                        containerStyle={{
                          flexDirection: "column",
                          width: width * 0.6,
                          backgroundColor: "#f7f7f8",
                          borderRadius: 20,
                          // justifyContent: 'center',
                          alignItems: "center",
                          marginTop: 10,
                          marginBottom: 10,
                          // shadowColor: "#000",
                          // shadowOffset: {
                          //   width: 0,
                          //   height: 10,
                          // },
                          // shadowOpacity: 0.53,
                          // shadowRadius: 13.97,

                          // elevation: 21,
                        }}
                        imageStyle={{
                          width: width * 0.6,
                          height: width * 0.5 * 0.75,
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          marginBottom: 5,
                          resizeMode: "cover",
                        }}
                        textContainerStyle={{
                          padding: 10,
                          // justifyContent: 'center',
                          // alignItems: 'center'
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onLongPress={() => copyToClipboard(item)}
                      onPress={() => handlePressButtonAsync(item)}
                      key={i}
                    >
                      <Text
                        style={{
                          color: "blue",
                          textDecorationLine: "underline",
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )
                ) : data[0]?.message.indexOf(":film") > -1 ? (
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
                      copyToClipboard(`https://www.imdb.com/title/${item[1]}`)
                    }
                    onPress={() =>
                      handlePressButtonAsync(
                        `https://www.imdb.com/title/${item[1]}`
                      )
                    }
                    key={i}
                  >
                    <Image
                      style={globalStyles.messages_botFilmPoster}
                      source={{
                        uri: `https://img.omdbapi.com/?apikey=ea75cc5f&i=${item[1]}`,
                      }}
                    />
                    <View>
                      <Text style={globalStyles.messages_botText}>
                        {item[0]}{" "}
                        {isNaN(item[3]) ? `(${item[3].split("-")[0]})` : "?"}
                      </Text>
                      {/* // movie title */}
                      {/* <Text style={globalStyles.messages_botText}>{item[1]}</Text> */}
                      {/* // imdb id */}
                      <Text style={globalStyles.messages_botText}>
                        Thời lượng (phút): {item[2]}
                      </Text>
                      {/* // runtime (hrs) */}
                      {/* <Text style={globalStyles.messages_botText}>{item[3]}</Text> */}
                      {/* // release date */}
                      <Text style={globalStyles.messages_botText}>
                        Bình chọn: {item[4]}
                      </Text>
                      {/* // vote average */}
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      // backgroundColor: "red",
                      height: width * 0.68,
                    }}
                  >
                    <Text
                      style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      {item.title}
                    </Text>
                    <FlatList
                      data={item.data}
                      renderItem={renderItemNews}
                      removeClippedSubviews
                      keyExtractor={(item, index) => index}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
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
                        copyToClipboard(
                          data[1]?.message.replace(":surl", "").trim()
                        )
                      }
                      onPress={() =>
                        handlePressButtonAsync(
                          data[1]?.message.replace(":surl", "").trim()
                        )
                      }
                    >
                      <RNUrlPreview
                        text={data[0]?.message.replace(":surl", "").trim()}
                        titleStyle={{
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                        containerStyle={{
                          flexDirection: "column",
                          width: width * 0.6,
                          backgroundColor: "#f7f7f8",
                          borderRadius: 20,
                          // justifyContent: 'center',
                          alignItems: "center",
                          marginTop: 10,
                          marginBottom: 10,
                          // shadowColor: "#000",
                          // shadowOffset: {
                          //   width: 0,
                          //   height: 10,
                          // },
                          // shadowOpacity: 0.53,
                          // shadowRadius: 13.97,

                          // elevation: 21,
                        }}
                        imageStyle={{
                          width: width * 0.6,
                          height: width * 0.5 * 0.75,
                          borderTopLeftRadius: 20,
                          borderTopRightRadius: 20,
                          marginBottom: 5,
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
