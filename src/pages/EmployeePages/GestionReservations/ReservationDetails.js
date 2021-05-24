import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native'
import { DataBaseRef } from '../../../config/Constant';
import { db } from '../../../config/serverConfig';

function ReservationDetails(props) {

    const firestoreReservation = db.collection(DataBaseRef.reservation);
    const firestoreHouse = db.collection(DataBaseRef.house);
    const firestoreUser = db.collection(DataBaseRef.user);
    const firestoreCheckItem = db.collection(DataBaseRef.checkItem);
  

const[reservation,setResevation]=useState({});
const[houseitems,setHouseItems]=useState([]);
const[checkItems,setCheckItems]=useState([]);
const[loding,setLoading]=useState(true);
const[reservation_id,setReservation_id]=useState(props.route.params.id);
const[showFormCheckout,setShowFormCheckout]=useState(false);
const[showModalCheckOutItems,setShowModalCheckOutItems]=useState(false);
useEffect(() => {

    getReservation();
}, []);
useEffect(() => {

}, [reservation]);


useEffect(() => {

}, [houseitems]);

useEffect(() => {

}, [checkItems]);


const getReservation=()=>{
    firestoreReservation.doc(reservation_id).get().then((snapshot)=>{
        firestoreHouse.doc(snapshot.data().house_id).get().then((snapshot1) => {
            firestoreUser.doc(snapshot.data().employe_id).get().then((snapshot2) => {
               firestoreCheckItem.where("reservation_id","==",snapshot.id).get().then((snapshot3)=>{
                   setResevation({...reservation, id: snapshot.id, house_id: snapshot.data().house_id, house_title: snapshot1.data().title, house_picture: HOUSE_PICTURE_URL+snapshot1.data().picture, customer_firstname: item.data().customer_firstname, customer_lastname: item.data().customer_lastname, customer_email: item.data().customer_email, income_date: item.data().income_date, outcome_date: item.data().outcome_date, checkin_date: item.data().checkin_date, checkout_date: item.data().checkout_date, employe_firstname: snapshot2.data().firstname, employe_lastname: snapshot2.data().lastname })
                if(snapshot3.empty){

                }else{
                 let   checks=[]

                    snapshot3.forEach((item,index)=>{
                        if(item.data().is_checkin==true){
                            setShowFormCheckout(true);
                        }
checks.push({id:item.id,title:item.data().title,description:item.data().description,picture:item.data().picture,state:item.data().state,observation:item.data().observation,is_checkin:item.data().is_checkin})
                        if(index>=snapshot3.size-1){
                                setCheckItems(checks);
                        }
                    })
                }
               });
            })
        })

    });
}



if(loading){
    return(
        <Text>loading</Text>
    )
}

    return (
   <ScrollView>
<View>
<Text>{reservation.id}</Text>
<Text>{reservation.house_id}</Text>
<Text>{reservation.customer_firstname}</Text>

{showFormCheckout?(
    <TouchableOpacity onPress={()=>{showModalCheckOutItems(true)}}>
    <Text>Verifier les options</Text>
    </TouchableOpacity>
    
):null}
</View>
   </ScrollView>
    )
}

export default ReservationDetails
