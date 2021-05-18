import { Dimensions } from "react-native";
import React from "react";

export const CURRENT_USER_KEY ="current_user";
export const CURRENT_USER_CREDENTIALS_KEY ="current_user_credentials";

export const SERVER_URL="https://indigo-properties.com";
export const UPLOAD_ENDPOINT=SERVER_URL+"/indigo_manager/upload.php"
export const USER_PICTURE_URL=SERVER_URL+"/indigo_manager/user_pictures/"
export const ITEMS_PICTURE_URL=SERVER_URL+"/indigo_manager/items_pictures/"
export const HOUSE_PICTURE_URL=SERVER_URL+"/indigo_manager/house_pictures/"
export const SIGNATURE_PICTURE_URL=SERVER_URL+"/indigo_manager/signature_pictures/"

export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;
export const DataBaseRef = { house: "house",
user:"user",reservation:"reservation" };
export const FirebaseStorage = { house: "house" ,user:"user"};
