import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet} from "react-native";
import styled from "styled-components/native";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

const Main = styled.View`
  flowdirection : row;
  display: flex;
  align-items: flex-start;
  margin-top: 45%;
  margin-left: 50;
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
    if (id === ""){
      return alert("ID를 입력하지 않았습니다.");
   }
   if (pw === ""){
      return alert("PW를 입력하지 않았습니다.");
   }
   
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
      const userData = await response.json();
      console.log("user Pk: " + JSON.stringify(userData));

      AsyncStorage.setItem("pk", userData.data.toString());
     // AsyncStorage.setItem("userType", userType.manager);
      AsyncStorage.setItem(userType.userType, "manager");
      
      nav(`Main`);
    } catch (error) {
      alert("로그인 정보가 없습니다.");
      console.log("error in request login: " + error);
    }
  };

  return (
    <Main>
      <Text style={{fontSize: 40, marginBottom: "5%"}}> 관리자 로그인</Text>
      <View style={{flexDirection:"row", marginleft : 100}}>
      <Ionicons name="person-outline" size={40} color="black" />
      <TextInput style={{marginBottom: "4%"}} placeholder="ID" fontSize={30} onChangeText={(text) => setId(text)} /> 
        </View>
      <View style={{flexDirection:"row"}}>
        <MaterialCommunityIcons name="key" size={40} color="black" />
      <TextInput style={{marginBottom: "4%"}} placeholder="비밀번호" fontSize={30} onChangeText={(text) => setPw(text)} />
      </View>

      <TouchableOpacity style={styles.buttons} onPress={requestManagerLogin}>
            <Text style={{fontSize: 20, color: "white"}}>로그인</Text>
        </TouchableOpacity>
    </Main>
  );
};

const styles = StyleSheet.create({
  signText: {
      fontSize: 40,
      marginBottom: "5%"
  },
  buttons: {
      borderRadius: 10, backgroundColor: "skyblue", width: 310, height: 50, justifyContent: "center", alignItems: "center" 
  },
  flowDirection: {
      flexDirection: "row"
  }
})

export default ManagerLogin;
