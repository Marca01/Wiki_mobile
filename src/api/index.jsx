import React from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { LOCAL } from "@env";
const baseUrl = LOCAL;

console.log("http", `http://${LOCAL}/chat`);

export const sendUserMessage = (user_message) =>
  axios.post(`http://192.168.1.12:5000/chat`, user_message, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getBotMessage = () =>
  axios.get(`http://192.168.1.12:5000/botMessages`);
