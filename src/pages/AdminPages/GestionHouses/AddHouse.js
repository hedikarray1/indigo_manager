import React, { useEffect, useState } from "react";
import { Image, Platform, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { BORDER_INPUTS, MAIN_BLUE, white } from "../../../config/Colors";
import * as RNFS from 'react-native-fs';

import {
  UPLOAD_ENDPOINT,
  SCREEN_WIDTH,
  DataBaseRef,
  FirebaseStorage,
  SCREEN_HEIGHT,
} from "../../../config/Constant";
import Toast from "react-native-toast-message";
import { ImageRef } from "../../../config/ImageRef";
import ImagePicker from "react-native-image-crop-picker";
import { db, firestorage } from "../../../config/serverConfig";
import { RFPercentage } from "react-native-responsive-fontsize";
export default function AddHouse() {
  const firestoreHouse = db.collection(DataBaseRef.house);
  const firestoreHouseItem= db.collection(DataBaseRef.houseItem);
  const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);
  const [house, setHouse] = useState({
    id:"",
    title: "",
    description: "",
    status: 0,
    picture: "",
    picture_data: "",
  });
  const[page,setPage]=useState(0);

  const [houseDataError, setHouseDataError] = useState({
    title: "",
    description: "",
    picture: "",
  });

  const[houseItems,setHouseItems]=useState([]);

    
  const onChangeTextHouseItem = (index,field, value) => {
    let myoldState = houseItems;
  

    setHouseItems((old)=>old.map((item,ind)=>{
     return  ind==index?{...item,[field]:value}:item
    })
  );
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


  const onChangeText = (field, value) => {
    let myoldState = house;
    myoldState[field] = value;
    setHouse({ ...myoldState });
  };

  const verifData = () => {
    let dataError = {
      title: "",
      description: "",
      picture: "",
    };
    if (house.title != "" && house.picture_data != "") {
      addHouse();
    } else {
      if (house.title === "") {
        dataError.title = "ce champ ne doit pas être vide";
      }
      if (house.picture_data === "") {
        dataError.picture = "ce champ ne doit pas être vide";
      }
    }
    setHouseDataError(dataError);
  };
  
  useEffect(() => {
   
    console.log("houses :", houseItems);
  },[houseItems] );
  
  useEffect(() => {
   
    console.log("houses :", houseItems);
  },[] );
  
  /*
  useEffect = () => {
   (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Echec de l'ouverture de la galerie!");
        }
      }
    })();
  };
*/



 




 const pickImage = async () => {
    let myoldState = house;
    
    myoldState.picture_data = "value";
    setHouse({ ...myoldState });

    ImagePicker.openPicker({
      width: 500,
      includeBase64:true,
      height: 400,
      //cropping: true
    }).then((image) => {
      console.log(image);
      ImagePicker.openCropper({
        path: image.path,
        width: 500,
        height: 400,
        includeBase64:true
      }).then((image1) => {
        console.log(image1);
        
        let myoldState = house;
        myoldState.picture_data = image1.data;
        myoldState.picture_path = image1.path;
        setHouse({ ...myoldState });

        console.log("setted picture data", house.picture_data);
      });
    });
  };


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
       onChangeTextHouseItem(index,"picture",image1.data)

        console.log("setted picture data item", house.picture_data);
      });
    });
  };


const addHouseItem=()=>{
  console.log("to add house item")
 let old_state=houseItems;
 // old_state.push({title:"",picture:"",description:""});
  setHouseItems([...houseItems,{title:"",picture:"",description:""}])
}

