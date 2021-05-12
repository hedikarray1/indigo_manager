import React, { useState } from "react";
import { Text } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { BORDER_INPUTS, MAIN_BLUE } from "../../../config/Colors";

function AddEmploye() {
  const [employe, setEmploye] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "employee",
    password: "",
    state: 1,
  });
  const [employeDataError, setEmployeDataError] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    password: "",
    repeatpassword: "",
  });
  const [repeatPassword, setRepeatPassword] = useState("");
  const onChangeText = (field, value) => {
    if (field === "repeatPassword") {
      setRepeatPassword(value);
    } else {
      let myoldState = employe;
      myoldState[field] = value;
      setEmploye({ ...myoldState });
    }
  };

  const verifData = () => {
    let dataError = {
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      password: "",
      state: "",
      repeatpassword: "",
    };
    if (
      employe.firstname != "" &&
      employe.lastname != "" &&
      employe.email != "" &&
      employe.password != "" &&
      repeatPassword != ""
    ) {
      if (repeatPassword != employe.password) {
        dataError.repeatpassword = "les mots de passes ne sont pas identiques";
      } else {
        addEmployee();
      }
    } else {
      if (employe.firstname === "") {
        dataError.firstname = "ce champ ne doit pas être vide";
      }
      if (employe.lastname === "") {
        dataError.lastname = "ce champ ne doit pas être vide";
      }
      if (employe.email === "") {
        dataError.email = "ce champ ne doit pas être vide";
      }
      if (employe.password == "") {
        dataError.password = "ce champ ne doit pas être vide";
      }
      if (repeatPassword == "") {
        dataError.password = "ce champ ne doit pas être vide";
      }
    }
    setEmployeDataError(dataError);
  };

  const addEmployee = () => {
    console.log("employee is:", employe);
  };

  return (
    <ScrollView style={styles.scroll_view}>
      <View style={styles.main_container}>
        <TextInput
          placeholder="Nom"
          value={employe.lastname}
          style={styles.text_input}
          onChangeText={(e) => {
            onChangeText("lastname", e);
          }}
        />
        <Text style={styles.txt_error_message}>
          {employeDataError.lastname}
        </Text>

        <View style={styles.row_field}>
          <TextInput
            placeholder="Prénom"
            value={employe.firstname}
            style={styles.text_input}
            onChangeText={(e) => {
              onChangeText("firstname", e);
            }}
          />
          <Text style={styles.txt_error_message}>
            {employeDataError.firstname}
          </Text>
        </View>

        <View style={styles.row_field}>
          <TextInput
            placeholder="Email"
            value={employe.email}
            style={styles.text_input}
            onChangeText={(e) => {
              onChangeText("email", e);
            }}
          />
          <Text style={styles.txt_error_message}>{employeDataError.email}</Text>
        </View>

        <View style={styles.row_field}>
          <TextInput
            placeholder="mot de passe"
            value={employe.password}
            style={styles.text_input}
            onChangeText={(e) => {
              onChangeText("password", e);
            }}
          />
          <Text style={styles.txt_error_message}>
            {employeDataError.password}
          </Text>
        </View>

        <View style={styles.row_field}>
          <TextInput
            placeholder="répéter le mot de passe"
            value={repeatPassword}
            style={styles.text_input}
            onChangeText={(e) => {
              onChangeText("repeatPassword", e);
            }}
          />
          <Text style={styles.txt_error_message}>
            {employeDataError.repeatpassword}
          </Text>
        </View>
        <TapGestureHandler onHandlerStateChange={verifData}>
          <View style={styles.button}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              Ajouter
            </Text>
          </View>
        </TapGestureHandler>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll_view: {
    flex: 1,
  },
  main_container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 80,
  },
  text_input: {
    height: 50,
    borderRadius: 10,
    marginHorizontal: 30,
    marginVertical: 5,
    borderWidth: 1,
    paddingLeft: 15,
    borderColor: BORDER_INPUTS,
  },
  txt_error_message: {
    color: "#b50d15",
  },
  row_field: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: MAIN_BLUE,
    height: 50,
    marginHorizontal: 30,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 2,
  },
});
export default AddEmploye;
