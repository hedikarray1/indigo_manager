import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppStack } from "./src/navigation/StackNavigator";
import AddEmploye from "./src/pages/AdminPages/GestionEmployes/AddEmploye";
import EmployesList from "./src/pages/AdminPages/GestionEmployes/EmployesList";
import Home from "./src/pages/CommunPages/Home";
import Login from "./src/pages/CommunPages/Login";
import AddReservation from "./src/pages/EmployeePages/GestionReservations/AddReservation";

export default function App() {
  return (
    <NavigationContainer>
      <AppStack></AppStack>
    </NavigationContainer>
  );
 /* return(
    <AddReservation></AddReservation>
  )*/
}
