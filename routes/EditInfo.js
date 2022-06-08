import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {View,Text,TextInput,Image, StyleSheet, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';

const Main = styled.View`
    display: flex;
    align-items: center;
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

const EditInfo = (props:any) => {

    const [pw, setpw] = useState("");
    const [pwn, setPwn] = useState("");
    const [pwnc, setPwnc] = useState("");
    const [image, setImage] = useState(null);
    let imageUrl;
    const pickImage = async() => {
        let result:any = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });
        setImage(image);
        imageUrl = result.uri;
        console.log(result.uri,imageUrl,image);
        if(imageUrl){
            await PostImg();
        }
    }
    const callApi = async() => {
        try{
            const response = await axios({
                method: 'get',
                url: `http://15.165.169.129/api/member/${props.route.params.member_pk}/my_page`
            });
            setImage(response.data.data.profileImageUrl);
            }catch(error){
            console.log(error.response.data);
        }
    }
        const PostImg = async() => {
            try{
                const formData = new FormData();
                formData.append('image', {uri: imageUrl, name: imageUrl.split('/').pop(), type: 'image/png'});
                const response = await axios({
                    method: 'put',
                    url: `http://15.165.169.129/api/member/${props.route.params.member_pk}/profile_image`,
                    data: formData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': '*/*'
                    }
                });
                console.log(response);
                }catch(error){
                console.log(error.response.data);
            }
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
    
    useEffect(()=>{callApi()},[]);
    return (
        <Main>
            <View style={{width: "100%", padding: "0%", marginTop: "30%", marginBottom: "5%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                {(image) ? (
                <Image style={{width: 100, height: 100}} source={{uri:image}} />
                ) : (
                <Image style={{width: 100, height: 100}} source={require('../assets/icon.png')} />)}
                
                <TouchableOpacity style={styles.profileImgBtn} onPress={()=> pickImage()}>
                    <Text style={{fontSize: 20, color: "white"}}>프로필사진수정</Text>
                </TouchableOpacity>
            </View>  
            <ChangeInfo>
                <TextInput style={{marginBottom: "8%"}} placeholder="현재비밀번호" onChangeText={(text) => setpw(text)} /> 
                <TextInput style={{marginBottom: "8%"}} placeholder="새비밀번호" onChangeText={(text) => setPwn(text)} /> 
                <TextInput style={{marginBottom: "8%"}} placeholder="새비밀번호확인" onChangeText={(text) => setPwnc(text)} /> 
                <TouchableOpacity style={styles.passwordBtn} onPress={()=>requestAlterpw()}>
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
        borderRadius: 10, backgroundColor: "#38aeea", width: 250, height: 50, justifyContent: "center", alignItems: "center" 
    },
    passwordBtn: {
        borderRadius: 10, backgroundColor:  "#38aeea", width: 250, height: 50, justifyContent: "center", alignItems: "center" 
    },
    flowDirection: {
        flexDirection: "row"
    }
  })

export default EditInfo;