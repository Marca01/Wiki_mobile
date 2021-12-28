import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Main from "../components/screens/Main";
import Welcome from "../components/screens/common/Welcome";
import Guide from "../components/screens/common/Guide";
import { TransitionPresets } from "@react-navigation/stack";
import Webview from "../components/screens/common/Webview";

const MainStack = createStackNavigator();

// Home navigator
const home = ({ navigation }) => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Screen
        name="Main"
        component={Main}
        options={{
          headerShown: false,
        }}
      />
      <MainStack.Group
        screenOptions={{
          presentation: "modal",
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
      >
        <MainStack.Screen
          name="Guide"
          component={Guide}
          options={{
            headerShown: false,
          }}
        />
      </MainStack.Group>
      <MainStack.Screen
        name="Webview"
        component={Webview}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
};

export default function AppNavigation() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={home}
        options={{
          headerShown: false,
        }}
      />
    </MainStack.Navigator>
  );
}
