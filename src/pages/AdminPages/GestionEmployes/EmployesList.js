import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Text } from "react-native";
import { Image } from "react-native";
import { Platform } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { black, bleu, or, red } from '../../../config/Colors';
import { DataBaseRef, FirebaseStorage } from "../../../config/Constant";
import { db, firestorage } from "../../../config/serverConfig";

const { width, height } = Dimensions.get("window");

const firestoreUser = db.collection(DataBaseRef.user);
const firebaseStoreUser = firestorage.ref(FirebaseStorage.user);



function EmployesList() {
  const [employesList, setEmployesList] = useState([]);
  useEffect(() => {
   getEmployes();
  }, []);
  useEffect(() => {
   
   }, [employesList]);

const getEmployes=()=>{
  let employes=[];
firestoreUser.where("role","!=","admin").get().then((snapshot)=>{
  if(snapshot.empty){
    console.log("no data found");
  }else{
    
    snapshot.forEach((el)=>{
      employes.push({id:el.id,firstname:el.data().firstname,lastname:el.data().lastname,email:el.data().email,role:el.data().role,picture:el.data().picture})
    
    })
    setEmployesList(employes)

  }
})
}

  const renderDeleteButton = (index, id) => {
    return [
      <View style={styles.container_swipe_btn}>
        <TouchableOpacity
          style={styles.btn_icon}
          onPress={() => {
            //deleteUser(id, index)
          }}
        >
          <IconAntDesign
            name="delete"
            color="#135289"
            size={30}
            adjustsFontSizeToFit={true}
          />
        </TouchableOpacity>
      </View>,
    ];
  };

  return (
    <ScrollView>
      <View>
        {employesList.map((item, index) => (
          <Swipeable
            rightButtonWidth={112}
            rightButtons={renderDeleteButton(index, item.id)}
          >
            <View style={styles.item_container} key={item.id}>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  alignItems: "center",
                  borderTopRightRadius: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Montserrat-SemiBold",
                    // fontSize: RFPercentage(2),
                    color: item.role == "admin" ? bleu : red,
                  }}
                >
                  {item.role == "employee" ? "Employé" : ""}
                </Text>
              </View>
              <Image
                style={styles.picture}
                // source={{ uri: item.picture }}
              ></Image>
              <View style={styles.user_data}>
                <Text style={styles.txt_username}>
                  {" "}
                  {item.firstname + " " + item.lastname}
                </Text>
                <Text style={styles.txt_email}> {item.email}</Text>
                <Text style={styles.txt_phone}> {item.phone}</Text>
              </View>
            </View>
          </Swipeable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  txt_email: {
    fontFamily: "Montserrat-SemiBold",
    //  fontSize: RFPercentage(1.8),
    color: "gray",
  },

  txt_phone: {
    fontFamily: "Montserrat-SemiBold",
    // fontSize: RFPercentage(1.8),
    color: "gray",
  },
  txt_username: {
    fontFamily: "Montserrat-SemiBold",
    // fontSize: RFPercentage(2),
    color: black,
  },
  picture: {
    width: height / 7.5,
    height: height / 7.5,
    borderRadius: 100,
    borderColor: or,
    borderWidth: 1,
  },
  btn_delete: {
    backgroundColor: "#940920",
    width: 100,
    height: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 5,
    elevation: 5,
    marginLeft: 8,
  },
  btn_delete: {},
  btn_add: {
    backgroundColor: "#940920",
    width: 100,
    height: 40,
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    borderRadius: 50,
    borderColor: "#f5bac4",
    borderWidth: 1,
  },
  btn_txt: {
    color: "white",
    fontFamily: "Monserrat-SemiBold",
  },
  item_container: {
    width: "100%",
    height: height / 6,
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    elevation: 5,
    borderRadius: 10,
    marginVertical: 7,
  },
  ScrollView: {
    display: "flex",
    flexDirection: "column",
    padding: 8,
    justifyContent: "space-evenly",
    marginBottom: 70,
  },
  user_data: {
    display: "flex",
    flexDirection: "column",
    height: "90%",
    justifyContent: "space-evenly",
    marginLeft: 15,
  },
  picture_delete: {
    width: 30,
    height: 30,
  },
  btn_icon: {
    width: 40,
    height: 40,
    padding: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "white",
    borderColor: "white",
    marginVertical: 7,
    elevation: 3,
    shadowColor: "#707070",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderWidth: 1,
  },
  container_swipe_btn: {
    height: "100%",
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "column",
    paddingLeft: 20,
  },
});
export default EmployesList;
