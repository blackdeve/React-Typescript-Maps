import * as firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyAqbdldSWJPRfc77Y08rL_1hRrupi2bOqA",
  authDomain: "powairtest.firebaseapp.com",
  databaseURL: "https://powairtest.firebaseio.com",
  projectId: "powairtest",
  storageBucket: "powairtest.appspot.com",
  messagingSenderId: "204508556365"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const db = firebase.database();