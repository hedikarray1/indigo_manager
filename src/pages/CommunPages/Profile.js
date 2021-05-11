import React, { useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableOpacityBase, View } from 'react-native'
import { white ,MAIN_BLUE} from '../../config/Colors';
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { RFPercentage } from 'react-native-responsive-fontsize';
const{height,width}=Dimensions.get("window");
function Profile() {

    const [currentUser,setCurrentUser]=useState({id:1,firstname:"hedi",lastname:"karray", email:"hedi.karray@esprit.tn",role:"employee"});

    return (
    
         <View style={styles.main_container}>
             <Image style={styles.static_picture_cover} source={require("../../assets/images/login_cover.jpg")} />

             
             <View style={styles.user_simple_data}>
                <Image style={styles.user_picture} source={require("../../assets/images/login_cover.jpg")}/>
               <TouchableOpacity style={styles.edit_button}><Text style={{display:"flex",justifyContent:"center",alignItems:"center"}}> <IconAntDesign  name="edit" size={25} color="#1e73be" /></Text></TouchableOpacity>
               <Text style={styles.username}>hedi karray</Text>
             </View>
         </View>
    )
}

const styles=StyleSheet.create(
    {
        username:{
            marginTop:55,
            textAlign:"center",
            fontSize:RFPercentage(3),
       fontWeight:"700",
       textTransform:"capitalize",
       color:MAIN_BLUE
        },
        edit_button:{
      
            width:40,
            height:40,
            borderRadius:50,
            backgroundColor:white,
            shadowOffset:{width:2,height:2},
            shadowColor:"black",
            shadowOpacity:0.2,
            elevation: 2,
            position:"absolute",
            right:-10,
            top:-15
    
        
    },
        main_container:{
height:height,
width:width,
backgroundColor:white
        },
        user_simple_data:{
            position:"absolute",
            top: height/4,
            height:height/3,
            width:width*0.9,
            left:0.05*width,
           
            borderRadius:20,
            display:"flex",
            flexDirection:"column",
            backgroundColor:white,
            shadowOffset:{width:2,height:2},
            shadowColor:"black",
            shadowOpacity:0.2,
            elevation: 2,
        },
        static_picture:{
            margin :5,
            display:"flex",
            flexDirection:"column",
            alignItems: "center",
            padding:5,
          
        },
        static_picture_cover:{
            height:height/3,
            width:width
        },

        user_picture:{
                height:width*0.3,
                width:width*0.3,
                borderRadius:100,
                position:"absolute",
                left:"33%",
                top:"-20%"
        },


    }
)

export default Profile
