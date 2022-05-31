import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";
import styled from "styled-components/native";
import Loader from "../components/Loader";
import { CheckedBox, UncheckedBox } from "../components/Icon";

const Container = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    alignItems: "center",
  },
}))`
  padding: 10% 5% 0;
`;

const ClubImage = styled.Image`
  margin-left: auto;
  margin-right: auto;
`;

const VContent = styled.View`
  display: flex;
  flex-direction: row;
  margin: 5% 0 8% 0;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 3%;
`;
// 괴도승훈 왓다감
const VCenter = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const ClubInfo = styled.View`
  flex: 1;
`;
const SpaceBetween = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.Text`
  font-size: 28px;
  text-align: center;
  font-weight: 500;
`;

const ContentText = styled.Text`
  font-size: 17px;
`;

const CheckinView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const Posting = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 0 10% 0;
  width: 100%;
`;

const OnPressButton = styled.TouchableOpacity`
  padding: 2% 13%;
  // border: ;
  border-radius: 5px;
  background-color: #0d6efd;
`;

const ButtonText = styled.Text`
  font-size: 20px;
  color: white;
  font-weight: 200;
`;

const IntroducingContainer = styled.View`
  padding: 0 5%;
`;
const IntroducingLabel = styled.Text`
  font-weight: bold;
  font-size: 20px;
`;
const Introducing = styled.View`
  background-color: #ced1ce;
  padding: 5% 5%;
`;
const IntroducingText = styled.Text`
  font-size: 20px;
`;
const Club = (props) => {
  const [loading, setLoading] = useState(true);
  const [clubData, setClubData] = useState({
    data: {
      clubName: "",
      totalMemberCnt: 0,
      currentMemberCnt: 0,
    },
  });
  const clubPk = props.route.params.clubPk;
  const member_pk = 1;

  // 클럽 데이터 가져오기
  const getClubData = async () => {
    try {
      const response = await fetch(
        `http://15.165.169.129/api/club/${clubPk}?member_pk=${member_pk}`
      );
      const thisData = await response.json();
      setClubData(thisData);
    } catch (error) {
      console.log("error in get Club data: " + error);
    }
  };

  // 화면 들어올 때 실행
  useEffect(() => {
    getClubData();
    setLoading(false);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <View>
      <Container>
        {/* 동아리 사진 삽입 */}
        {/* 더미 이미지 */}
        <ClubImage source={require("../assets/freeImages.png")} />

        <VContent>
          <VCenter>
            <Title>{clubData.data.clubName}</Title>
          </VCenter>
          <ClubInfo>
            <SpaceBetween>
              <ContentText>동아리 총 인원 :</ContentText>
              <ContentText>{clubData.data.totalMemberCnt}</ContentText>
            </SpaceBetween>
            <SpaceBetween>
              <ContentText>동아리방 현재 인원 :</ContentText>
              <ContentText>{clubData.data.currentMemberCnt}</ContentText>
            </SpaceBetween>
            <CheckinView>
              <ContentText>체크인</ContentText>
              <UncheckedBox />
            </CheckinView>
          </ClubInfo>
        </VContent>

        <Posting>
          <OnPressButton
            title="공지사항"
            onPress={() => {
              props.navigation.navigate("Notice", {
                member_pk: member_pk,
                clubPk: clubPk,
              });
            }}
          >
            <ButtonText>공지사항</ButtonText>
          </OnPressButton>
          <OnPressButton
            title="타임라인"
            onPress={() => {
              props.navigation.navigate("Timeline", {
                member_pk: member_pk,
                clubPk: clubPk,
              });
            }}
          >
            <ButtonText>타임라인</ButtonText>
          </OnPressButton>
        </Posting>
      </Container>
      <IntroducingContainer>
        <IntroducingLabel>동아리 소개</IntroducingLabel>
        <Introducing>
          <IntroducingText>{clubData.data.intro}</IntroducingText>
        </Introducing>
      </IntroducingContainer>
    </View>
  );
};

export default Club;
