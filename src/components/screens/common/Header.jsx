import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { globalStyles } from "../../../styles/global";
import { Ionicons } from "@expo/vector-icons";

export default function Header({ title, navigation }) {
  return (
    <View style={globalStyles.header}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={globalStyles.headerDiv}>
          <Ionicons
            name="chevron-back"
            size={30}
            color="black"
            onPress={() => navigation.goBack()}
            style={globalStyles.header_backIcon}
          />
          <View style={globalStyles.headerTitle}>
            <Text numberOfLines={1} style={globalStyles.headerTitle_title}>
              {title}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
