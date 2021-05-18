import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacityBase } from 'react-native';
import { StyleSheet } from 'react-native';
import { ScrollView, Text, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { TextInput } from 'react-native-gesture-handler';
import { CURRENT_USER_KEY, DataBaseRef, FirebaseStorage, SCREEN_WIDTH, SERVER_URL, SIGNATURE_PICTURE_URL, UPLOAD_ENDPOINT } from '../../../config/Constant';
import { db, firestorage } from '../../../config/serverConfig';

import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import * as RNFS from 'react-native-fs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


function AddReservation() {
    const [houses, sethouses] = useState([]);
    const [housesItems, sethousesItems] = useState([]);
    const [reservation,setReservation]=useState({customer_firstname:"",customer_lastname:"",customer_email:"",employe_id:"",income_date:"",outcome_date:"",checkin_date:"",checkout_date:"",checkin_signature:"",checkout_signature:"",house_id:""})
    const firestoreHouse = db.collection(DataBaseRef.house);
    const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);

    const firestoreReservation = db.collection(DataBaseRef.reservation);
    const [signature_canva_path,setSignature_canva_path]=useState("");
    const [showIncome,setShowIncome]=useState(false);
    const [showOutcome,setShowOutcome]=useState(false);
const [loading,setLoading]=useState(true);

useEffect(() => {
   // console.log(housesItems);
   setLoading(false)
  }, [housesItems]);
  //  const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);
  const  getHouses = async () => {
      console.log("start getting product");
      let hous = [];
      let housItems = [];

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

                housItems.push({
                    value: val.id,
                    label: val.data().title,
                    icon: ()=>(<Image style={styles.dropdown_icon}  source={{ uri: url }}  />),
             
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
                
if(index===snapshot.size-1){
   
   //   console.log("my new :",myNew)
      sethousesItems(housItems)
      console.log("house number", index);
    setLoading(false);
   // console.log("houses output", housesItems);

}
                  //  sethousesItems(housItems);
                  //  sethouses(hous);
                 
                
              })
              .catch((reason) => {
                console.log("erreur: ", reason);
              });
        
          });
         
         
        
        
        })
        .catch((reason) => {
          console.log("erreur: ", reason);
        });
    };
  
const uploadPicture=(name,path,type)=>{
    //need to set state of file name
 
     RNFS.readFile(path, 'base64').then(res => {
         
      // console.log("read file hedi:",res)
 
      let form_data=new FormData();
      form_data.append("img",res);
      form_data.append("name",name);
      form_data.append("type",type);
      let request = fetch(
        UPLOAD_ENDPOINT 
          ,
         {
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
       console.log("read file error:",err)
     });
 }
 const saveReservation=async ()=>{
     const data=await AsyncStorage.getItem(CURRENT_USER_KEY);
     if(data!=null){
         const userData=JSON.parse(data);
         //setCurrentUser({...userData});
    
     let name=new Date().getTime()+"";
     uploadPicture(name,signature_canva_path,"signature");
     let oldreservation=reservation;
     oldreservation.checkin_signature=name+".png";
     oldreservation.checkin_date=name;
     oldreservation.employe_id=userData.id
     setReservation(oldreservation);
     firestoreReservation.add(reservation).then(res=>{
         console.log("reservation added",res);
     }).catch(e=>{
         console.log("error when add reservation");
     })
 }
  }
   
  useEffect(() => {
      getHouses();
     // console.log("houses :", houses);
    },[] );
    
  if(loading){
      return (<View><Text>loading</Text></View>)
  }

    return (
       <ScrollView>
           <View>
               <Text>Sélectionner la maison</Text>
               <DropDownPicker
              
               items={housesItems} 
               placeholder="selectionner une maison" 
               onChangeValue={(val)=>{let old_reservation=reservation; old_reservation.house_id=val;setReservation(old_reservation)}} 
               searchable={true} 
              
               containerStyle={{height:300}}  ></DropDownPicker>
          <Text>Nom du client</Text>
          <TextInput placeholder="nom du client"></TextInput>
          <Text>Prenom du client</Text>
          <TextInput placeholder="prenom du client"></TextInput>
          <Text>Email du client</Text>
          <TextInput placeholder="Email du client"></TextInput>
          <Text>Signature client</Text>
          <View style={{ width:SCREEN_WIDTH,height:300, flexDirection: 'row',borderColor:"black",borderStyle:"solid",borderWidth:1 }}>
          <RNSketchCanvas
            containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
            canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}
      
            undoComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>retour</Text></View>}
            clearComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>vider</Text></View>}

            strokeComponent={color => (
              <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
            )}
            strokeSelectedComponent={(color, index, changed) => {
              return (
                <View style={[{ backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]} />
              )
            }}
            strokeWidthComponent={(w) => {
              return (<View style={styles.strokeWidthButton}>
                <View  style={{
                  backgroundColor: 'white', marginHorizontal: 2.5,
                  width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2
                }} />
              </View>
            )}}
            onSketchSaved={(r,p)=>{
                //uploadPicture(p,"signature")
                setSignature_canva_path(p);
              
            }}
            saveComponent={<View style={styles.functionButton}><Text style={{color: 'white'}}>Confirmer</Text></View>}

            savePreference={() => {
              return {
                folder: 'RNSketchCanvas',
                filename: String(Math.ceil(Math.random() * 100000000)),
                transparent: false,
                imageType: 'png'
              }
            }}
          />
         
        </View>
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
      <View>
          <TouchableOpacity onPress={()=>{saveReservation()}}>
              <Text>Suivant</Text>
          </TouchableOpacity>
      </View>


           </View>

       </ScrollView>
    )
}


const styles=StyleSheet.create({
    dropdown_icon:{
        width:50,
        height:50,
        borderRadius:25
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 70,
        backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
      }
})
export default AddReservation
