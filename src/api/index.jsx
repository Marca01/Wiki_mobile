import React from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { LOCAL } from "@env";
const baseUrl = LOCAL;

console.log("http", `http://${LOCAL}/chat`);

export const sendUserMessage = (user_message) =>
  axios.post(`http://${LOCAL}/chat`, user_message, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const sendImage = (lang, image_file) =>
  axios.post(`http://${LOCAL}/recognize/${lang}`, image_file, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getBotMessage = () => axios.get(`http://${LOCAL}/botMessages`);
