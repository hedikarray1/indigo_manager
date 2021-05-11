import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AddEmploye from './src/pages/AdminPages/GestionEmployes/AddEmploye';
import EmployesList from './src/pages/AdminPages/GestionEmployes/EmployesList';
import Home from './src/pages/CommunPages/Home';
import Login from './src/pages/CommunPages/Login';

export default function App() {
  return (
   <Home></Home>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
