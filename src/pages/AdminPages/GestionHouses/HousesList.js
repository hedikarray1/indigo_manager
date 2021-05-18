import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Image, Text } from "react-native";
import {
  DataBaseRef,
  FirebaseStorage,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from "../../../config/Constant";
import { db, firestorage } from "../../../config/serverConfig";

import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { black, bleu, or, red } from "../../../config/Colors";

export default function HousesList() {
  const [houses, sethouses] = useState([]);
  const firestoreHouse = db.collection(DataBaseRef.house);
  const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);
 const getHouses = async () => {
    console.log("start getting product");
    let hous = [];
    await firestoreHouse
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("houses empty");
        }
        snapshot.forEach(async (val,index) => {
          console.log("val :", val);
          await firebaseStoreHouse
            .child(val.data().picture)
            .getDownloadURL()
            .then((url) => {
              hous.push({
                id: val.id,
                title: val.data().title,
                description: val.data().description,
                status: val.data().status,
                picture: val.data().picture,
                picture_url: url,
              });

            /*  sethouses([...houses,{
                id: val.id,
                title: val.data().title,
                description: val.data().description,
                status: val.data().status,
                picture: val.data().picture,
                picture_url: url,
              }]);*/
              if(index>=snapshot.size-1){
                sethouses(hous)
              }
            })
            .catch((reason) => {
              console.log("erreur: ", reason);
            });
        });
      
       // console.log("houses output", houses);
      })
      .catch((reason) => {
        console.log("erreur: ", reason);
      });
  };

  useEffect(() => {
    getHouses();
  }, []);

  useEffect(() => {
   
    console.log("houses :", houses);
  }, [houses]);

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
        {houses.map((item, index) => (
          <Swipeable
            rightButtonWidth={112}
            rightButtons={renderDeleteButton(index, item.id)}
          >
            <View style={styles.item_container} key={item.id}>
              <Image
                style={styles.picture}
                source={{ uri: item.picture_url }}
              ></Image>
              <View style={styles.user_data}>
                <Text style={styles.txt_username}> {item.title}</Text>
                <Text style={styles.txt_email}> {item.description}</Text>
                <Text style={styles.txt_phone}> {item.status}</Text>
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
    width: SCREEN_HEIGHT / 7.5,
    height: SCREEN_HEIGHT / 7.5,
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
    height: SCREEN_HEIGHT / 6,
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
    shadowOffset: { SCREEN_WIDTH: 2, SCREEN_HEIGHT: 3 },
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
