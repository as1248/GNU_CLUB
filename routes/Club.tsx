import React, { useEffect, useState } from "react";
import { View, Text, Image, Button } from "react-native";
import styled from "styled-components/native";
import Loader from "../components/Loader";
import { CheckedBox, UncheckedBox } from "../components/Icon";

const Container = styled.ScrollView`
  display: flex;
  fles-direction: row;
  flex: 1;
  alignitems: center;
  padding: 15% 5%;
`;

const ClubImage = styled.Image`
  //   width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

const VContent = styled.View`
  display: flex;
  flex-direction: row;
  margin: 5% 0;
  justify-content: space-evenly;
  align-item: center;
  flex-wrap: wrap;
`;

const VCenter = styled.View`
  justify-content: center;
  align-item: center;
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
  margin: 0 0 5% 0;
  border: ;
`;

const OnPressButton = styled.Button`
  border-radius: 10px;
  font-size: 30px;
  flex: 1;
  width: 50%;
  padding: 5px 20px 5px 20px;
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

  // 네비게이션 이동
  const nav = (page) => {
    props.navigation.navigate(page);
  };

  return loading ? (
    <Loader />
  ) : (
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
            <ContentText>동아리 총 인원 : </ContentText>
            <ContentText>{clubData.data.totalMemberCnt}</ContentText>
          </SpaceBetween>
          <SpaceBetween>
            <ContentText>동아리방 현재 인원 : </ContentText>
            <ContentText> {clubData.data.currentMemberCnt}</ContentText>
          </SpaceBetween>
          <CheckinView>
            <ContentText>체크인</ContentText>
            <UncheckedBox />
          </CheckinView>
        </ClubInfo>
      </VContent>

      <Posting>
        <OnPressButton title="공지사항" onPress={() => nav("Notice")} />
        <OnPressButton title="타임라인" onPress={() => nav("Timeline")} />
      </Posting>

      <IntroducingLabel>동아리 소개</IntroducingLabel>
      <Introducing>
        <IntroducingText>
          {clubData.data.intro}Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor
          magna eget est lorem ipsum dolor sit. Volutpat odio facilisis mauris
          sit amet massa. Commodo odio aenean sed adipiscing diam donec
          adipiscing tristique. Mi eget mauris pharetra et. Non tellus orci ac
          auctor augue. Elit at imperdiet dui accumsan sit. Ornare arcu dui
          vivamus arcu felis. Egestas integer eget aliquet nibh praesent. In hac
          habitasse platea dictumst quisque sagittis purus. Pulvinar elementum
          integer enim neque volutpat ac. Senectus et netus et malesuada. Nunc
          pulvinar sapien et ligula ullamcorper malesuada proin. Neque convallis
          a cras semper auctor. Libero id faucibus nisl tincidunt eget. Leo a
          diam sollicitudin tempor id. A lacus vestibulum sed arcu non odio
          euismod lacinia. In tellus integer feugiat scelerisque. Feugiat in
          fermentum posuere urna nec tincidunt praesent. Porttitor rhoncus dolor
          purus non enim praesent elementum facilisis. Nisi scelerisque eu
          ultrices vitae auctor eu augue ut lectus. Ipsum faucibus vitae aliquet
          nec ullamcorper sit amet risus. Et malesuada fames ac turpis egestas
          sed. Sit amet nisl suscipit adipiscing bibendum est ultricies. Arcu ac
          tortor dignissim convallis aenean et tortor at. Pretium viverra
          suspendisse potenti nullam ac tortor vitae purus. Eros donec ac odio
          tempor orci dapibus ultrices. Elementum nibh tellus molestie nunc. Et
          magnis dis parturient montes nascetur. Est placerat in egestas erat
          imperdiet. Consequat interdum varius sit amet mattis vulputate enim.
          Sit amet nulla facilisi morbi tempus. Nulla facilisi cras fermentum
          odio eu. Etiam erat velit scelerisque in dictum non consectetur a
          erat. Enim nulla aliquet porttitor lacus luctus accumsan tortor
          posuere. Ut sem nulla pharetra diam. Fames ac turpis egestas maecenas.
          Bibendum neque egestas congue quisque egestas diam. Laoreet id donec
          ultrices tincidunt arcu non sodales neque. Eget felis eget nunc
          lobortis mattis aliquam faucibus purus. Faucibus interdum posuere
          lorem ipsum dolor sit.
        </IntroducingText>
      </Introducing>
    </Container>
  );
};

export default Club;
