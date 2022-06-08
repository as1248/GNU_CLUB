import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet} from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

const Main = styled.View`
  display: flex;
  align-items: flex-start;
  margin-top: 45%;
  margin-left: 10%;
`;

const ManagerLogin = ({ navigation }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  // 네비게이션 함수
  const nav = (page) => {
    navigation.replace(page);
  };

  // 매니저 로그인 버튼 실행 함수
  const requestManagerLogin = async () => {

  // ID, PW 입력 여부 체크
    if (id === ""){
      return alert("ID를 입력하지 않았습니다.");
   }
   if (pw === ""){
      return alert("PW를 입력하지 않았습니다.");
   }
   
  // 유효한 아이디 검사
    try {
      const response = await fetch(`http://15.165.169.129/api/manager/signIn`, {
        method: "POST",
        body: JSON.stringify({
          signInId: id,
          password: pw,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // 유저타입 '매니저'로 저장
      const userData = await response.json();
      console.log("user Pk: " + JSON.stringify(userData));

      AsyncStorage.setItem("pk", userData.data.toString());
      AsyncStorage.setItem('userType.userType','manager', () => {
        console.log('유저 타입 저장 완료')
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
      <Text style={{fontSize: 40, marginBottom: "5%", marginLeft: "-3%"}}> 관리자 로그인</Text>
      <View style={{flexDirection:"row", marginleft : 100}}>
      <Ionicons name="person-outline" size={40} color="black" />
      <TextInput  style={{ marginBottom: "4%", width: "80%" }} placeholder="ID" fontSize={30} onChangeText={(text) => setId(text)} /> 
        </View>
      <View style={{flexDirection:"row"}}>
        <MaterialCommunityIcons name="key" size={40} color="black" />
      <TextInput  style={{ marginBottom: "4%", width: "80%" }} placeholder="비밀번호" fontSize={30} onChangeText={(text) => setPw(text)} />
      </View>

      {/* 로그인 함수 실행 버튼 */}
      <TouchableOpacity style={styles.buttons} onPress={requestManagerLogin}>
            <Text style={{fontSize: 20, color: "white"}}>로그인</Text>
        </TouchableOpacity>
    </Main>
  );
};

// 스타일 시트
const styles = StyleSheet.create({
  signText: {
      fontSize: 40,
      marginBottom: "5%"
  },
  buttons: {
      borderRadius: 10, backgroundColor: "#38aeea", width: 290, height: 50, justifyContent: "center", alignItems: "center" 
  },
  flowDirection: {
      flexDirection: "row"
  }
})

export default ManagerLogin;
