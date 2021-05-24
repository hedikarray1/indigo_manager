import React, { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, TouchableOpacityBase } from 'react-native';
import { Image } from 'react-native';
import { Switch } from 'react-native';
import { InteractionManager } from 'react-native';
import { ScrollView, View } from 'react-native'
import { MAIN_BLUE, white } from '../../../config/Colors';
import { DataBaseRef, ITEMS_PICTURE_URL, SCREEN_HEIGHT, SCREEN_WIDTH,UPLOAD_ENDPOINT } from '../../../config/Constant';
import { db } from '../../../config/serverConfig';
import * as RNFS from 'react-native-fs';
import { ImageRef } from "../../../config/ImageRef";
import ImagePicker from "react-native-image-crop-picker";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Text } from 'react-native';
import { Button } from 'react-native';

function AddCheckInItems(props) {
    const firestoreHouseItem = db.collection(DataBaseRef.houseItem);
    const firestoreCheckItem = db.collection(DataBaseRef.checkItem);
    const [houseItems, setHouseItems] = useState([]);
    const [checkItems, setCheckItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
   
        console.log("items :", houseItems);
      },[houseItems] );
      
      useEffect(() => {
   
        console.log("items check :", checkItems);
      },[checkItems] );
      

      useEffect(() => {
   
        getHouseItems();
      },[] );
      

    const onChangeCheckItem = (index, value) => {
    
        setCheckItems((old)=>old.map((item,ind)=>{
         return  ind==index?{...item,["state"]:value}:item
        })
      );
      };



      const onChangeCheckItemObservation = (index, value) => {
    
        setCheckItems((old)=>old.map((item,ind)=>{
         return  ind==index?{...item,["observation"]:value}:item
        })
      );
      };


const onChangePictureCheckItem=(index,value)=>{

    setCheckItems((old)=>old.map((item,ind)=>{
        return  ind==index?{...item,["picture_data"]:value}:item
       })
     );

}


      const pickImageItem = async (index) => {
        // let myoldState = house;
       //  myoldState.picture_data = "value";
        // setHouse({ ...myoldState });
     
         ImagePicker.openPicker({
           width: 500,
           height: 400,
           includeBase64:true
           //cropping: true
         }).then((image) => {
           console.log(image);
           ImagePicker.openCropper({
             path: image.path,
             width: 500,
             height: 400,
           includeBase64:true
           }).then((image1) => {
            // console.log(image1);
             console.log("picture data",image1.data)
            onChangePictureCheckItem(index,"picture",image1.data)
     
           //  console.log("setted picture data item", house.picture_data);
           });
         });
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


const saveAndClose=()=>{

        props.finishCheckinItems(checkItems);
  

}

    const getHouseItems = () => {
        firestoreHouseItem.where("house_id", "==", props.houseId).get().then(async (snapshot) => {
            let chckItems = [];
            let housItems = [];
            if (snapshot.empty) {

            } else {
                snapshot.forEach((item, index) => {

                    housItems.push({ title: item.data().title, description: item.data().description, picture: item.data().picture })
                    chckItems.push({ title: item.data().title, description: item.data().description, picture: item.data().picture, is_checkin: true, state: true, pictureData: "" })
                    if (index >= snapshot.size - 1) {
                        setHouseItems(housItems)
                        setCheckItems(chckItems)
                        setLoading(false);
                    }
                })
            }
        })
    }

    if (loading) {
        return (<Text>loading</Text>)
    }

    return (
        <ScrollView>
            <View>
                {
                    checkItems.map((item, index) => (
                        <View style={styles.check_item_container}>
<Image source={{uri:ITEMS_PICTURE_URL+item.picture}} style={styles.check_item_picture}/>
<View>
    <Text>{item.title}</Text>
    <Text> {item.description} </Text>
</View>
<View style={styles.check_item_action_container}>
<Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.state ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={(val)=>{onChangeCheckItem(index,val)}}
        value={item.state}
      />
     
</View>
{item.state==false?(<View>
    
<TouchableOpacity   onPress={()=>{pickImageItem()}}>
    <Text>photo</Text>
</TouchableOpacity>   
<TextInput placeholder="observation" value={item.observation} onChangeText={(val)=>{onChangeCheckItemObservation(index,val)}}> </TextInput>
</View>
):null}
                        </View>
                    ))
                }

                <TouchableOpacity onPress={()=>{saveAndClose();}}>
                    <Text>Valider</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    check_item_container:{
        backgroundColor:white,
        elevation:2,
        width:SCREEN_WIDTH*0.96,
        height:SCREEN_HEIGHT*0.3,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        margin:SCREEN_WIDTH*0.02,
        
    },
    check_item_picture:{
borderRadius:SCREEN_WIDTH*0.24,
width:SCREEN_WIDTH*0.24,
height:SCREEN_WIDTH*0.24,
borderWidth:1,
borderColor:MAIN_BLUE
    },
    check_item_data:{
display:"flex",
flexDirection:"column",
justifyContent:"flex-start",
alignItems:"flex-start",
height:"100%",
width:"50%"
    },
    check_item_action_container:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        height:"100%",
        width:"25%"
    }
});

export default AddCheckInItems
