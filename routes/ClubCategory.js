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
  align-item: center;
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
const Bookmark = styled.TouchableOpacity`
  // flex: 1;
`;

const ClubCategory = (props) => {
  const [clubList, setClubList] = useState([]);
  const categoryPk = props.route.params.categoryPk;

  let member = {
    signInId: "byeoru",
    joinedClubs: ["햇귀"],
    bookmarks: [1],
  };

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

  useEffect(() => {
    getClubList();
  }, []);

  // 즐겨찾기 여부 처리
  const checkFeather = (thisPk) => {
    var thisFeather = "";
    member.bookmarks.includes(thisPk)
      ? (thisFeather = <Bookmarked />)
      : (thisFeather = <UnBookmarked />);

    return <View>{thisFeather}</View>;
  };

  // 즐겨찾기  api
  const clickBookMark = async (club_pk) => {
    try {
      //const memberPk = await AsyncStorage.getItem("pk");
      const response = await fetch(
        `http://15.165.169.129/api/member/1/bookmark?club_pk=${club_pk}`,
        {
          method: "POST",
        }
      );
      const json = await response.json();
      console.log("추가된 북마크 pk: " + JSON.stringify(json));

      // 페이지 새로고침 추가 필요D
    } catch (error) {
      console.log("error in get club list: " + error);
    }
  };

  // 네비게이션 이동
  const nav = (page, clubPk) => {
    props.navigation.navigate(page, { clubPk });
  };

  return (
    <Screen>
      <Container>
        <CategoryName>{props.route.params.categoryName} 분야 </CategoryName>
        {clubList.map((club, key) => {
          return (
            <List key={key}>
              <ClubName onPress={() => nav("Club", club.clubPk)}>
                <ClubNameText>{club.clubName}</ClubNameText>
              </ClubName>
              <TouchableOpacity onPress={() => clickBookMark(club.clubPk)}>
                {checkFeather(club.clubPk)}
              </TouchableOpacity>
            </List>
          );
        })}
        <List>
          <ClubName>
            <ClubNameText>더미데이터1</ClubNameText>
          </ClubName>
          <Bookmark>
            <UnBookmarked />
          </Bookmark>
        </List>
        <List>
          <ClubName>
            <ClubNameText>더미데이터2</ClubNameText>
          </ClubName>
          <Bookmark>
            <UnBookmarked />
          </Bookmark>
        </List>
        <List>
          <ClubName>
            <ClubNameText>더미데이터3</ClubNameText>
          </ClubName>
          <Bookmark>
            <UnBookmarked />
          </Bookmark>
        </List>
        <List>
          <ClubName>
            <ClubNameText>더미데이터4</ClubNameText>
          </ClubName>
          <Bookmark>
            <UnBookmarked />
          </Bookmark>
        </List>
      </Container>
    </Screen>
  );
};

export default ClubCategory;
