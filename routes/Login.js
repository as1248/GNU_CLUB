import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Main = styled.View`
  display: flex;
  align-items: flex-start;
  margin: 45% 10%;
`;
const MBox = styled.View`
  width: 75%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 70%;
  margin-left: 45%;
`;
// coms
const ManagerLoginBtn = styled.TouchableOpacity`
  border-radius: 10;
  // background-color: skyblue;
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
  // border: ;
  opacity: 0.5;
`;

const Login = ({ navigation }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  // 네비게이션 함수
  const nav = (page) => {
    navigation.replace(page);
  };

  // 로그인 버튼 실행 함수
  const requestLogin = async () => {
    if (id === "") {
      return alert("ID를 입력하지 않았습니다.");
    }
    if (pw === "") {
      return alert("PW를 입력하지 않았습니다.");
    }

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        signInId: id,
        password: pw,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://15.165.169.129/api/member/signIn",
        requestOptions
      );
      const userData = await response.json();
      console.log("user Pk: " + JSON.stringify(userData));

      AsyncStorage.setItem("pk", userData.data.toString());
      AsyncStorage.setItem("userType.userType", "member", () => {
        console.log("유저 타입 저장 완료");
      });

      nav(`Main`);
    } catch (error) {
      alert("로그인 정보가 없습니다.");
      console.log("error in request login: " + error);
    }
  };

  return (
    <Main>
      <Text style={{ fontSize: 40, marginBottom: "5%" }}>로그인</Text>
      <View style={{ flexDirection: "row", marginleft: 100 }}>
        <Ionicons name="person-outline" size={40} color="black" />
        <TextInput
          style={{ marginBottom: "4%", width: "80%" }}
          placeholder="ID"
          fontSize={30}
          onChangeText={(text) => setId(text)}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <MaterialCommunityIcons name="key" size={40} color="black" />
        <TextInput
          style={{ marginBottom: "4%", width: "80%" }}
          placeholder="비밀번호"
          fontSize={30}
          onChangeText={(text) => setPw(text)}
        />
      </View>

      <TouchableOpacity style={styles.buttons} onPress={requestLogin}>
        <Text style={{ fontSize: 20, color: "white" }}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 290,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={{ fontSize: 20 }}>회원가입</Text>
      </TouchableOpacity>
      <MBox>
        <ManagerLoginBtn onPress={() => navigation.navigate("ManagerLogin")}>
          <Text style={{ fontSize: 15 }}>관리자로그인</Text>
        </ManagerLoginBtn>
      </MBox>
    </Main>
  );
};

const styles = StyleSheet.create({
  signText: {
    fontSize: 40,
    marginBottom: "5%",
  },
  buttons: {
    borderRadius: 10,
    backgroundColor: "skyblue",
    width: 290,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
