import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableOpacityBase, View } from 'react-native'
import { white ,MAIN_BLUE, black} from '../../config/Colors';
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-community/async-storage';
import { CURRENT_USER_KEY, DataBaseRef, FirebaseStorage, USER_PICTURE_URL } from '../../config/Constant';
import { TextInput } from 'react-native-gesture-handler';
import { db, firestorage } from '../../config/serverConfig';
const { height, width } = Dimensions.get("window");
const firestoreUser = db.collection(DataBaseRef.user);
const firebaseStoreUser = firestorage.ref(FirebaseStorage.user);

function Profile(props) {



  const [currentUser, setCurrentUser] = useState({
    id: 1,
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    picture:""
  });
const [changePasswordForm,setChangePasswordForm]=useState(false);
const [PasswordFormData,setPasswordFormData]=useState({old_password:"",new_password:"",confirm_password:"",password_form_error:""});
  useEffect(() => {
   loadFromStorage();
  }, [])

  const loadFromStorage= async ()=>{
      const data=await AsyncStorage.getItem(CURRENT_USER_KEY);
      if(data!=null){
          const userData=JSON.parse(data);
          setCurrentUser({...userData});
      }
  }
   const logout=async ()=>{
       AsyncStorage.clear();
       props.navigation.navigate("LoginScreen")
   }

   const UpdatePassword=()=>{
       const old_state=PasswordFormData;
       old_state.password_form_error=""
     
       firestoreUser.doc(currentUser.id).get().then((snapshot1)=>{
           if(snapshot1.data().password===PasswordFormData.old_password)
           {
            if(PasswordFormData.new_password===PasswordFormData.confirm_password && PasswordFormData.confirm_password.length>5 ){

                firestoreUser.doc(currentUser.id).update({password:PasswordFormData.new_password}).then((snapshot)=>{
                    console.log("update success");
                })
            }else{
                if(PasswordFormData.confirm_password.length<=5 || PasswordFormData.new_password.length<=5 ){
                    old_state.password_form_error="les mots de passes doivent contenir au moins 6 caractères"
                    console.log("les mots de passes doivent contenir au moins 6 caractères")

                }else{
                    old_state.password_form_error="le nouveau mot de passe ne convient pas au mot de passe de confirmation"
console.log("le nouveau mot de passe ne convient pas au mot de passe de confirmation")
                }
            }
           }else{
            console.log("old password doesn't match the real password ");
                old_state.password_form_error="le mot de passe actuel est inccorect"
          
           }
       }).catch((e)=>{
           console.log("get user by id error")
       })

       setPasswordFormData({...old_state})
   }

   const onchangePasswordForm=(attribute,value)=>{
let old_state=PasswordFormData;
old_state[attribute]=value;
setChangePasswordForm({...old_state});
console.log("apres modification des champs",changePasswordForm)
   }
    return (
    <ScrollView>
             <View style={styles.main_container}>
             <Image style={styles.static_picture_cover} source={require("../../assets/images/login_cover.jpg")} />

             
             <View style={styles.user_simple_data}>
                <Image style={styles.user_picture} source={{uri: USER_PICTURE_URL+currentUser.picture}}/>
               <TouchableOpacity style={styles.edit_button}><Text style={{display:"flex",justifyContent:"center",alignItems:"center"}}> <IconAntDesign  name="edit" size={25} color="#1e73be" /></Text></TouchableOpacity>
               <Text style={styles.username}>{currentUser.firstname} {currentUser.lastname}</Text>
               <View style={styles.personal_info_container}> 
                   <View style={styles.personal_info_row}>
                       <Text style={styles.personal_info_row_label}>Nom</Text>
                       <Text style={styles.personal_info_row_value}>{currentUser.lastname}</Text>
                   </View>
                   <View style={styles.personal_info_row}>
                       <Text style={styles.personal_info_row_label}>Prénom</Text>
                       <Text style={styles.personal_info_row_value}>{currentUser.firstname}</Text>
                   </View>
                   <View style={styles.personal_info_row}>
                       <Text style={styles.personal_info_row_label}>Email</Text>
                       <Text style={styles.personal_info_row_value}>{currentUser.email}</Text>
                   </View>
               </View>
             </View>
          
          <View style={styles.user_actions_container}>
         
             <TouchableOpacity onPress={()=>{setChangePasswordForm(!changePasswordForm)}} style={styles.password_edit_button}>
                 <Text style={styles.password_edit_button_text}>Changer le mot de passe</Text>
             </TouchableOpacity>
            {changePasswordForm? ( <View style={styles.user_password_container}> 
             <TextInput onChangeText={(e)=>{ onchangePasswordForm("old_password",e) }} placeholder="Mot de passe actuel" />
             <TextInput  onChangeText={(e)=>{ onchangePasswordForm("new_password",e) }} placeholder="Nouveau mot de passe" />
             <TextInput  onChangeText={(e)=>{ onchangePasswordForm("confirm_password",e) }} placeholder="Confimer le mot de passe" />
             <Text >{PasswordFormData.password_form_error}</Text>
             <TouchableOpacity onPress={()=>{UpdatePassword()}} style={styles.password_edit_button}>
                 <Text style={styles.password_edit_button_text}>Modifier</Text>
             </TouchableOpacity>

             </View>):null}
          
             <TouchableOpacity onPress={()=>{logout()}} style={styles.user_logout_button}>
                 <Text style={styles.password_edit_button_text}>Déconnexion</Text>
             </TouchableOpacity>
          </View>
            
            

         </View>
   
    </ScrollView>
     )
}

const styles=StyleSheet.create(
    {personal_info_row_value:{
        fontSize:RFPercentage(2),
        fontWeight:"600",
        color:black
    },
    personal_info_row_label:{
        fontSize:RFPercentage(2.5),
        fontWeight:"700",
        textTransform:"capitalize",
        color:MAIN_BLUE
    },
        personal_info_container:{
            display:"flex",
            justifyContent:"center",
            flexDirection:"column",
            alignItems:"center",
            width:"90%",
            padding:10
        }, 
        personal_info_row:{
            width:"100%",
            display:"flex",
            flexDirection:"row",
            justifyContent:"space-between",
            marginTop:5
    },
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
alignItems:"center",
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
        user_actions_container:{
            position:"absolute",
            top: (7*height)/12 +10,
            
            width:width*0.9,
            left:0.05*width,
        },
        user_password_container:{
          
           
            borderRadius:20,
            display:"flex",
            flexDirection:"column",
alignItems:"center",
            backgroundColor:white,
            shadowOffset:{width:2,height:2},
            shadowColor:"black",
            shadowOpacity:0.2,
            elevation: 2,
        },
        password_edit_button:{
            marginVertical:5,
            height:50,
            borderRadius:20,
            width:"100%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"#008791"

        },
        password_edit_button_text:{
            color:white,
            fontWeight:"700",
            fontSize:RFPercentage(2.1)
        },
        user_logout_button:{
            marginVertical:5,
            height:50,
            borderRadius:20,
            width:"100%",
            display:"flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:MAIN_BLUE
        },
    }
)

export default Profile;
