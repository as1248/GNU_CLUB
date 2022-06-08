import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
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

const ManagerLoginBtn = styled.TouchableOpacity`
  width: 50%;
  height: 100%;
  justify-content: center;
  align-items: center;
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

  // ID, PW 입력 여부 체크
    if (id === "") {
      return alert("ID를 입력하지 않았습니다.");
    }
    if (pw === "") {
      return alert("PW를 입력하지 않았습니다.");
    }

  // 유효한 아이디 검사
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
    
      // 유저타입 '멤버'로 저장
      const userData = await response.json();
      console.log("user Pk: " + JSON.stringify(userData));

      AsyncStorage.setItem("pk", userData.data.toString());
      AsyncStorage.setItem("userType.userType", "member", () => {
        console.log("유저 타입 저장 완료");
      });

      // 로그인 성공시 메인 화면으로 이동
      nav(`Main`);
    } catch (error) {
      alert("로그인 정보가 없습니다.");
      console.log("error in request login: " + error);
    }
  };

      //화면에 보여지는 텍스트
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

      {/* 로그인 함수 실행 버튼 */}
      <TouchableOpacity style={styles.buttons} onPress={requestLogin}>
        <Text style={{ fontSize: 20, color: "white" }}>로그인</Text>
      </TouchableOpacity>

      {/* 회원가입 페이지 이동 버튼 */}
      <TouchableOpacity
        style={{
          width: 290,
          height: 50,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={{ fontSize: 20}}>회원가입</Text>
      </TouchableOpacity>

      {/* 관리자로그인 페이지 이동 버튼 */}
      <MBox>
        <ManagerLoginBtn onPress={() => navigation.navigate("ManagerLogin")}>
          <Text style={{ fontSize: 15 }}>관리자로그인</Text>
        </ManagerLoginBtn>
      </MBox>
    </Main>
  );
};

// 스타일 시트
const styles = StyleSheet.create({
  signText: {
    fontSize: 40,
    marginBottom: "5%",
  },
  buttons: {
    borderRadius: 10,
    backgroundColor: "#38aeea",
    width: 290,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
