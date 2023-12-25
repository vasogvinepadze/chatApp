import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

const UserInp = ({
  placeholder,
  isPass,
  setStateValue,
  setGetEmailValidation,
}) => {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(true);
  const [icon, setIcon] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useLayoutEffect(() => {
    switch (placeholder) {
      case "Full Name":
        return setIcon("person");
      case "Email":
        return setIcon("email");
      case "Password":
        return setIcon("lock");
    }
  }, []);
  const handleTextChange = (text) => {
    setValue(text);
    setStateValue(value);

    if (placeholder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidation(status);
    }
  };
  return (
    <View
      style={{
        borderRadius: 10,
        width: 300,
        borderWidth: 2,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 5,
        borderColor:
          !isEmailValid && placeholder === "Email" && value.length > 0
            ? "red"
            : "gray",
      }}
    >
      <MaterialIcons name={icon} size={24} color={"gray"} />
      <TextInput
        style={{ flex: 1, margin: 5 }}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        secureTextEntry={isPass && showPass}
        autoCapitalize="none"
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Entypo
            name={`${showPass ? "eye" : "eye-with-line"}`}
            size={24}
            color={"gray"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserInp;
