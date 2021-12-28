import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import { globalStyles } from "../../../styles/global";
import { Ionicons } from "@expo/vector-icons";

export default function Webview({ navigation, route }) {
  return (
    <View style={globalStyles.webview}>
      <View style={globalStyles.webview_header}>
        <Ionicons
          name="chevron-back"
          size={30}
          color="black"
          onPress={() => navigation.goBack()}
          style={globalStyles.webview_header_backIcon}
        />
        <View style={globalStyles.headerTitle}>
          <Text numberOfLines={1} style={globalStyles.headerTitle_title}>
            Quay lại
          </Text>
        </View>
      </View>
      <WebView
        startInLoadingState={true}
        allowsBackForwardNavigationGestures={true}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
        source={{ uri: route.params?.url }}
      />
    </View>
  );
}
