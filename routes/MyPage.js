import styled from "styled-components/native";
import React, { useEffect, useState } from "react";
import {  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
// import { Fontisto } from "@expo/vector-icons";
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
  //   background-color: #ced1ce;
  //   border: ;
>>>>>>> d401478e72c80c25bc27ca60f565ba1b3f2e553a
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

  //   const bookrmark = [
  //     { bookmarkPk: 1, bookmarkName: "햇귀" },
  //     { bookmarkPk: 2, bookmarkName: "기라성" },
  //     { bookmarkPk: 3, bookmarkName: "소리울림" },
  //     { bookmarkPk: 4, bookmarkName: "소리울림" },
  //     { bookmarkPk: 5, bookmarkName: "햇귀" },
  //     { bookmarkPk: 6, bookmarkName: "기라성" },
  //     { bookmarkPk: 7, bookmarkName: "소리울림" },
  //     { bookmarkPk: 8, bookmarkName: "소리울림" },
  //     { bookmarkPk: 9, bookmarkName: "햇귀" },
  //     { bookmarkPk: 10, bookmarkName: "기라성" },
  //     { bookmarkPk: 11, bookmarkName: "소리울림" },
  //     { bookmarkPk: 12, bookmarkName: "소리울림" },
  //   ];

  //새로고침
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getUserInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  // 멤버의 즐겨찾기 한 동아리 가져오기
  const getUserInfo = async () => {
    // if (AsyncStorage.getItem("userType") === userType.userType) {
    // }
    try {
      const memberPK = await AsyncStorage.getItem("pk");
      console.log("멤버피케이는 : " + memberPK);

      const response = await fetch(
        `http://15.165.169.129/api/member/${memberPK}/my_page`
      );
      const json = await response.json();
      setUserInfo(json.data);
      setBookmark(json.data.bookmarks);
      console.log("JSON: " + JSON.stringify(bookmark));
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

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Profile>
        {/* <Image source={{ uri: "splash" }} />*/}
        {/* <View style={{width: "100%", padding: "0%", marginTop: "30%", marginBottom: "5%", display: "flex", justifyContent: "space-between", alignItems: "center"}}> */}
          <View>
                <Image style={{width: 100, height: 100, borderColor: "#38aeea", borderWidth: 8, borderRadius: 30, marginTop: 5, marginBottom: 5}} source={require('../assets/icon.png')} />
            </View>    
        <UserId><Text>   ID : </Text>{userInfo.signInId}</UserId>
        <Text onPress={() => navigation.navigate("EditInfo")}>정보 수정</Text>
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
