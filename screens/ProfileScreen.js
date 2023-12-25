import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
const ProfileScreen = () => {
  const nav = useNavigation();
  const user = useSelector((state) => state.user.user);
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
    >
      <View
        style={{
          width: 400,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 4,
        }}
      >
        <TouchableOpacity onPress={() => nav.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color={"gray"} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="dots-three-vertical" size={24} color={"gray"} />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            position: "relative",
            borderWidth: 2,
            borderColor: "gray",
            padding: 1,
            borderRadius: 50,
          }}
        >
          <Image
            width={55}
            height={55}
            resizeMode="contain"
            source={{ uri: user?.profilePic }}
          />
        </View>
        <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 10 }}>
          Name: {user?.fullName}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", paddingTop: 10 }}>
          Email: {user?.providerData.email}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
