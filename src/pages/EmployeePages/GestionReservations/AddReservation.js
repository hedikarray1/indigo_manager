import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacityBase } from 'react-native';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { TextInput } from "react-native-paper";
import { CURRENT_USER_KEY, DataBaseRef, FirebaseStorage, HOUSE_PICTURE_URL, SCREEN_WIDTH, SERVER_URL, SIGNATURE_PICTURE_URL, UPLOAD_ENDPOINT } from '../../../config/Constant';
import { db, firestorage } from '../../../config/serverConfig';

import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import * as RNFS from 'react-native-fs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Modal } from 'react-native';
import AddCheckInItems from './AddCheckInItems';
import { green, MAIN_BLUE, white } from '../../../config/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';


function AddReservation() {
  const [houses, sethouses] = useState([]);
  const [housesItems, sethousesItems] = useState([]);
  const [value, setValue] = useState(null);
  const [checkInItems, setCheckInItems] = useState([]);
  const [reservation, setReservation] = useState({ customer_firstname: "", customer_lastname: "", customer_email: "", employe_id: "", income_date: "", outcome_date: "", checkin_date: "", checkout_date: "", checkin_signature: "", checkout_signature: "", house_id: "" })
  const firestoreHouse = db.collection(DataBaseRef.house);
  const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);
  const [open, setOpen] = useState(false);
  const firestoreReservation = db.collection(DataBaseRef.reservation);
  const [signature_canva_path, setSignature_canva_path] = useState("");
  const [showIncome, setShowIncome] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [checkInVisibility, setCheckInVisibility] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // console.log(housesItems);
    setLoading(false)
  }, [housesItems]);

  useEffect(() => {
    // console.log(housesItems);
  }, [reservation]);


  const cancelCheckinItems = () => {
    setCheckInVisibility(false);
  }


  const showCheckinItems = () => {
    setCheckInVisibility(true)
  }
  const finishCheckinItems = (items) => {

    items.forEach((item, index) => {
      let data = {};
      let name = new Date().getTime() + "";
      if (item.state == false) {
        uploadPicture(name, item.picture_data, "item");
        data = { is_checkin: item.is_checkin, title: item.title, description: item.description, picture: name + ".png", state: item.state, observation: item.observation }
      } else {
        data = { is_checkin: item.is_checkin, title: item.title, description: item.description, picture: item.picture, state: item.state, observation: "" }

      }


      if (items.size - 1 <= index) {
        setCheckInItems(items);

      }


    })


    setCheckInVisibility(false);

  }

  //  const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);
  const getHouses = async () => {
    console.log("start getting product");
    let hous = [];
    let housItems = [];

    await firestoreHouse
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          console.log("houses empty");
        }
        snapshot.forEach(async (val, index) => {
          console.log("val :", val);

          hous.push({
            id: val.id,
            title: val.data().title,
            description: val.data().description,
            status: val.data().status,
            picture: val.data().picture,
            picture_url: HOUSE_PICTURE_URL + val.data().picture,
          });

          housItems.push({
            value: val.id,
            label: val.data().title,
            icon: () => (<Image style={styles.dropdown_icon} source={{ uri: HOUSE_PICTURE_URL + val.data().picture }} />),

          });


          /*       sethousesItems([...housesItems,{
                   id: val.id,
                   title: val.data().title,
                   description: val.data().description,
                   status: val.data().status,
                   picture: val.data().picture,
                   picture_url: url,
                 }]);*/

          /*  sethousesItems(prevMovies => ([...prevMovies, {
              id: val.id,
              title: val.data().title,
              description: val.data().description,
              status: val.data().status,
              picture: val.data().picture,
              picture_url: url,
            }]));*/

          if (index === snapshot.size - 1) {

            //   console.log("my new :",myNew)
            sethousesItems(housItems)
            console.log("house number", index);
            setLoading(false);
            // console.log("houses output", housesItems);

          }
          //  sethousesItems(housItems);
          //  sethouses(hous);




        });




      })
      .catch((reason) => {
        console.log("erreur: ", reason);
      });
  };

  const uploadPicture = (name, path, type) => {
    //need to set state of file name

    RNFS.readFile(path, 'base64').then(res => {

      // console.log("read file hedi:",res)

      let form_data = new FormData();
      form_data.append("img", res);
      form_data.append("name", name);
      form_data.append("type", type);
      let request = fetch(
        UPLOAD_ENDPOINT
        ,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
          method: "POST",
          body: form_data
        }
      );
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
      });
      //end
    })
      .catch(err => {
        console.log("read file error:", err)
      });
  }




  const onChangeCustomerData = (field, value) => {


    setReservation({ ...reservation, [field]: value });
  }

  const saveReservation = async () => {
    const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (data != null) {
      const userData = JSON.parse(data);
      //setCurrentUser({...userData});

      let name = new Date().getTime() + "";
      uploadPicture(name, signature_canva_path, "signature");
      let oldreservation = reservation;
      oldreservation.checkin_signature = name + ".png";
      oldreservation.checkin_date = name;
      oldreservation.employe_id = userData.id
      setReservation(oldreservation);
      firestoreReservation.add(reservation).then(res => {
        console.log("reservation added", res);

        checkInItems.forEach((item, index) => {

          firestoreCheckItem.add({ ...item, reservation_id: res.id }).then((res) => {
            console.log("item checkin added ");
          }).catch(e => {
            console.log("add check in item" + index + " error :", e);
          })

        })


      }).catch(e => {
        console.log("error when add reservation");
      })
    }
  }

  useEffect(() => {
    getHouses();
    // console.log("houses :", houses);
  }, []);



  useEffect(() => {
   // getHouses();
    // console.log("houses :", houses);
  }, [checkInItems]);


  if (loading) {
    return (<View><Text>loading</Text></View>)
  }

  return (
    <ScrollView style={styles.scroll_view}>
      <View style={styles.main_container}>
        <Text style={styles.title_txt}>Sélectionner la maison</Text>
        <DropDownPicker
          open={open}
          setOpen={setOpen}
          value={value}
          items={housesItems}
          placeholder="selectionner une maison"
          setValue={setValue}
          searchable={true}
          searchPlaceholder="taper le nom"
          onChangeValue={(val) => { setReservation({ ...reservation, house_id: val }) }}
          listItemContainerStyle={{ marginVertical: 10,zIndex:10,elevation:5,}}
          containerStyle={{ marginVertical: 10, elevation: 10,zIndex:5 ,height:200}}  >

        </DropDownPicker>
        <TextInput
          style={styles.text_input}

          theme={{ colors: { error: "red", background: "white", primary: MAIN_BLUE } }}
          //  error={employeDataError.lastname!=""}
          underlineColor="transparent"

          value={reservation.customer_lastname}
          onChangeText={(val) => { onChangeCustomerData("customer_lastname", val) }}
          placeholder="nom du client" />


        <TextInput
          style={styles.text_input}

          theme={{ colors: { error: "red", background: "white", primary: MAIN_BLUE } }}
          //  error={employeDataError.lastname!=""}
          underlineColor="transparent"
          value={reservation.customer_firstname}
          onChangeText={(val) => { onChangeCustomerData("customer_firstname", val) }}
          placeholder="prenom du client" />
        <TextInput
          style={styles.text_input}
          theme={{ colors: { error: "red", background: "white", primary: MAIN_BLUE } }}
          //  error={employeDataError.lastname!=""}
          underlineColor="transparent"
          value={reservation.customer_email}
          onChangeText={(val) => { onChangeCustomerData("customer_email", val) }}
          placeholder="Email du client" />
        
          <TouchableOpacity style={styles.button_open_modal} onPress={() => { showCheckinItems() }}>
            <Text style={styles.button_txt}>Liste des options</Text>
          </TouchableOpacity>
        
      {checkInItems.length>0?( 
        <>
        <Text style={styles.title_txt}>Signature du client</Text>
        <View style={{ width: SCREEN_WIDTH * 0.99, height: 300, flexDirection: 'row' }}>
          <RNSketchCanvas
            containerStyle={{ borderRadius: 20, borderColor: MAIN_BLUE, borderWidth: 1, backgroundColor: 'white', flex: 1 }}
            canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}

            undoComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>retour</Text></View>}
            clearComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>vider</Text></View>}

        
            onSketchSaved={(r, p) => {
              //uploadPicture(p,"signature")
              setSignature_canva_path(p);

            }}
            saveComponent={<View style={styles.functionButton}><Text style={{ color: 'white' }}>Confirmer</Text></View>}

            savePreference={() => {
              return {
                folder: 'RNSketchCanvas',
                filename: String(new Date().getTime),
                transparent: false,
                imageType: 'png'
              }
            }}
          />

        </View>
        </>
):null}
      
              {/*
        <View>
        <TouchableOpacity onPress={setShowIncome(true)} >
            <Text>Date d'arrivée</Text>
        </TouchableOpacity>
        {showIncome && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeIncome}
        />
      )}
        <TouchableOpacity onPress={setShowOutcome(true)} >
            <Text>Date de départ</Text>
        </TouchableOpacity>

        {showOutcome && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeOutcome}
        />
      )}
      </View>
        */}

        <Modal
          animationType={"slide"}
          transparent={false}
          style={{ width: "95%", height: "85%" }}
          visible={checkInVisibility}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <AddCheckInItems
            houseId={reservation.house_id}

            cancelCheckinItems={() => {
              cancelUCheckinItems();
            }}
            finishCheckinItems={(items) => {
              finishCheckinItems(items);
            }}
          ></AddCheckInItems>
        </Modal>
      
      
          <TouchableOpacity style={styles.button} onPress={() => { saveReservation() }}>
            <Text style={styles.button_txt}>Terminer</Text>
          </TouchableOpacity>
       


      </View>

    </ScrollView>
  )
}


const styles = StyleSheet.create({
  button_open_modal:{
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
    backgroundColor:green
  },
  scroll_view:{
    flex:1,
    backgroundColor:white
  },
  main_container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: white
  },
  dropdown_icon: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  functionButton: {
    marginHorizontal: SCREEN_WIDTH * 0.03,

    marginVertical: 8,
    height: 35,
    width: SCREEN_WIDTH * 0.25,
    backgroundColor: MAIN_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text_input: {
    
    elevation: 3,
    height: 50,
    width: "100%",
    borderRadius: 10,
    marginVertical: 10,
    // borderWidth: 1,
    paddingLeft: 15,
    // borderColor: BORDER_INPUTS,
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
  button_txt:{ fontSize: 15, fontWeight: "bold", color: "white" },
  title_txt:{
    marginVertical:10,
    color:MAIN_BLUE,
    marginLeft:10,
    alignSelf:"flex-start",
    fontSize: RFPercentage(2.8), fontFamily:"ChampagneLimousines-Bold"
  }
})
export default AddReservation