const  uploadImage = async () => {
    console.log("uploadImage cover_picture_data:", house.picture_data);
    const uri = house.picture_data;
    const filename = uri.substring(uri.lastIndexOf("/") + 1);

    let myoldState = house;
    myoldState.picture = filename;
    setHouse({ ...myoldState });

    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    uriToBlob(uri).then((blob) => {
      firebaseStoreHouse
        .child(filename)
        .put(blob)
        .then((res) => {})
        .catch((error) => {
          console.log("erreur ", error);
        });
    });
  };


 const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const addHouse = async () => {
  //  await uploadImage();
    let namepictureHouse =new Date().getTime()+"";
    uploadPicture(namepictureHouse,house.picture_data,"house");
    firestoreHouse
      .add({
        title: house.title,
        description: house.description,
        picture: namepictureHouse+".png",
        status: house.status,
      })
      .then(async (res) => {
        console.log("add success");
setHouse({...house,id:res.id})
houseItems.forEach((item,index)=>{
  let name=new Date().getTime()+"";
  uploadPicture(name,item.picture,"item")
    firestoreHouseItem.add({title:item.title,description:item.description,picture:name+".png",house_id:res.id}).then((res)=>{
      console.log("item number",index,"added")})
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Succès ",
        text2: "Maison ajouter avec succès.",
        visibilityTime: 500,
        autoHide: true,
        onPress: () => {
          Toast.hide();
        },
        onHide: () => {
          this.props.navigation.goBack();
        },
      });
  })
   
      })
      .catch((reason) => {
        console.log("error :", reason);

        Toast.show({
          type: "error",
          position: "bottom",
          text1: "Erreur",
          text2: "Erreur lors l'ajout de la maison",
          visibilityTime: 2000,
          autoHide: true,
          onPress: () => {
            Toast.hide();
          },
        });
      });
  };

  return (
    <View style={styles.full_page}>
      <ScrollView style={styles.scroll_view}>
     {page==0?(   <View style={styles.main_container}>
          <View style={styles.row_field}>
            <TextInput
              placeholder="Titre"
              value={house.title}
              style={styles.text_input}
              onChangeText={(e) => {
                onChangeText("title", e);
              }}
            />
            <Text style={styles.txt_error_message}>{houseDataError.title}</Text>
          </View>
          <View style={styles.row_field}>
            <TextInput
              placeholder="Description"
              value={house.description}
              style={styles.text_input}
              multiline
              numberOfLines={4}
              onChangeText={(e) => {
                onChangeText("description", e);
              }}
            />
            <Text style={styles.txt_error_message}>
              {houseDataError.description}
            </Text>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Card containerStyles={styles.text_input}>
              <TouchableOpacity
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onPress={() => pickImage()}
              >
                <Image
                  style={{
                    width: SCREEN_WIDTH * 0.5,
                    height: SCREEN_WIDTH * 0.5 * 0.8,
                    borderColor: MAIN_BLUE,
                    borderWidth: 1,
                  }}
                  source={
                    house.picture_data !== ""
                      ? { uri: house.picture_path }
                      : ImageRef.house_add_image
                  }
                ></Image>
              </TouchableOpacity>
            </Card>
            <Text style={styles.txt_error_message}>
              {houseDataError.picture}
            </Text>
          </View>
      
        </View>
     ):<View style={styles.main_container}>
         <TouchableOpacity onPress={()=>{addHouseItem()}}>
     <View style={styles.button}>
       <Text
         style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
       >
         Ajouter une option
       </Text>
     </View>
   </TouchableOpacity>

     {
       houseItems.map((item,index)=>{
         return(
           <View key={index} style={styles.house_item_container}>
             <TextInput value={item.title} style={styles.text_input} onChangeText={(v)=>{onChangeTextHouseItem(index,"title",v)}}></TextInput>
           <TextInput value={item.description}  style={styles.text_input} onChangeText={(v)=>{onChangeTextHouseItem(index,"description",v)}}/>
           <TouchableOpacity style={styles.button} onPress={()=>{pickImageItem(index)}} >
         <Text style={styles.butoon_page_text}>sélectionner une image</Text>
       </TouchableOpacity>
           </View>
         )
       })
     }
     </View>}
      </ScrollView>
     <View style={styles.next_space}>
      {page==1? <TouchableOpacity style={styles.button_page} onPress={()=>{ if(page==0){setPage(1)}else{setPage(0)}}}>
         <Text style={styles.butoon_page_text}>précédent</Text>
       </TouchableOpacity>:null}
       <TouchableOpacity style={styles.button_page} onPress={()=>{ if(page==0){setPage(1)}else{verifData()}}}>
         <Text style={styles.butoon_page_text}>{page==1?"terminer":"suivant"}</Text>
       </TouchableOpacity>
     </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

const styles = StyleSheet.create({
  house_item_container:{
    backgroundColor:"white",
    height:SCREEN_HEIGHT*0.3,
    width:"96%",
    marginHorizontal:"2%",

    marginVertical:5,
    elevation:5,
   
  },
  button_page:{
     marginVertical:5,
    height:50,
    marginHorizontal:"5%",
    borderRadius:20,
    width:"40%",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:MAIN_BLUE
   },
  
  butoon_page_text:{
    color:white,
    fontWeight:"700",
    fontSize:RFPercentage(2.1)  },
  full_page:{
flex:1
  },
  next_space:{
  flexDirection:"row",
  justifyContent:"flex-end",
  
    height:SCREEN_HEIGHT*0.1,
    width:SCREEN_WIDTH
  },
  scroll_view: {
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT*0.9
  },
  main_container: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginTop: 30,
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
