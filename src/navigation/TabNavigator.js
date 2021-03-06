import React from "react";
import { View } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { AdminStack } from "./StackNavigator";
import { MAIN_BLUE, white } from "../config/Colors";
import IconFeather from "react-native-vector-icons/Feather";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const AdminBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        safeAreaInsets: { bottom: 0, left: 0, right: 0 },
        activeTintColor: MAIN_BLUE,
        activeBackgroundColor: white,
        labelStyle: {
          textTransform: "uppercase",
          fontFamily: "Montserrat-SemiBold",
        },
        iconStyle: { alignSelf: "center" },

        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Houses"
        component={AdminStack}
        initialParams={{ screen: "HousesListScreen" }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <IconAntDesign name="home" color={color} size={size} />
          ),
        }}
      />

<Tab.Screen
        name="Reservations"
        component={AdminStack}
        initialParams={{ screen: "ReservationListScreen" }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <IconAntDesign name="carryout" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Employes"
        component={AdminStack}
        initialParams={{ screen: "EmployesListScreen" }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="people-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Compte"
        component={AdminStack}
        initialParams={{ screen: "ProfileScreen" }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <IconFeather name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export { AdminBottomTabNavigator };
