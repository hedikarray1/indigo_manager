import { NavigationContainer } from "@react-navigation/native";
import React, { Component } from "react";
import { AppStack } from "./src/navigation/StackNavigator";
export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <AppStack></AppStack>
      </NavigationContainer>
    );
  }
}
