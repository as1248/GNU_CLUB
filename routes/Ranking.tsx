import React, { useEffect, useState } from "react";
import { View, Text, Button, RefreshControl } from "react-native";
import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";

const Main = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    justifyContent: "center",
  },
}))`
  // display: flex;
  padding: 0 10%;
`;

const RankingCategory = styled.Text`
  font-size: 27px;
  margin-top: 10%;
  margin-bottom: 3%;
  padding: 0 1%;
`;
const RankingContainer = styled.View``;

const VContent = styled.View`
  // grid-template-columns: 300px 1fr;
  display: flex;
  flex-direction: row;
  border: ;
`;
const RankingRank = styled.View`
  background-color: orange;
  padding: 0 5%;
`;
const RankingRankText = styled.Text`
  font-size: 30px;
`;

const RankingClub = styled.View`
  background-color: #ced1ce;
  padding: 0% 5%;
  flex: 1;
`;
const RankingClubText = styled.Text`
  font-size: 30px;
  font-weight: 300;
`;

const Ranking = ({ navigation }) => {
  const [rankingTotal, setRankingTotal] = useState([]);
  const [rankingWeek, setRankingWeek] = useState([]);
  
  //새로고침
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getRankingTotal();
    await getRankingWeek();
    setRefreshing(false);
  };

  // 전체 랭킹 데이터 가져오기
  const getRankingTotal = async () => {
    try {
      const response = await fetch(
        `http://15.165.169.129/api/clubs/ranking/total`
      );
      const json = await response.json();
      setRankingTotal(json.data);
    } catch (error) {
      console.log("error in get ranking total " + error);
    }
  };

  // 이번주 랭킹 가져오기
  const getRankingWeek = async () => {
    try {
      const response = await fetch(
        `http://15.165.169.129/api/clubs/ranking/week`
      );
      const json = await response.json();
      setRankingWeek(json.data);
    } catch (error) {
      console.log("error in get ranking week" + error);
    }
  };

  // 네비게이션 이동
  const nav = (page, clubPk) => {
    navigation.navigate(page, { clubPk });
  };

  useEffect(() => {
    getRankingTotal();
    getRankingWeek();
  }, []);
  return (
    <Main
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <RankingCategory>전체 동아리 랭킹</RankingCategory>
      <RankingContainer>
        {rankingTotal.map((club, key) => (
          <VContent key={key}>
            <RankingRank>
              <RankingRankText>{key + 1}</RankingRankText>
            </RankingRank>
            <RankingClub>
              <RankingClubText onPress={() => nav("Club", club.clubPk)}>
                {club.clubName}
              </RankingClubText>
            </RankingClub>
          </VContent>
        ))}
      </RankingContainer>
      <RankingCategory>이번 주 HOT 동아리</RankingCategory>
      {rankingWeek.map((club, key) => (
        <VContent key={key}>
          <RankingRank>
            <RankingRankText>{key + 1}</RankingRankText>
          </RankingRank>
          <RankingClub>
            <RankingClubText onPress={() => nav("Club", club.clubPk)}>
              {club.clubName}
            </RankingClubText>
          </RankingClub>
        </VContent>
      ))}
    </Main>
  );
};

export default Ranking;
