import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { fireStoreDB } from "../config/firebase.config";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const nav = useNavigation();
  const textInputRef = useRef(null);
  const user = useSelector((state) => state.user.user);

  const handleKeyBoardOpen = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };
  const sendMessageHandler = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
    };
    setMessage("");
    await addDoc(
      collection(doc(fireStoreDB, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => alert(err));
  };

  useLayoutEffect(() => {
    const msgQuery = query(
      collection(fireStoreDB, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = querySnap.docs.map((doc) => doc.data());
      setMessages(upMsg);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

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
              gap: 10,
            }}
          >
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="user" size={24} color="#fff" />
            </View>
            <View>
              <Text>
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
              </Text>
              <Text>Online</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 40,
              gap: 10,
            }}
          >
            <TouchableOpacity>
              <FontAwesome5 name="video" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <FontAwesome5 name="phone" size={20} color="#fff" />
            </TouchableOpacity>
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={160}
          style={{ flex: 1 }}
        >
          <>
            <ScrollView>
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
                  {messages?.map((msg, i) =>
                    msg.user.providerData.email === user.providerData.email ? (
                      <View
                        style={{
                          margin: 5,
                        }}
                        key={i}
                      >
                        <View
                          style={{
                            paddingHorizontal: 15,
                            padding: 5,
                            borderRadius: 10,
                            backgroundColor: "gray",
                            width: "auto",
                            position: "relative",
                            alignSelf: "flex-end",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 18,
                            }}
                          >
                            {msg.message}
                          </Text>
                        </View>
                        <View style={{ alignSelf: "flex-end" }}>
                          {msg?.timeStamp?.seconds && (
                            <Text>
                              {new Date(
                                parseInt(msg?.timeStamp?.seconds) * 1000
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              })}
                            </Text>
                          )}
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          alignSelf: "flex-start",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          flexDirection: "row",
                          paddingHorizontal: 10,
                        }}
                        key={i}
                      >
                        <Image
                          width={62}
                          height={62}
                          resizeMode="cover"
                          source={{ uri: msg?.user?.profilePic }}
                        />

                        <View
                          style={{
                            margin: 5,
                          }}
                        >
                          <View
                            style={{
                              paddingHorizontal: 15,
                              padding: 5,
                              borderRadius: 10,
                              backgroundColor: "#5555",
                              width: "auto",
                              position: "relative",
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 18,
                              }}
                            >
                              {msg.message}
                            </Text>
                          </View>
                          <View style={{ alignSelf: "flex-start" }}>
                            {msg?.timeStamp?.seconds && (
                              <Text>
                                {new Date(
                                  parseInt(msg?.timeStamp?.seconds) * 1000
                                ).toLocaleTimeString("en-US", {
                                  hour: "numeric",
                                  minute: "numeric",
                                  hour12: true,
                                })}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </>
              )}
            </ScrollView>
            <View
              style={{
                width: "auto",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "gray",
                  borderRadius: 30,
                  padding: 10,
                  marginBottom: 30,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <TouchableOpacity onPress={handleKeyBoardOpen}>
                  <Entypo name="emoji-happy" size={34} color={"#555"} />
                </TouchableOpacity>
                <TextInput
                  style={{ width: "auto", height: 10, flex: 0.9 }}
                  value={message}
                  placeholderTextColor={"#fff"}
                  placeholder="Text here"
                  onChangeText={(text) => setMessage(text)}
                />
                <TouchableOpacity>
                  <Entypo name="mic" size={24} color={"#555"} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={sendMessageHandler}
                style={{
                  paddingBottom: 25,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 10,
                }}
              >
                <FontAwesome name="send" size={24} color={"#555"} />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
