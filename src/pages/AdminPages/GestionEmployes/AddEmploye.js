import React, { useState } from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { BORDER_INPUTS, MAIN_BLUE, white } from "../../../config/Colors";
import { ImageRef } from "../../../config/ImageRef";
import { db, firestorage } from "../../../config/serverConfig";
import * as RNFS from 'react-native-fs';

import {
  UPLOAD_ENDPOINT,
  SCREEN_WIDTH,
  DataBaseRef,
  FirebaseStorage,
  SCREEN_HEIGHT,
} from "../../../config/Constant";
import Toast from "react-native-toast-message";
import ImagePicker from "react-native-image-crop-picker";
const firestoreUser = db.collection(DataBaseRef.user);
const firebaseStoreUser = firestorage.ref(FirebaseStorage.user);


function AddEmploye(props) {
  const [employe, setEmploye] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "employee",
    password: "",
    picture_path:"",
    picture:"",
    state: 1,
  });
  const [employeDataError, setEmployeDataError] = useState({
    firstname: "",
    lastname: "",
    email: "",
    picture:"",

    role: "",
    password: "",
    repeatpassword: "",
  });
  const [repeatPassword, setRepeatPassword] = useState("");
  const onChangeText = (field, value) => {
    if (field === "repeatPassword") {
      setRepeatPassword(value);
      setEmployeDataError({...employeDataError,["repeatpassword"]:""})

    } else {
      let myoldState = employe;
      myoldState[field] = value;
      setEmploye({ ...myoldState });
      setEmployeDataError({...employeDataError,[field]:""})
    }
  };


  const uploadPicture=(name,data,type)=>{
    
    let form_data=new FormData();
    form_data.append("img",data);
    form_data.append("name",name);
    form_data.append("type",type);
    let request = fetch(
      UPLOAD_ENDPOINT,
      {
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
      },
        method:"POST",
         body: form_data
       }
     );
     console.log("server is:",UPLOAD_ENDPOINT,"data is:",form_data)
     request.then((response) => {
       console.log("upload picture response:", response.status);
       if (response.status == 200) {
         console.log(" succès");
       } else {
         console.log(
           "response status:",
           response.status,
           "full response data:",
           response
         );
       }
     }).catch(e=>{
       console.log("upload error is:",e)
     });
    //end
  
}

  const pickImage = async () => {
    let myoldState = employe;
    
    myoldState.picture_data = "value";
    setEmploye({ ...myoldState });

    ImagePicker.openPicker({
      width: 500,
      includeBase64:true,
      height: 500,
      //cropping: true
    }).then((image) => {
      console.log(image);
      ImagePicker.openCropper({
        path: image.path,
        width: 500,
        height: 500,
        includeBase64:true
      }).then((image1) => {
        console.log(image1);
        
        let myoldState = employe;
        myoldState.picture = image1.data;
        myoldState.picture_path=image1.path;
        setEmploye({ ...myoldState });

       // console.log("setted picture data", house.picture_data);
      });
    });
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
   firestoreUser.where("email","==",employe.email).get().then((snapshot)=>{
     if(snapshot.empty){
       let name=new Date().getTime()+"";
      uploadPicture(name,employe.picture,"user");
      firestoreUser.add({firstname:employe.firstname,lastname:employe.lastname,email:employe.email,password:employe.password,role:employe.role,picture:name+".png"}).then((result)=>{
        console.log("employee is:", employe);
        props.navigation.navigate("EmployesList")
      }).catch((e)=>{
        console.log("error adding employee",e);
      })
     }else{
       console.log("email exists , error adding employee")
     }
   })
  };

  return (
    <ScrollView style={styles.scroll_view}>
      <View style={styles.main_container}>
<TouchableOpacity  onPress={()=>{pickImage()}}>
  <Image  style={styles.user_picture} source={ employe.picture_path!=""? { uri: employe.picture_path }
                      : ImageRef.house_add_image} ></Image>
</TouchableOpacity>
<View style={styles.row_field}>
        <TextInput
             theme={{colors:{error:"red",background:"white",primary:MAIN_BLUE}}}
             error={employeDataError.lastname!=""}
                underlineColor="transparent"  
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
</View>
        <View style={styles.row_field}>
          <TextInput
             theme={{colors:{error:"red",background:"white",primary:MAIN_BLUE}}}
             error={employeDataError.firstname!=""}
                underlineColor="transparent" 
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
  theme={{colors:{error:"red",background:"white",primary:MAIN_BLUE}}}
  error={employeDataError.email!=""}
     underlineColor="transparent"    
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
              theme={{colors:{error:"red",background:"white",primary:MAIN_BLUE}}}
              error={employeDataError.password!=""}
                 underlineColor="transparent" 
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
          theme={{colors:{error:"red",background:"white",primary:MAIN_BLUE}}}
          error={employeDataError.repeatpassword!=""}
             underlineColor="transparent" 
             
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
        <TouchableOpacity style={styles.button} onPress={verifData}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              Ajouter
            </Text>
         
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  user_picture:{
    marginVertical:15,
width:SCREEN_WIDTH*0.3,
height:SCREEN_WIDTH*0.3,
borderRadius:SCREEN_WIDTH*0.3,
borderColor:MAIN_BLUE,
borderWidth:1.5
  },
 
  scroll_view: {
    flex: 1,
    backgroundColor:white,

  },
  main_container: {
    flex: 1,
    backgroundColor:white,
    width:"100%",
    display: "flex",
    alignItems:"center",
    justifyContent: "center",
    flexDirection:"column",
    paddingHorizontal: 10,
    marginBottom: 80,
  },
  text_input: {
    elevation:3,
    height: 50,
    width:"100%",
    borderRadius: 10,
    marginVertical: 5,
   // borderWidth: 1,
    paddingLeft: 15,
   // borderColor: BORDER_INPUTS,
  },
  txt_error_message: {
    color: "#b50d15",
  },
  row_field: {
    width:"95%",
   
  },
  button: {
    backgroundColor: MAIN_BLUE,
    height: 50,
    width:"95%",
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
