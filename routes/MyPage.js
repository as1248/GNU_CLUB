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
  border: 1px solid black;
`;

const UserImg = styled.View`
  // margin-left: -15%;
  //   border: ;
`;

const UserId = styled.Text`
  margin-right: 20%;
  font-size: 30px;
`;

const BookmarkList = styled.View`
  padding: 5%;
  //   margin: 10% 0;
  border: 1px solid black;
`;
const BookmarkContainer = styled.View`
  background-color: #ced1ce;
  border: 1px solid black;
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

// const Bookmark = styled.TouchableOpacity`
//   // display: flex;
//   //   justify-content: center;
//   //   margin-bottom: 5%;
//   //   margin-left: 5%;
//   //   width: 90%;
//   //   height: 30%;
//   //   border: 1px solid rgba(0, 0, 0, 0.5);
//   //   border-radius: 10px;
// `;
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

// const ClubName = styled.Text`
//   font-size: 20px;
// `;


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


  // 멤버의 즐겨찾기 한 동아리 가져오기si
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

// 가입한 클럽
//   const renderJoinedClub = () => {
//     if (userInfo.joinedClub == null) {
//       return <View></View>;
//     }
//     userInfo.joinedClub.map((club, key) => {
//       return (
//         <TouchableOpacity
//           onPress={() =>
//             navigation.navigate("Club", { clubPk: club.joinedClubPk })
//           }
//           key={key}
//         >
//           <Text>{club.joinedClubName}</Text>
//         </TouchableOpacity>
//       );
//     });
//   };

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
          <Image style={{width: 50, height: 50}} source={{ uri: image }} />
        ) : (
          <Fontisto name="person" size={30} color="black" />)}
        </UserImg>
        {(userInfo) ? (<UserId>{userInfo.signInId}</UserId>) : <UserId>0</UserId>}
        
        <Text onPress={() => navigation.navigate("EditInfo",{member_pk})}>정보 수정</Text>
      </Profile>

      {/* <Joined>
        <Text>가입한 동아리</Text>
        <ScrollView nestedScrollEnabled={true}>{renderJoinedClub()}</ScrollView>
      </Joined> */}
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
