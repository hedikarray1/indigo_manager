import React, { useState } from "react";
import { Image, Platform, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { TapGestureHandler } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { BORDER_INPUTS, MAIN_BLUE } from "../../../config/Colors";
import {
  SCREEN_WIDTH,
  DataBaseRef,
  FirebaseStorage,
} from "../../../config/Constant";
import Toast from "react-native-toast-message";
import { ImageRef } from "../../../config/ImageRef";
import ImagePicker from "react-native-image-crop-picker";
import { db, firestorage } from "../../../config/serverConfig";
export default function AddHouse() {
  const firestoreHouse = db.collection(DataBaseRef.house);
  const firebaseStoreHouse = firestorage.ref(FirebaseStorage.house);
  const [house, setHouse] = useState({
    title: "",
    description: "",
    status: 0,
    picture: "",
    picture_data: "",
  });
  const [houseDataError, setHouseDataError] = useState({
    title: "",
    description: "",
    picture: "",
  });
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

  pickImage = async () => {
    let myoldState = house;
    myoldState.picture_data = "value";
    setHouse({ ...myoldState });

    ImagePicker.openPicker({
      width: 500,
      height: 400,
      //cropping: true
    }).then((image) => {
      console.log(image);
      ImagePicker.openCropper({
        path: image.path,
        width: 500,
        height: 400,
      }).then((image1) => {
        console.log(image1);
        let myoldState = house;
        myoldState.picture_data = image1.path;
        setHouse({ ...myoldState });

        console.log("setted picture data", house.picture_data);
      });
    });
  };

  uploadImage = async () => {
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
  uriToBlob = (uri) => {
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
    await uploadImage();
    firestoreHouse
      .add({
        title: house.title,
        description: house.description,
        picture: house.picture,
        status: house.status,
      })
      .then(async () => {
        console.log("add success");

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
    <>
      <ScrollView style={styles.scroll_view}>
        <View style={styles.main_container}>
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
                      ? { uri: house.picture_data }
                      : ImageRef.house_add_image
                  }
                ></Image>
              </TouchableOpacity>
            </Card>
            <Text style={styles.txt_error_message}>
              {houseDataError.picture}
            </Text>
          </View>
          <TapGestureHandler onHandlerStateChange={verifData}>
            <View style={styles.button}>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", color: "white" }}
              >
                Ajouter
              </Text>
            </View>
          </TapGestureHandler>
        </View>
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll_view: {
    flex: 1,
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
