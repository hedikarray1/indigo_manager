import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { Text } from "react-native";
import { Image } from "react-native";
import { Platform } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { Swipeable } from "react-native-gesture-handler";
import { RFPercentage } from "react-native-responsive-fontsize";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { black, bleu, MAIN_BLUE, or, red, white } from '../../../config/Colors';
import { DataBaseRef, FirebaseStorage, USER_PICTURE_URL } from "../../../config/Constant";
import { db, firestorage } from "../../../config/serverConfig";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native";
import Dialog, {
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  DialogTitle,
} from "react-native-popup-dialog";

const { width, height } = Dimensions.get("window");

const firestoreUser = db.collection(DataBaseRef.user);
const firebaseStoreUser = firestorage.ref(FirebaseStorage.user);



function EmployesList() {
  const [employesList, setEmployesList] = useState([]);
  const [dialogDeleteVisiblilite, setDialogDeleteVisiblilite] = useState(false);
const [selectedItem,setSelectedItem]=useState(0);
  useEffect(() => {
    getEmployes();
  }, []);
  useEffect(() => {

  }, [employesList]);

  const getEmployes = () => {
    let employes = [];
    firestoreUser.where("role", "!=", "admin").get().then((snapshot) => {
      if (snapshot.empty) {
        console.log("no data found");
      } else {

        snapshot.forEach((el) => {
          employes.push({ id: el.id, firstname: el.data().firstname, lastname: el.data().lastname, email: el.data().email, role: el.data().role, picture: el.data().picture })

        })
        setEmployesList(employes)

      }
    })
  }

  const removeItem = () => {
 
    
  firestoreUser.doc(selectedItem).delete().then((result)=>{
    const index = employesList.findIndex(employe => employe.id === selectedItem); //use id instead of index
    if (index > -1) { //make sure you found it
      let oldState=employesList;
      oldState.splice(index,1);
     setEmployesList(oldState);
     setDialogDeleteVisiblilite(false);
    }   
  }).catch(e=>{
    console.log("error when delete user",e)
  })
}

  return (
    <ScrollView style={styles.ScrollView}>
      <View style={styles.main_container}>
        {employesList.map((item, index) => (

          <View style={styles.item_container} key={item.id}>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 15,
                alignSelf:"center",
                alignItems: "center",
              }}
              onPress={()=>{ setSelectedItem(item.id);setDialogDeleteVisiblilite(true)}}
            >
            
              <IconFontAwesome
               size={20}
            
               color="red"
               name="remove"
              />
               
            
            </TouchableOpacity>
            <Image
              style={styles.picture}
              source={{ uri: USER_PICTURE_URL + item.picture }}
            ></Image>
            <View style={styles.user_data}>
              <Text style={styles.txt_username}>
                {" "}
                {item.firstname + " " + item.lastname}
              </Text>
              <Text style={styles.txt_email}> {item.email}</Text>
            </View>

          

          </View>

        ))}

<Dialog
  visible={dialogDeleteVisiblilite}
  dialogStyle={{
    borderRadius: 20,
    marginHorizontal: 30,
  }}
  dialogTitle={
    <DialogTitle
      textStyle={styles.dialog_title_txt}
      title="Voulez vous supprimer cet employé ? "
    />
  }
  dialogAnimation={
    new SlideAnimation({
      slideFrom: "bottom",
    })
  }
  onTouchOutside={() => {
    setDialogDeleteVisiblilite(false)
  }}
  footer={
    <DialogFooter>
      <DialogButton
        text="NON"
        textStyle={styles.dialog_btn_annuler}
        onPress={() => {
          setDialogDeleteVisiblilite(false)
        }}
      />
      <DialogButton
        text="OUI"
        textStyle={styles.dialog_btn_ajouter}
        onPress={() => {
         removeItem();
        }}
      />
    </DialogFooter>
  }
></Dialog>



      </View>

     
     

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  txt_email: {
    fontSize: RFPercentage(2.4), 
    fontFamily:"ChampagneLimousines" ,
        color: "gray",
  },

  txt_phone: {
    fontFamily: "Montserrat-SemiBold",
    // fontSize: RFPercentage(1.8),
    color: "gray",
  },
  txt_username: {
   fontSize: RFPercentage(2.8), 
   fontFamily:"ChampagneLimousines-Bold" ,
    color: black,
  },
  picture: {
    width: height / 12,
    height: height / 12,
    borderRadius: 100,
    borderColor: MAIN_BLUE,
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
  main_container:{
    flex:1,
    backgroundColor:white
  },
  item_container: {
    width: "98%",
    height: height / 9,
    backgroundColor: white,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    elevation: 5,
    marginHorizontal:"1%",
    borderRadius: 10,
    marginVertical: 7,
  },
  ScrollView: {
    display: "flex",
    flex:1,
    backgroundColor: white,

    padding: 8,
    
  },
  user_data: {
    display: "flex",
    height:"90%",
    flexDirection: "column",
    justifyContent: "center",
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
 //dialog
 dialog_title_txt: {
  fontFamily: "Montserrat-Regular",
  fontSize: RFPercentage(2.5),
  color: "black",
},
dialog_btn_annuler: {
  fontFamily: "Montserrat-SemiBold",
  fontSize: RFPercentage(2),
  color: "grey",
},
dialog_btn_ajouter: {
  fontFamily: "Montserrat-SemiBold",
  fontSize: RFPercentage(2),
  color: MAIN_BLUE,
},

});
export default EmployesList;
