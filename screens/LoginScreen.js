import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Log } from "../assets";
import { UserInp } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, firebaseAuth } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { SET_USER } from "../context/actions/userActions";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidation, setGetEmailValidation] = useState(false);

  const screenWidth = Math.round(Dimensions.get("window").width);

  const nav = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (getEmailValidation && email !== "") {
      await signInWithEmailAndPassword(firebaseAuth, email, password)
        .then((useCred) => {
          if (useCred) {
            getDoc(doc(fireStoreDB, "users", useCred?.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  console.log("user Data :", docSnap.data());
                  dispatch(SET_USER(docSnap.data()));
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error :", err.message);
        });
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Image
        source={Log}
        resizeMode="cover"
        style={{ height: 400, width: screenWidth, marginBottom: 60 }}
      />

      <View style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
        <UserInp
          placeholder="Email"
          isPass={false}
          setStateValue={setEmail}
          setGetEmailValidation={setGetEmailValidation}
        />
        <UserInp
          placeholder="Password"
          isPass={true}
          setStateValue={setPassword}
        />
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderColor: "gray",
            borderWidth: 2,
            padding: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ fontSize: 17 }}>Sign In</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text>Dont have an account?</Text>
          <TouchableOpacity onPress={() => nav.navigate("SignUpScreen")}>
            <Text style={{ fontWeight: "bold" }}>Create account ❤️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
