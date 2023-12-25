import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATrKHhob2sa-bwNO7AasgUGZLhBkm4LKE",
  authDomain: "chat-app-1602f.firebaseapp.com",
  projectId: "chat-app-1602f",
  storageBucket: "chat-app-1602f.appspot.com",
  messagingSenderId: "1001078087412",
  appId: "1:1001078087412:web:6fabd42779c824172b88a1",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const fireStoreDB = getFirestore(app);

export { app, firebaseAuth, fireStoreDB };
