import firebase from 'firebase'

// Initialize Firebase
export const firebaseInit = () => {
  let config = {
    apiKey: "AIzaSyCeaE6SXQq7-T5c7f1trAJEB7hv_mowjbs",
    authDomain: "react-rps.firebaseapp.com",
    databaseURL: "https://react-rps.firebaseio.com",
    projectId: "react-rps",
    storageBucket: "react-rps.appspot.com",
    messagingSenderId: "675830051613"
  };
  firebase.initializeApp(config);
  let database = firebase.database()
}
