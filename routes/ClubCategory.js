import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import styled from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UnBookmarked, Bookmarked } from "../components/Icon";

const Screen = styled.ScrollView`
  flex: 1;
  padding-top: 20%;
  padding-left: 10%;
  padding-right: 10%;
`;

const Container = styled.ScrollView`
  background-color: #9a9a9a;
  border-radius: 10px;
`;

const CategoryName = styled.Text`
  text-align: center;
  font-size: 30px;
`;

const List = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 3px;
  border-color: #9a9a9a;
  border-collapse: collapse;
  background-color: #ced1ce;
  padding: 5px 13px 5px 11px;
`;

const ClubName = styled.TouchableOpacity``;
const ClubNameText = styled.Text`
  font-size: 25px;
  color: #4b4b4b;
`;
const Bookmark = styled.TouchableOpacity``;

const ClubCategory = (props) => {
  const [clubList, setClubList] = useState([]);
  const [userInfo, setUserInfo] = useState({
    bookmarks: []
  });

  // 어떤 카테고리의 클럽들인지 props로 받아왔음
  const categoryPk = props.route.params.categoryPk;

  // 클럽 데이터 가져오기
  const getClubList = async () => {
    try {
      const response = await fetch(
        `http://15.165.169.129/api/category/${categoryPk}/clubs`
      );
      const json = await response.json();
      setClubList(json.data);
    } catch (error) {
      console.log("error in get club list: " + error);
    }
  };

  // 멤버의 즐겨찾기 한 동아리 받기
  const getUserInfo = async () => {
    try {
      const memberPk = await AsyncStorage.getItem("pk");
      const response = await fetch(
        `http://15.165.169.129/api/member/${memberPk}/my_page`
      );
      const json = await response.json();
      // console.log(JSON.stringify(json));
      setUserInfo(json.data);
    } catch (error) {
      console.log("error in get user info: " + error);
    }
  };
  
  useEffect(() => {
    getClubList();  // 클럽리스트 받아오기
    getUserInfo();  // 즐겨찾기 여부 받아오기
  }, []);


  // 즐겨찾기 여부 처리, 아이콘 출력
  const checkFeather = (thisName) => {
    var isBook = false;
    userInfo.bookmarks.map((thisClub) => {
      if(thisClub.bookmarkName === thisName)
        isBook = true;
    })
    return isBook ? <Bookmarked /> : <UnBookmarked />
  };

  // 즐겨찾기 추가/제거
  const clickBookMark = async (club_pk) => {
    try {
      const memberPk = await AsyncStorage.getItem("pk");
      await fetch(
        `http://15.165.169.129/api/member/${memberPk}/bookmark?club_pk=${club_pk}`,
        {
          method: "PUT",
        }
      );
      getUserInfo();
    } catch (error) {
      console.log("error in click book mark: " + error);
    }
  };

  // 네비게이션 이동
  const nav = (page, clubPk) => {
    props.navigation.navigate(page, { clubPk });
  };

  return (
    <Screen>
      <Container>
        <CategoryName>{props.route.params.categoryName} 분야</CategoryName>
        {clubList.map((club, key) => {
          return (
            <List key={key}>
              <ClubName onPress={() => nav("Club", club.clubPk)}>
                <ClubNameText>{club.clubName}</ClubNameText>
              </ClubName>
              <TouchableOpacity onPress={() => clickBookMark(club.clubPk)}>
                {checkFeather(club.clubName)}
              </TouchableOpacity>
            </List>
          );
        })}
      </Container>
    </Screen>
  );
};

export default ClubCategory;
