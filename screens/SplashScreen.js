import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { fireStoreDB, firebaseAuth } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { SET_USER } from "../context/actions/userActions";
import { useDispatch } from "react-redux";

const SplashScreen = () => {
  const nav = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    checkLoggedUser();
  }, []);

  const checkLoggedUser = async () => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred?.uid) {
        getDoc(doc(fireStoreDB, "users", userCred?.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              console.log("user Data :", docSnap.data());
              dispatch(SET_USER(docSnap.data()));
            }
          })
          .then(() => {
            setTimeout(() => {
              nav.replace("HomeScreen");
            }, 2000);
          });
      } else {
        nav.replace("LoginScreen");
      }
    });
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;
