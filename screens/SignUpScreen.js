import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { Bg, Reg } from "../assets";
import { useNavigation } from "@react-navigation/native";
import { UserInp } from "../components";
import { avatars } from "../Utils/supports";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { fireStoreDB, firebaseAuth } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";
const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState();
  const [password, setPassword] = useState("");
  const [isAvatar, setIsAvatar] = useState(false);
  const [avatar, setAvatar] = useState(avatars[3]?.image.asset.url);
  const [getEmailValidation, setGetEmailValidation] = useState(false);

  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const nav = useNavigation();

  const handleAvatar = (item) => {
    setAvatar(item?.image.asset.url);
    setIsAvatar(false);
  };

  const handleSignUp = async () => {
    if (getEmailValidation && email !== "") {
      await createUserWithEmailAndPassword(firebaseAuth, email, password).then(
        (useCred) => {
          const data = {
            _id: useCred?.user.uid,
            fullName: name,
            profilePic: avatar,
            providerData: useCred.user.providerData[0],
          };
          setDoc(doc(fireStoreDB, "users", useCred?.user.uid), data).then(
            () => {
              nav.navigate("LoginScreen");
            }
          );
        }
      );
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
        source={Reg}
        resizeMode="cover"
        style={{ height: 400, width: screenWidth, margin: 40 }}
      />
      {isAvatar && (
        <>
          <View
            style={{
              position: "absolute",
              zIndex: 10,
              width: screenWidth,
              height: screenHeight,
              // backgroundColor: "red",
            }}
          >
            <ScrollView>
              <BlurView
                style={{
                  width: screenWidth,
                  height: screenHeight,

                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  marginTop: 45,
                }}
                intensity={40}
                tint="light"
              >
                {avatars?.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleAvatar(item)}
                    key={item._id}
                    style={{
                      position: "relative",
                      width: 90,
                      marginTop: 28,
                      borderColor: "grey",
                      padding: 5,
                      borderRadius: 1,
                      borderWidth: 2,
                    }}
                  >
                    <Image
                      source={{ uri: item?.image.asset.url }}
                      style={{
                        resizeMode: "contain",

                        width: "auto",
                        height: 100,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </BlurView>
            </ScrollView>
          </View>
        </>
      )}
      <View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            paddingBottom: 5,
            color: "gray",
          }}
        >
          Create Free Account
        </Text>
      </View>
      <View
        style={{
          width: "auto",
          margin: 20,
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => setIsAvatar(true)}
          style={{
            width: 70,
            height: 67,
            borderRadius: 50,
            borderWidth: 2,
            position: "relative",
            borderColor: "gray",
          }}
        >
          <Image
            source={{ uri: avatar }}
            style={{ resizeMode: "contain", width: 65, height: 60 }}
          />
          <View
            style={{
              width: 30,
              height: 30,
              position: "absolute",
              top: -10,
              right: -10,
              justifyContent: "center",
              borderRadius: 10,
              borderWidth: 1,
              alignItems: "center",
              backgroundColor: "gray",
            }}
          >
            <MaterialIcons name="edit" size={18} color={"#fff"} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ alignItems: "center", justifyContent: "center", gap: 10 }}>
        <UserInp
          placeholder="Full Name"
          isPass={false}
          setStateValue={setName}
        />

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
          onPress={handleSignUp}
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
          <Text>Have an account ?</Text>
          <TouchableOpacity onPress={() => nav.navigate("LoginScreen")}>
            <Text style={{ fontWeight: "bold" }}>Sign In ❤️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
