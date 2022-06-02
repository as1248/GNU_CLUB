import React, { useEffect, useState } from 'react';
import {View,Text,Image, Button, TextInput, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Title = styled.Text`
    margin-top: 15%;
    margin-left: 8%;
    font-size: 30px;
    font-weight: 600;
`;

const Time = styled.Text`
    margin-left: 10%;
    color: rgba(0,0,0,0.5);
`;

const Detail = styled.Text`
    margin: 10%;
    font-size: 20px;
`;

const Counting = styled.View`
    display: flex;
    flex-direction: row;
    padding: 8%;
`;

const AddComment = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10%;
`;
const CommentInput = styled.View`
    border: 1px black solid;
    width: 80%;
`;

const CommentList = styled.View`
    padding: 10%;
`;
const Comment = styled.View`
    display: flex;
    flex-direction: row;
    border: 1px solid rgba(0,0,0,0.3);
    border-radius: 20px;
    margin-bottom: 10%;
    padding: 2%;
`;

const Like = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
`;

const Content = styled.View`
    position: relative;
`;

const Id = styled.Text`
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 600;
`;

const CommentDetail = styled.Text`
    font-size: 15px;
`;

const DelBtn = styled.TouchableOpacity`
    position: absolute;
    left: 90%;
    top: 10%;
    width: 30px;
    height: 30px;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Del = styled.Text`
    color: white;
    font-size: 20px;
    font-weight: 900;
`

const WatchTimeline = (timelinePk:any) => {
    const [timeline,setTimeline] = useState<any>();
    const [loading,setLoading] = useState(true);
    const [like,setLike] = useState(false);
    const [comment,setComment] = useState('');
    const saveLike = async (like:any) => {
        await AsyncStorage.setItem(`${timelinePk.route.params.timelinePk}`, JSON.stringify(like));
      };
    const loadLike = async (response:any) => {
        await AsyncStorage.getItem(`${timelinePk.route.params.timelinePk}`);
        setLike(response.data.data.blike);
      };

    const callApi = async() => {
        try{
            const response = await axios.get(`http://15.165.169.129/api/club/timeline/${timelinePk.route.params.timelinePk}?member_pk=${timelinePk.route.params.memberPk}`);
            setTimeline(response.data.data);
            loadLike(response);
            setLoading(false);
            }catch(error){
                console.log(error);
            };
    }
    const updateLike = async(blike:boolean) => {
        try{
            await axios.put(`http://15.165.169.129/api/like/timeline/${timelinePk.route.params.timelinePk}?member_pk=${timelinePk.route.params.memberPk}`,{
                data:{
                    blike: blike,
                    likeCount: timeline.likeCount,
                }
            });
        }catch(error){
            console.log(error);
        }
    }
    const commentPost = async() => {
        try{
            const formData = new FormData();
            formData.append('comment', comment);
            const response = await axios.post(`15.165.169.129/api/comment/timeline?member_pk=${timelinePk.route.params.memberPk}&timeline_pk=${timelinePk.route.params.timelinePk}`,
            formData,{
                headers:{
                'Content-Type': 'application/json',
                }
            }
            );
            console.log(response);
        }catch(error){
            console.log(error.response.data);
        }
    }
    useEffect(() => {callApi()},[]);
    return (
        <View>
            {loading ? (<View>
                <ActivityIndicator size="large" />
            </View>) : (
                <View>
                <Title>{timeline.title}</Title>
                <Time>{timeline.postingTime}</Time>
                <Detail>{timeline.content}</Detail>
                <Image source={{uri:`${timeline.imageUrl}`}}/>
                <Counting>
                    <Like onPress={() => {
                        setLike(!like);
                        timeline.blike = like;
                        if(timeline.blike == true){
                            timeline.likeCount = timeline.likeCount - 1;
                            if(timeline.likeCount<0){
                                timeline.likeCount = 0;
                            }
                        }else{
                            timeline.likeCount = timeline.likeCount + 1;
                        }
                        updateLike(timeline.blike);
                        saveLike(timeline.blike);
                        }}
                        >
                        {like ? (
                        <AntDesign name="heart" size={24} color="red" />
                        ) : (
                        <AntDesign name="hearto" size={24} color="red" />
                        )}
                    </Like>
                    <Text> {timeline.likeCount} </Text>
                </Counting>
        
                <AddComment>
                    <CommentInput>
                        <TextInput 
                        value={comment}
                        maxLength={300}
                        onChangeText={(event) => {
                            setComment(event);
                }}/>
                    </CommentInput>
                    <Button title='게시'
                        onPress={async()=>{
                        if(comment == ''){
                            alert('내용을 입력하세요');
                        }else{
                            await commentPost();
                            setComment('');
                        }}}/>
                </AddComment>
        
                <CommentList>
                    {timeline.comments.map((comment:any,index:number)=>{
                    return(
                    <Comment key={index}>
                        <Image source={{ uri: null }} style={{ width: 40, height: 40 }} />
                        <Content>
                            <Id>{timeline.comments[index].userId}</Id>
                            <CommentDetail>{timeline.comments[index].comment}</CommentDetail>
                        </Content>
                        <DelBtn>
                            <Del>X</Del>
                        </DelBtn>
                    </Comment>
                    );
                })}
                </CommentList> 
                </View>
            ) }    
        </View>
        
    );
};

export default WatchTimeline;
