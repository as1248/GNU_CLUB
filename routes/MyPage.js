import styled from "styled-components/native";
import React, { useEffect, useState } from "react";
import {  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    // alignItems: "center",
  },
}))`
  padding: 0% 5%;
`;

const Profile = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 20%;
  margin: 10% 0;
  
`;

const UserImg = styled.View`
  // margin-left: -15%;
  //   border: ;
`;

const UserId = styled.Text`
  margin-right: 10%
  font-size: 30px;
`;


const BookmarkList = styled.View`
  padding: 5%;
  //   margin: 10% 0;
`;

const BookmarkContainer = styled.View`
  background-color: #38aeea;
  
  border-radius: 10;
  margin-bottom: 5%;
  padding-left: 5%;
`;

const BookmarkTitle = styled.Text`
  font-size: 30px;
  margin-top: 5%;
  margin-bottom: 5%;
`;

const BookmarkContentContainer = styled.View`
`;

const List = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 2px;
  border-color: #38aeea;
  border-radius: 6;
  border-collapse: collapse;
  background-color: white;
  padding: 5px 13px 5px 11px;
  margin-bottom: 2%;
`;

const ClubName = styled.TouchableOpacity``;
const ClubNameText = styled.Text`
  font-size: 25px;
  color: #4b4b4b;
`;

const MyPage = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [member_pk, setMemberPk] = useState(0);
  const [userInfo, setUserInfo] = useState({
    signInId: "",
    joinedClub: [],
    bookmarks: [],
  });

  const [bookmark, setBookmark] = useState([
    {
      bookmarkPK: "",
      bookmarkName: "",
    },
  ]);
  //새로고침
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getUserInfo();
    setRefreshing(false);
  };


  // 멤버의 즐겨찾기 한 동아리 가져오기
  const getUserInfo = async () => {
    try {
      setMemberPk(await AsyncStorage.getItem("pk"));
      const response = await fetch(
        `http://15.165.169.129/api/member/${member_pk}/my_page`
      );
      const json = await response.json();
      setUserInfo(json.data);
      setBookmark(json.data.bookmarks);
      setImage(json.data.profileImageUrl);
    } catch (error) {
      console.log("error in get user info: " + error);
    }
  };


useEffect(() => {
  getUserInfo();
}, [member_pk,image]);

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Profile>
        <UserImg>
        {(image) ? (
          <Image style={{width: 100, height: 100, borderColor: "#38aeea", borderWidth: 4, borderRadius: 10, marginTop: 5, marginBottom: 5}} source={{ uri: image }} />
        ) : (
          <Fontisto name="person" size={30} color="black" />)}
        </UserImg>
       <Text style={{fontSize: 30}}>ID : {(userInfo) ? (<UserId>{userInfo.signInId}</UserId>) : <UserId>0</UserId>}</Text> 
        
        <Text onPress={() => navigation.navigate("EditInfo",{member_pk})}>정보 수정</Text>
      </Profile>

      <BookmarkList>
        <BookmarkContainer>
          <BookmarkTitle style={{ color: "white"}}>              즐겨찾기</BookmarkTitle>
        </BookmarkContainer>
        <BookmarkContentContainer>
          {bookmark.map((club, key) => {
            return (
              <List key={key}>
                <ClubName
                  onPress={() =>
                    navigation.navigate("Club", { clubPk: club.clubPk })
                  }
                >
                  <ClubNameText>{club.bookmarkName}</ClubNameText>
                </ClubName>
              </List>
            );
          })}
        </BookmarkContentContainer>
      </BookmarkList>
    </Container>
  );
};

export default MyPage;
