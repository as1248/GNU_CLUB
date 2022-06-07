import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components/native";
import Loader from "../components/Loader";
import { CheckedBox, UncheckedBox } from "../components/Icon";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  flex: 1;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 0 3% 0;
`;

const OnPressButton = styled.TouchableOpacity`
  padding: 2% 13%;
  margin: 0 3%;
  border-radius: 5px;
  background-color: #0d6efd;
`;

const SubmitButton = styled(OnPressButton)`
  padding: 2%;
  width: 99%;
`;

const ButtonText = styled.Text`
  font-size: 20px;
  color: white;
  font-weight: 200;
  text-align: center;
`;

const IntroducingContainer = styled.View`
  padding: 0 5%;
  margin: 6% 0 0 0;
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
  const [checkIn, setCheckIn] = useState(false);
  const [ModalVisible, setModal] = useState(false);
  const clubPk = props.route.params.clubPk;

  //새로고침
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getClubData();
    setRefreshing(false);
  };
  let member_pk;
  // 클럽 데이터 가져오기
  const getClubData = async () => {
    try {
      member_pk = await AsyncStorage.getItem("pk");
      const response = await fetch(
        `http://15.165.169.129/api/club/${clubPk}?member_pk=${member_pk}`
      );
      const thisData = await response.json();
      setClubData(thisData);
      console.log(clubData);
    } catch (error) {
      console.log("error in get Club data: " + error);
    }
    
  };

  // 화면 들어올 때 실행
  useEffect(() => {
    getClubData();
    setLoading(false);
  }, []);

  // 현재 동방 인원수 +1
  const checkInTrue = async (isTrue) => {
    let thisClubData = clubData;
    isTrue
      ? thisClubData.data.currentMemberCnt++
      : thisClubData.data.currentMemberCnt--;
    setClubData(thisClubData);
    setCheckIn(isTrue);
  };

  // 체크 박스 클릭
  const clickCheckBox = async () => {
    try {
      const thisMemberPk = await AsyncStorage.getItem("pk");
      const response = await fetch(
        `http://15.165.169.129/api/member/${thisMemberPk}/check_in?club_pk=${clubPk}`,
        {
          method: "PUT",
        }
      );
      const json = await response.json();
      checkInTrue(json.data);
    } catch (error) {
      console.log("error in click check box: " + error);
    }
  };

  // 체크 박스 체크 유무
  const checkCheckbox = () => {
    return checkIn ? <CheckedBox /> : <UncheckedBox />;
  };

  // 가입 신청 눌렀을 때
  const apply = () => {
    setModal(true);
  };

  useEffect(() => {
    checkCheckbox();
  }, [checkIn]);

  return loading ? (
    <Loader />
  ) : (
    <View>
      <Container
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
              <TouchableOpacity onPress={clickCheckBox}>
                {checkCheckbox()}
              </TouchableOpacity>
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
        <SubmitButton onPress={apply}>
          <ButtonText>가입신청</ButtonText>
        </SubmitButton>
      </Container>
      <IntroducingContainer>
        <IntroducingLabel>동아리 소개</IntroducingLabel>
        <Introducing>
          <IntroducingText>{clubData.data.intro}</IntroducingText>
        </Introducing>
      </IntroducingContainer>
      <Modal visible={ModalVisible}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            height: 200,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 10 }}>이름</Text>
            <TextInput placeholder="홍길동" />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 10 }}>전화번호</Text>
            <TextInput placeholder="010-0000-0000" />
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 90,
              height: 30,
              marginTop: 50,
              backgroundColor: "skyblue",
              borderRadius: 40,
            }}
            onPress={() => {
              alert(clubData.data.clubName + " 동아리에 가입 신청되었습니다.");
              setModal(!ModalVisible);
            }}
          >
            <Text style={{ color: "white" }}>가입신청</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Club;
