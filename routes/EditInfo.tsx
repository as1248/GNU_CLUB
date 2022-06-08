import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {View,Text,TextInput,Image, StyleSheet, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import * as ImagePicker from 'expo-image-picker';

const Main = styled.View`
    display: flex;
    align-items: center;
`;

const Images = styled.View`
    width: 40%;
    margin-left: 10%;
    margin-bottom: 10%;
`;

const ProfileImg = styled.View`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 15% 10%;
  margin-bottom: 35%;
`;

const ChangeInfo = styled.View`
    width: 70%;

`;

const EditInfo = () => {

    const [pw, setpw] = useState("");
    const [pwn, setPwn] = useState("");
    const [pwnc, setPwnc] = useState("");
    const [image, setImage] = useState();

    const pickImage = async () => {
        let result:any = await ImagePicer.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });
        setImage(result.uri);
        }
        const callApi = async() => {
            try{
                const formData = new FormData();
                formData.append('image',null);
                formData.append('dto', {'string': JSON.stringify({title, content}), type: 'application/json'});
                await axios({
                    method: 'post',
                    url: `http://15.165.169.129/api/member/{memberPK}/profile_image`,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': '*/*'
                    }
                });
                }catch(error){
                console.log(error.response.data);
            }
        }

    const requestpofileimg = async () => {      
    }

    const requestAlterpw = async () => {
        if (pw === ""){
            return alert("비밀번호를 입력하지 않았습니다.");
        }
        if (pwn === ""){
            return alert("새비밀번호를 입력하지 않았습니다.");
        }
        if (pwnc === ""){
            return alert("새비밀번호 확인을 입력하지 않았습니다.");
        }
        if (pwn !== pwnc){
            return alert("새비밀번호가 일치하지 않습니다.");
        }

        try {
            const memberPK = await AsyncStorage.getItem("pk");
            const response = await fetch(`http://15.165.169.129/api/member/${memberPK}/password`, {
              method: "PUT",
              body: JSON.stringify({
                currentPassword: pw,
                newPassword: pwn,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const json = await response.json();
            console.log("user Pk: " + JSON.stringify(json));

            if (json.data === true)
                alert("변경이 완료되었습니다.");
            else 
                alert("현재 비밀번호가 일치하지 않습니다.");
      
          } catch (error) {
            console.log("error in request login: " + error);
          }
    }

    
    return (
        <Main>
            <View style={{width: "100%",borderColor: "black", padding: "14%", marginTop: "20%", marginBottom: "25%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
            <Images>
                <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
             
                <TouchableOpacity style={styles.profileImgBtn} onPress={pickImage()}>
                    <Image style={{width: 100, height: 100}} source={require('../assets/icon.png')} />
                    </TouchableOpacity>

            </Images>
                <TouchableOpacity style={styles.profileImgBtn} onPress={requestpofileimg}>
                    <Text style={{fontSize: 20, color: "white"}}>프로필사진수정</Text>
                </TouchableOpacity>
            </View>  
            <ChangeInfo>
                <TextInput style={{marginBottom: "8%"}} placeholder="현재비밀번호" onChangeText={(text) => setpw(text)} /> 
                <TextInput style={{marginBottom: "8%"}} placeholder="새비밀번호" onChangeText={(text) => setPwn(text)} /> 
                <TextInput style={{marginBottom: "8%"}} placeholder="새비밀번호확인" onChangeText={(text) => setPwnc(text)} /> 
                <TouchableOpacity style={styles.passwordBtn} onPress={requestAlterpw}>
            <Text style={{fontSize: 20, color: "white"}}>비밀번호변경</Text>
        </TouchableOpacity>
            </ChangeInfo> 
        </Main>
    );
};


const styles = StyleSheet.create({
    signText: {
        fontSize: 40,
        marginBottom: "5%"
    },
    profileImgBtn: {
        borderRadius: 10, backgroundColor: "skyblue", width: 150, height: 50, justifyContent: "center", alignItems: "center" 
    },
    passwordBtn: {
        borderRadius: 10, backgroundColor: "skyblue", width: 290, height: 50, justifyContent: "center", alignItems: "center" 
    },
    flowDirection: {
        flexDirection: "row"
    }
  })

export default EditInfo;