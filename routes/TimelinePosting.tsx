import React, { useState } from 'react';
import {View, TextInput, Text, Image} from 'react-native';
import styled from 'styled-components/native';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';

const Title = styled.View`
    display: flex;
    border: 1px solid black;
    margin: 0 10%;
    margin-top: 15%;
    padding: 0 5%;
`;

const Detail = styled.View`
    height: 30%;
    display: flex;
    border: 1px solid black;
    margin: 10%;
    padding: 0 5%;
`;

const Images = styled.View`
    width: 40%;
    margin-left: 10%;
    margin-bottom: 10%;
`;

const PostButton = styled.View`
    display: flex;
    align-items: flex-end;
    padding: 10%;
    
`;

const Btn = styled.TouchableOpacity`
    padding: 2% 13%;
    border-radius: 5px;
    background-color: #0d6efd;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    width: 150px;
`;

const BtnText = styled.Text`
    color: white;
    font-size: 15px;
`;

const TimelinePosting = (clubPk:any) => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [titleLen,setTitleLen] = useState(0);
    const [contentLen,setContentLen] = useState(0);

  const pickImage = async () => {
    let result:any = await ImagePicker.launchImageLibraryAsync({
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
            if(image){
                formData.append('image', {uri: image, name: image.split('/').pop(), type: 'image/png'});
            }else{
                formData.append('image', null);
            }
            formData.append('dto', {'string': JSON.stringify({title, content}), type: 'application/json'});
            await axios({
                method: 'post',
                url: `http://15.165.169.129/api/club/${clubPk.route.params.clubPk}/bulletin_board/timeline`,
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
    const post = () => {
        callApi();
        alert("게시물이 게시되었습니다.");
        clubPk.navigation.goBack();
    }

    return (
        <View>
            <Title>
                <TextInput 
                placeholder='title' 
                maxLength={100} 
                onChangeText={(event) => {
                    setTitle(event);
                    setTitleLen(title.length);
                }}/>
            </Title>
            <Detail>
                <TextInput 
                placeholder='detail' 
                maxLength={5000}
                multiline={true}
                onChangeText={(event) => {
                    setContent(event);
                    setContentLen(content.length);
                }}/>
            </Detail>
            <Images>
                <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                <Btn onPress={() => pickImage()}>
                    <BtnText>사진 불러오기</BtnText>
                </Btn>
            </Images>
            <PostButton>
                <Btn onPress={() => {
                    if(titleLen == 0 || contentLen == 0){
                        alert("제목, 내용을 입력해주세요");
                    }else{
                        post();
                    }
                }}>
                    <BtnText>게시</BtnText>
                </Btn>
            </PostButton>
        </View>
    );
};

export default TimelinePosting;