import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { pp } from "../assets";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireStoreDB } from "../config/firebase.config";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState(null);
  const nav = useNavigation();

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(fireStoreDB, "chats"),
      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      // setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <SafeAreaView>
        <View
          style={{
            width: "auto",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => nav.navigate("ProfileScreen")}>
            <Image
              source={{ uri: user?.profilePic }}
              resizeMode="cover"
              style={{ height: 65, width: 65 }}
            />
          </TouchableOpacity>
          <Image source={pp} width={100} height={100} resizeMode="cover" />
        </View>
        <View style={{ borderBottomWidth: 2, borderColor: "gray" }}></View>

        <ScrollView
          style={{
            width: "auto",
            paddingRight: 4,
            paddingTop: 4,
            marginBottom: 120,
          }}
        >
          <View
            style={{
              width: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 10,
            }}
          >
            <Text style={{ color: "gray", fontWeight: "bold" }}>Messages</Text>

            <TouchableOpacity onPress={() => nav.navigate("AddToChatScreen")}>
              <Ionicons name="chatbox" size={28} color={"gray"} />
            </TouchableOpacity>
          </View>
          {isLoading ? (
            <>
              <View
                style={{
                  width: "auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={"large"} color={"gray"} />
              </View>
            </>
          ) : (
            <>
              {chats && chats?.length > 0 ? (
                <>
                  {chats?.map((room) => (
                    <MessageCard key={room._id} room={room} />
                  ))}
                </>
              ) : (
                <View></View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const nav = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => nav.navigate("ChatScreen", { room: room })}
      style={{
        width: "auto",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* images */}
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: "gray",
          margin: 10,
        }}
      >
        <FontAwesome5 name="user" size={24} color="gray" />
      </View>
      {/* content */}
      <View
        style={{
          flex: 1,
          alignItems: "flex-start",
          justifyContent: "center",
          marginLeft: 5,
          gap: 3,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{room.chatName}</Text>
        <Text>fdkgjdgkdngkndkfndkngkdngkdngdkndkgndk</Text>
      </View>
      {/* time */}
      <Text> 30 min</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
