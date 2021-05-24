import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
} from "react-native";

import Animated, { Easing } from "react-native-reanimated";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import { db, firestorage } from "../../config/serverConfig";
import { CURRENT_USER_KEY, DataBaseRef, FirebaseStorage,CURRENT_USER_CREDENTIALS_KEY } from "../../config/Constant";
import AsyncStorage from "@react-native-community/async-storage";
const { width, height } = Dimensions.get("window");

const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}

const firestoreUser = db.collection(DataBaseRef.user);
const firebaseStoreUser = firestorage.ref(FirebaseStorage.user);

class Login extends Component {

  constructor() {
    super();
    
this.state={
  load_from_storage:false,
  loading:true,
  login_result:true,
  email:"hedi.karray@esprit.tn",
  password:"123456"
}

    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            ),
          ]),
      },
    ]);
    this.onCloseState = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            ),
          ]),
      },
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputZIndex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP,
    });

    this.textInputTranslateY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP,
    });
  }


async checkLoggedUser(){
  const old_state=this.state;
  const userData=await AsyncStorage.getItem(CURRENT_USER_CREDENTIALS_KEY);
  if(userData!==null){
    const userDataParsed=JSON.parse(userData);
    old_state.password=userDataParsed.password;
    old_state.email=userDataParsed.email;
    old_state.load_from_storage=true;
    this.setState(old_state,()=>{console.log("userData is not empty")});
await this.login();
  }else{
    old_state.loading=false;
    old_state.load_from_storage=false;
  }
}

async login(){
  const old_state=this.state;
  firestoreUser.where("email","==",this.state.email).get().then(async (snapshot)=>{
if(snapshot.empty){
  console.log("login get user by email is empty");
old_state.login_result=false;
old_state.loading=false;

this.setState(old_state,()=>{console.log("setted login result to false")});
}else{
  snapshot.forEach(async (res)=>{
    if(res.data().password==this.state.password){
      //save to async storage
let data={user_info:{id:res.id,firstname:res.data().firstname,lastname:res.data().lastname,email:res.data().email,picture:res.data().picture,role:res.data().role},credentials:{email:res.data().email,password:res.data().password}}
await this.saveUserToStorage(data)
//redirect to home page by role
console.log("login success user data :",res.data())
this.props.navigation.navigate("AdminBottomTabNavigator")
    }else{
      console.log("login get user by password is empty");
      old_state.login_result=false;
      old_state.loading=false;
      
      this.setState(old_state,()=>{console.log("setted login result to false")});
    }
  })
}
  }).catch((e)=>{console.log("login get email error:",e)})
}


async saveUserToStorage(data){
  const user_data=JSON.stringify(data.user_info);
  const credentials=JSON.stringify(data.credentials);
  await AsyncStorage.setItem(CURRENT_USER_KEY,user_data);
  await AsyncStorage.setItem(CURRENT_USER_CREDENTIALS_KEY,credentials);

}


  onChange(attribute,value){
    const old_state=this.state;
    old_state[attribute]=value;
    this.setState(old_state,()=>{
      console.log(attribute,"changed to ",value)
    })

}
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }],
          }}
        >
          <Image
            source={require("../../assets/images/login_cover.jpg")}
            style={{ flex: 1, height: null, width: null }}
          />
        </Animated.View>
        <View style={{ height: height / 3, justifyContent: "center" }}>
          <TapGestureHandler enabled={true}  onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                transform: [{ translateY: this.buttonY }],
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                SE CONNECTER
              </Text>
            </Animated.View>
          </TapGestureHandler>

          <Animated.View
            style={{
              ...StyleSheet.absoluteFill,
              ...styles.inputs_form,
              zIndex: this.textInputAIndex,
              opacity: this.textInputOpacity,
              transform: [{ translateY: this.textInputTranslateY }],
            }}
          >
            <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style={styles.close_button}>
                <Animated.Text
                  style={{
                    fontSize: 15,
                    transform: [{ rotate: concat(this.rotateCross, "deg") }],
                  }}
                >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            <TextInput
              placeholder="nom d'utilisateur"
              value={this.state.email}
              style={styles.text_input}
              onChangeText={(e)=>{this.onChange("email",e)}}
            />
            <TextInput placeholder="mot de passe" style={styles.text_input}
             value={this.state.password}
              onChangeText={(e)=>{this.onChange("password",e)}}
            />
            <TapGestureHandler
              onHandlerStateChange={() =>

               this.login()
              }
            >
              <Animated.View
                style={{
                  ...styles.button,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  SE CONNECTER
                </Text>
              </Animated.View>
            </TapGestureHandler>
          </Animated.View>
        </View>
      </View>
    );
  }
}
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "white",
    height: 55,
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
  close_button: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 20,
    top: -20,
    left: width / 2 - 20,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 2,
  },
  inputs_form: {
    height: height / 3,
    top: null,
    justifyContent: "center",
  },
  text_input: {
    height: 50,
    borderRadius: 25,
    marginHorizontal: 30,
    marginVertical: 5,
    borderWidth: 0.5,
    paddingLeft: 10,
    borderColor: "rgba(0,0,0,0.5)",
  },
});
