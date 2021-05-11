import React from 'react'

import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EmployesList from "../AdminPages/GestionEmployes/EmployesList"
import AddEmploye from "../AdminPages/GestionEmployes/EmployesList"
import Profile from './Profile';

const Tabs=createBottomTabNavigator()
function Home() {
    return (
      <NavigationContainer>
          <Tabs.Navigator>
              <Tabs.Screen name="Employés" component={EmployesList} />
              <Tabs.Screen name="Ajout employé" component={AddEmploye} />
              <Tabs.Screen name="Profil" component={Profile} />

          </Tabs.Navigator>
      </NavigationContainer>
    )
}

export default Home
