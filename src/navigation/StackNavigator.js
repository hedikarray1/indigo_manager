import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/CommunPages/Login";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import { MAIN_BLUE } from "../config.js/Colors";
import EmployesList from "../pages/AdminPages/GestionEmployes/EmployesList";
import AddEmploye from "../pages/AdminPages/GestionEmployes/AddEmploye";
import ProfileScreen from "../pages/CommunPages/ProfileScreen";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AdminBottomTabNavigator } from "./TabNavigator";

// admin stack
const StackAdmin = createStackNavigator();

function AdminStack({ navigation }) {
  return (
    <StackAdmin.Navigator>
      <StackAdmin.Screen
        name="EmployesListScreen"
        component={EmployesList}
        options={{
          title: "EmployesList", //Set Header Title

          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "white", //Set Header color
          },
          headerTintColor: MAIN_BLUE, //Set Header text color
          headerTitleStyle: {
            fontFamily: "Montserrat-SemiBold",
            fontSize: RFPercentage(2.2),
            textTransform: "uppercase",
          },
        }}
      />
      <StackAdmin.Screen
        name="AddEmployeScreen"
        component={AddEmploye}
        options={{
          title: "AddEmploye", //Set Header Title

          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "white", //Set Header color
          },
          headerTintColor: MAIN_BLUE, //Set Header text color
          headerTitleStyle: {
            fontFamily: "Montserrat-SemiBold",
            fontSize: RFPercentage(2.2),
            textTransform: "uppercase",
          },
        }}
      />
      <StackAdmin.Screen
        name="ProfileScreenScreen"
        component={ProfileScreen}
        options={{
          title: "ProfileScreen", //Set Header Title

          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "white", //Set Header color
          },
          headerTintColor: MAIN_BLUE, //Set Header text color
          headerTitleStyle: {
            fontFamily: "Montserrat-SemiBold",
            fontSize: RFPercentage(2.2),
            textTransform: "uppercase",
          },
        }}
      />
    </StackAdmin.Navigator>
  );
}

// Auth stack
const StackAuth = createStackNavigator();

function AuthentificationStack({ navigation }) {
  return (
    <StackAuth.Navigator>
      <StackAuth.Screen
        name="LoginScreen"
        component={Login}
        options={{ headerShown: false }}
      />
    </StackAuth.Navigator>
  );
}

const StackApp = createStackNavigator();

function AppStack({ navigation }) {
  return (
    <StackApp.Navigator initialRouteName="AuthentificationStack">
      <StackApp.Screen
        name="AdminBottomTabNavigator"
        component={AdminBottomTabNavigator}
        initialParams={{ screen: "Employes" }}
        options={{ headerShown: false }}
      />
      <StackApp.Screen
        name="AuthentificationStack"
        component={AuthentificationStack}
        options={{ headerShown: false }}
      />
    </StackApp.Navigator>
  );
}

export { AppStack, AuthentificationStack, AdminStack };
