import React from "react";
import { View, Text } from "react-native";
import axios from "axios";

const baseUrl = "http://192.168.1.6:5000/chat";

export const sendUserMessage = user_message =>
  axios.post("http://192.168.1.6:5000/chat", user_message, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getBotMessage = () => axios.get("http://192.168.1.6:5000/botMessages");
