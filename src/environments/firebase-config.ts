// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNCXVGlJUTtxJ5-sNdQO_wdb_Yg9rEiAY",
  authDomain: "chatup-66815.firebaseapp.com",
  projectId: "chatup-66815",
  storageBucket: "chatup-66815.appspot.com",
  messagingSenderId: "577246300869",
  appId: "1:577246300869:web:ee0984e7608c199c997eac",
  measurementId: "G-PVFKXTBYFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { firebaseConfig };
