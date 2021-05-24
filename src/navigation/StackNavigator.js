import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/CommunPages/Login";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import IconFeather from "react-native-vector-icons/Feather";
import EmployesList from "../pages/AdminPages/GestionEmployes/EmployesList";
import AddEmploye from "../pages/AdminPages/GestionEmployes/AddEmploye";
import { RFPercentage } from "react-native-responsive-fontsize";
import { AdminBottomTabNavigator } from "./TabNavigator";
import { MAIN_BLUE } from "../config/Colors";
import Profile from "../pages/CommunPages/Profile";
import HousesList from "../pages/AdminPages/GestionHouses/HousesList";
import AddHouse from "../pages/AdminPages/GestionHouses/AddHouse";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import ReservationList from "../pages/EmployeePages/GestionReservations/ReservationList";
import AddReservation from "../pages/EmployeePages/GestionReservations/AddReservation";
import ReservationDetails from "../pages/EmployeePages/GestionReservations/ReservationDetails";

const NavigationToAddHouse = (props) => {
  return (
    <View>
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => {
          console.log("Add House clicked");
          props.navigationProps.navigate("AddHouseScreen");
        }}
      >
        <IconAntDesign name="pluscircleo" color={MAIN_BLUE} size={25} />
      </TouchableOpacity>
    </View>
  );
};

const NavigationToAddEmplye = (props) => {
  return (
    <View>
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => {
          console.log("Add Employe clicked");
          props.navigationProps.navigate("AddEmployeScreen");
        }}
      >
        <IconAntDesign name="pluscircleo" color={MAIN_BLUE} size={25} />
      </TouchableOpacity>
    </View>
  );
};


const NavigationToAddReservation = (props) => {
  return (
    <View>
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => {
          console.log("Add Reservation clicked");
          props.navigationProps.navigate("AddReservationScreen");
        }}
      >
        <IconAntDesign name="pluscircleo" color={MAIN_BLUE} size={25} />
      </TouchableOpacity>
    </View>
  );
};


// admin stack
const StackAdmin = createStackNavigator();

function AdminStack({ navigation }) {
  return (
    <StackAdmin.Navigator>
      <StackAdmin.Screen
        name="EmployesListScreen"
        component={EmployesList}
        options={{
          title: "Liste des employés", //Set Header Title
          headerLeft: () => null,
          headerRight: () => (
            <NavigationToAddEmplye navigationProps={navigation} />
          ),
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
        name="ReservationListScreen"
        component={ReservationList}
        options={{
          title: "Liste des réservations", //Set Header Title
          headerLeft: () => null,
          headerRight: () => (
            <NavigationToAddReservation navigationProps={navigation} />
          ),
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
        name="AddReservationScreen"
        component={AddReservation}
        options={{
          title: "ajouter une reservation", //Set Header Title
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
        name="ReservationDetailsScreen"
        component={ReservationDetails}
        options={{
          title: "détails de la réservation", //Set Header Title
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
          title: "ajouter un employé", //Set Header Title
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
        name="ProfileScreen"
        component={Profile}
        options={{
          title: "compte", //Set Header Title
          headerLeft: () => null,
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
        name="HousesListScreen"
        component={HousesList}
        options={{
          title: "Liste des maisons", //Set Header Title
          headerLeft: () => null,
          headerRight: () => (
            <NavigationToAddHouse navigationProps={navigation} />
          ),
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
        name="AddHouseScreen"
        component={AddHouse}
        options={{
          title: "ajouter une maison", //Set Header Title

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
