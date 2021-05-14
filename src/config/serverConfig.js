import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

const db = firestore();

const firestorage = storage();

export { firestorage, db };
