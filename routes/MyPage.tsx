import styled from "styled-components/native";
import React, { useEffect, useState } from 'react';
import {View,Text,Image, ScrollView, TouchableOpacity} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10%;
    margin: 10% 0;
`;

const Joined = styled.View`
    padding: 0 10%;
    margin: 10% 0;
`;

const Bookmark = styled.View`
    padding: 0 10%;
    margin: 10% 0;
`;

const MyPage = ({navigation}) => {
    const [userInfo, setUserInfo] = useState({
        signInId: "",
        joinedClub: [],
        bookmarks: [],
    });

    const bookrmark = [
        {bookmarkPk: 1, bookmarkName: "햇귀"},
        {bookmarkPk: 2, bookmarkName: "기라성"},
        {bookmarkPk: 3, bookmarkName: "소리울림"}, 
    ];

    useEffect(() => {
        getUserInfo();
    },[])

  // 멤버의 즐겨찾기 한 동아리 가져오기
  const getUserInfo = async () => {
      if(AsyncStorage.getItem("userType") === userType.member){
          
      }
    try {
      const memberPK = await AsyncStorage.getItem("pk");
      const response = await fetch(
        `http://15.165.169.129/api/member/${memberPK}/my_page`
      );
      const json = await response.json();
      console.log("JSON: " + JSON.stringify(json));
      setUserInfo(json.data);
    } catch (error) {
      console.log("error in get user info: " + error);
    }
  };

  const renderJoinedClub = () => {
      if(userInfo.joinedClub == null) {
        return <View></View>;
      }
      userInfo.joinedClub.map((club, key) => {
        return(<TouchableOpacity onPress={() => navigation.navigate("Club", {clubPk: club.joinedClubPk})} key={key}><Text>{club.joinedClubName}</Text></TouchableOpacity>)
    })
  }

    return (
        <View>
            <Profile>
                <Image source={{uri:'splash'}}/><Text><Fontisto name="person" size={24} color="black" />
                <Text>{userInfo.signInId}</Text>
                </Text><Text onPress={() => navigation.navigate('EditInfo')}>정보 수정</Text>
            </Profile>
            <Joined>
                <Text>가입한 동아리</Text>
                <ScrollView>
                    {renderJoinedClub()}
                </ScrollView>
            </Joined>
            <Bookmark>
                <Text>즐겨찾기</Text>
                <ScrollView>
                    {bookrmark.map((club, key) => {
                        return(<TouchableOpacity onPress={() => navigation.navigate("Club", {clubPk: club.bookmarkPk})} key={key}><Text>{club.bookmarkName}</Text></TouchableOpacity>)
                    })}
                </ScrollView>
            </Bookmark>
        </View>
    );
};

export default MyPage;