import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { fireStoreDB } from "../config/firebase.config";

const AddToChatScreen = () => {
  const nav = useNavigation();
  const user = useSelector((state) => state.user.user);
  const [addChat, setAddChat] = useState("");

  const createNewChat = async () => {
    let id = `${Date.now()}`;
    const _doc = {
      _id: id,
      user: user,
      chatName: addChat,
    };
    if (addChat !== "") {
      setDoc(doc(fireStoreDB, "chats", id), _doc)
        .then(() => {
          setAddChat("");
          nav.replace("HomeScreen");
        })
        .catch((err) => {
          alert("Error :", err);
        });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ width: "auto", backgroundColor: "#38419D", flex: 0.2 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "auto",
            paddingLeft: 20,
            paddingTop: 20,
            flex: 1,
          }}
        >
          <TouchableOpacity onPress={() => nav.goBack()}>
            <MaterialIcons name="chevron-left" size={35} color={"#fff"} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 40,
            }}
          >
            <Image
              width={60}
              height={60}
              resizeMode="contain"
              source={{ uri: user?.profilePic }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          width: "auto",
          backgroundColor: "#fff",
          borderRadius: 35,
          flex: 1,
          paddingTop: 10,
        }}
      >
        <View style={{ width: "auto", padding: 10 }}>
          <View
            style={{
              width: "auto",
              padding: 10,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 45,
              borderWidth: 1,
              borderColor: "gray",
            }}
          >
            <Ionicons name="chatbubbles" size={24} color={"#38419D"} />
            <TextInput
              value={addChat}
              onChangeText={(text) => setAddChat(text)}
              placeholder="Create Chat"
              style={{
                flex: 1,
                fontSize: 16,
                color: "gray",
                width: "auto",
                height: 18,
                paddingHorizontal: 10,
              }}
            />
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color={"#38419D"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddToChatScreen;
