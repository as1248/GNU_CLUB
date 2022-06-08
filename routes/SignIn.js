import React, { useState } from 'react';
import {View,Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

const Main = styled.View`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 45%;
    margin-left: 25px;
`;

const Content = styled.View`
  margin: 5%;  
`;

//SignIN 네비게이션
const SignIn = ({navigation}) => {
    const [id, setId] = useState("");
    const [pw, setpw] = useState("");
    const [pwc, setpwc] = useState("");
    
    // 회원가입 함수
    const apply = async () => {
        
        // 정규식표현식 회원가입 조건 확인
        const reg = /^[A-Za-z0-9]{1,10}$/;
        const reg2 = /^[A-Za-z0-9]{1,15}$/;
        
        // ID, PW 입력 확인
        if (id === ""){
           return alert("ID를 입력하지 않았습니다.");
        }
        if (pw === ""){
           return alert("PW를 입력하지 않았습니다.");
        }
        if (pwc === ""){
           return alert("PW확인을 입력하지 않았습니다.");
        }
        if (pw !== pwc){
            return alert("비밀번호가 일치하지 않습니다.");
        }
        if (!reg.test(id)){
           return alert("숫자 영문을 포함한 10자리 이내의 ID를 입력해주세요.");   
        }
        if (!reg2.test(pw)){
            return alert("숫자 영문을 포함한 15자리 이내의 PW를 입력해주세요.");   
         }
        
         // 회원가입 정보 POST 함수
        try {
            const response = await fetch('http://15.165.169.129/api/member/signup', {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "signInId": id,
                    "password": pw
                })                
            });
            
          // 로그인 정보 비교 함수  
            const json = await response.json();
            if(json.data === null) {
                return alert("이미 가입된 아이디 입니다.")
            } 

            // 회원가입 완료시 로그인 페이지로 이동 
            navigation.navigate("Login");
            alert("회원가입이 완료되었습니다.");
        } catch (error) {
            console.log("error in apply: " + error);
        }
    }

    //화면에 보여지는 텍스트
    return (
    <Main>
        <Text style={styles.signText}>회원가입</Text>
        <View style={styles.flowDirection}>
            <Ionicons name="person-outline" size={40} color="black" />
            <TextInput style={{marginBottom: "4%", width: "80%"}} placeholder="ID" fontSize={30} onChangeText={(text) => setId(text)} /> 
        </View>
        <View style={styles.flowDirection}>
            <MaterialCommunityIcons name="key" size={40} color="black" />
            <TextInput style={{marginBottom: "4%", width: "80%"}} placeholder="비밀번호" fontSize={30} onChangeText={(text) => setpw(text)} />
         </View>

        <View style={styles.flowDirection}>
            <MaterialCommunityIcons name="key" size={40} color="black" />
            <TextInput style={{marginBottom: "4%", width: "80%"}} placeholder="비밀번호확인" fontSize={30} onChangeText={(text) => setpwc(text)} />
        </View>
        
        {/* 회원가입 함수 버튼 */}
        <TouchableOpacity style={styles.buttons} onPress={apply}>
            <Text style={{fontSize: 20, color: "white"}}>가입하기</Text>
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
        borderRadius: 10, backgroundColor: "#38aeea", width: 310, height: 50, justifyContent: "center", alignItems: "center" 
    },
    flowDirection: {
        flexDirection: "row"
    }
})

export default SignIn;