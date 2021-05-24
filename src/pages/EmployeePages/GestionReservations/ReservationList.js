import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native'
import { DataBaseRef, HOUSE_PICTURE_URL, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../config/Constant';
import { db } from '../../../config/serverConfig';
import LinearGradient from 'react-native-linear-gradient' // import LinearGradient
import { white } from '../../../config/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import IconAntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto"
import FontAwesome from "react-native-vector-icons/FontAwesome"


function ReservationList(props) {
    const firestoreReservation = db.collection(DataBaseRef.reservation);
    const firestoreHouse = db.collection(DataBaseRef.house);
    const firestoreUser = db.collection(DataBaseRef.user);

    const [reservations, setReservations] = useState([]);
    const getReservations = () => {
        firestoreReservation.get().then((snapshot) => {

            if (snapshot.empty) {

            } else {
                let resers = [];
                snapshot.forEach((item, index) => {

                    firestoreHouse.doc(item.data().house_id).get().then((snapshot1) => {
                        firestoreUser.doc(item.data().employe_id).get().then((snapshot2) => {
                            resers.push({ id: item.id, house_id: item.data().house_id, house_title: snapshot1.data().title, house_picture: HOUSE_PICTURE_URL+snapshot1.data().picture, customer_firstname: item.data().customer_firstname, customer_lastname: item.data().customer_lastname, customer_email: item.data().customer_email, income_date: item.data().income_date, outcome_date: item.data().outcome_date, checkin_date: item.data().checkin_date, checkout_date: item.data().checkout_date, employe_firstname: snapshot2.data().firstname, employe_lastname: snapshot2.data().lastname })
                            if (index >= snapshot.size - 1) {
                                setReservations(resers);
                            }
                        })
                    })


                });
            }

        });
    }
    useEffect(() => {
        getReservations();
    }, []);
    useEffect(() => {

    }, [reservations]);

    return (
        <ScrollView style={{ backgroundColor: "white" }}>
            {
                reservations.map((item, index) => (
                    <View style={styles.item_card_container}>


                        <Image style={styles.picture_cover} source={{ uri: HOUSE_PICTURE_URL+"3aadec82-a309-4ee9-a9e3-a2ed8049eef4.png"}}></Image>
                        <LinearGradient

                            colors={['#040c1bbf', '#1d51b5bf']}
                            start={{ x: 0.4, y: 0.2 }}
                            style={styles.picture_cover_filter_color}        >
                            <Text style={styles.house_title}>{item.house_title}</Text>

                            <Text style={styles.customer_data}> <IconAntDesign name="user" size={20} color="white" />  {item.customer_firstname +" "+ item.customer_lastname} </Text>
                            <Text style={styles.customer_data}> <Fontisto name="email" size={20} color="white" />  {item.customer_email} </Text>
                            <Text style={styles.customer_data}> <Fontisto name="email" size={20} color="white" />  {item.customer_email} </Text>

                            <View style={styles.date_container}>

                                <View style={styles.date_view}>
                                    <Text style={styles.date_text}>   <IconAntDesign name="calendar" color="black" size={15} /> 11/04/2021</Text>
                                </View>
                                <View style={styles.date_view}>
                                    <Text style={styles.date_text}>  <IconAntDesign   name="calendar" color="black" size={15} /> 11/04/2021</Text>
                                </View>
                            </View>
                            <Text style={styles.text_details} onPress={()=>{}}>Détails <IconAntDesign  name="arrowright" size={20} color="white" /> </Text>
                            <Text style={styles.text_result} onPress={()=>{props.navigation.navigate("ReservationDetails", {
                            id: item.id,
                          })}}>
                               <FontAwesome name="circle" size={18} color={item.checkout_date==""? "green":"red"} /> {item.checkout_date==""? "check in":"check out"} </Text>

                        </LinearGradient>

                    </View>
                ))
            }
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    text_details:{position:"absolute",right:"3%",bottom:"4%",height:"14%",color: white, fontSize: RFPercentage(2.8), fontFamily:"ChampagneLimousines-Bold" },
    text_result:{position:"absolute",left:"3%",bottom:"4%",color: white,height:"14%", fontSize: RFPercentage(2.5),fontFamily:"ChampagneLimousines-Bold", textTransform: "uppercase" },

    customer_data:{ color: white, fontSize: RFPercentage(2), fontWeight: "600", height:"12%" ,fontFamily:"ChampagneLimousines-Bold"},
    house_title: {marginLeft:5, color: white, fontSize: RFPercentage(2.8),height:"20%",fontFamily:"Evogria"},
    item_card_container: {
        backgroundColor: "red",
        height: SCREEN_HEIGHT * 0.30,
        width: SCREEN_WIDTH * 0.92,
        marginHorizontal: SCREEN_WIDTH * 0.04,
        marginVertical: SCREEN_HEIGHT * 0.01,
        borderRadius: 20,

        elevation: 3,
    },
    picture_cover: {
        position: "absolute",
        borderRadius: 20,
        height: SCREEN_HEIGHT * 0.30,
        width: SCREEN_WIDTH * 0.92,
    },
    picture_cover_filter_color: {
        position: "absolute",
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        height: SCREEN_HEIGHT * 0.3,
        width: SCREEN_WIDTH * 0.92,
    },
    date_view: {
        backgroundColor: "#ffffff94",
        height: 35,
        width: 120,
        borderRadius: 10,
        display: "flex",
        elevation: 2,
        margin: 5,
        justifyContent: "center",
        alignItems: "center"



    },
    date_container: {
        display: "flex",
        width:"100%",
        height:"30%",
        alignItems:"center",
        justifyContent: "space-around",
        flexDirection: "row"
    },
    date_text:{
        fontWeight:"700"
    }
})

export default ReservationList
