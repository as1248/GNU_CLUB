import styled from "styled-components/native";
import React, { useEffect, useState } from 'react';
import {View,Text,Image, ScrollView, TouchableOpacity} from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 10%;
    margin: 10% 0;
`;

const UserImg = styled.View`
    margin-left: -15%;
`;

const UserId = styled.Text`
    margin-right: 20%;
    font-size: 30px;
`;

const Joined = styled.View`
    padding: 0 10%;
    margin: 10% 0;
`;

const BookmarkList = styled.View`
    padding: 0 10%;
    margin: 10% 0;
`;

const BookmarkTitle = styled.Text`
    font-size: 30px;
    margin-bottom: 8%;
`;

const Bookmark = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    margin-bottom: 5%;
    margin-left: 5%;
    width: 90%;
    height: 30%;
    border: 1px solid rgba(0,0,0,0.5);
    border-radius: 10px;
`;

const ClubName = styled.Text`
    font-size: 20px;
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
        <ScrollView nestedScrollEnabled = {true}>
            <Profile>
                <Image source={{uri:'splash'}}/>
                <UserImg>
                    <Fontisto name="person" size={30} color="black" />
                </UserImg>
                <UserId>
                    {userInfo.signInId}
                </UserId>
                <Text onPress={() => navigation.navigate('EditInfo')}>정보 수정</Text>
            </Profile>
            <Joined>
                <Text>가입한 동아리</Text>
                <ScrollView nestedScrollEnabled = {true}>
                    {renderJoinedClub()}
                </ScrollView>
            </Joined>
            <BookmarkList>
                <BookmarkTitle>즐겨찾기</BookmarkTitle>
                <ScrollView nestedScrollEnabled = {true}>
                    {bookrmark.map((club, key) => {
                        return(<Bookmark onPress={() => navigation.navigate("Club", {clubPk: club.bookmarkPk})} key={key}>
                                <ClubName>{club.bookmarkName}</ClubName>
                            </Bookmark>)
                    })}
                </ScrollView>
            </BookmarkList>
        </ScrollView>
    );
};

export default MyPage;