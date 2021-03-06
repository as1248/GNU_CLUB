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
  StyleSheet,
} from "react-native";
import axios from "axios";
import Modal from "react-native-modal";
import styled from "styled-components/native";
import Loader from "../components/Loader";
import { CheckedBox, UncheckedBox } from "../components/Icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

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
  background-color: #38aeea;
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

const ImgBox = styled.View``;

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
  const [member_pk, setMemberPk] = useState(0);
  const [whereCheckIn, setWhereCheckIn] = useState(null);
  const [image, setImage] = useState(null);
  const [userType, setUserType] = useState("");

  //????????????
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await getClubData();
    await getIsCheckIn();
    setRefreshing(false);
  };
  // ?????? ????????? ????????????
  const getClubData = async () => {
    try {
      setMemberPk(await AsyncStorage.getItem("pk"));
      const response = await fetch(
        `http://15.165.169.129/api/club/${clubPk}?member_pk=${member_pk}`
      );
      const thisData = await response.json();
      setClubData(thisData);
    } catch (error) {
      console.log("error in get Club data: " + error);
    }
  };

  // ?????? ????????? ??? ??????
  useEffect(() => {
    getClubData();
    setLoading(false);
    getIsCheckIn();
  }, []);

  // ?????? ?????? ????????? +1
  const checkInTrue = async (isTrue) => {
    let thisClubData = clubData;
    isTrue
      ? thisClubData.data.currentMemberCnt++
      : thisClubData.data.currentMemberCnt--;
    setClubData(thisClubData);
    setCheckIn(isTrue);
  };

  // ?????? ????????? ??????????????????
  const getIsCheckIn = async () => {
    try {
      const thisMemberPk = await AsyncStorage.getItem("pk");
      const response = await fetch(
        `http://15.165.169.129/api/member/${thisMemberPk}/check_in`
      );
      const json = await response.json();
      setWhereCheckIn(json.data);
      console.log("?????? ???????????? ??? : " + whereCheckIn);
      console.log("?????? ????????? : " + clubPk);
      if (whereCheckIn == clubPk) {
        setCheckIn(true);
      }
    } catch (error) {
      console.log("error in get is checkin ? : " + error);
    }
  };

  // ?????? ?????? ??????
  const clickCheckBox = async () => {
    let clubCurrentMemberCnt = clubData.data.currentMemberCnt;
    if (whereCheckIn != null && whereCheckIn != clubPk) {
      alert("?????? ?????? ??????????????? ????????? ??????????????????.");
    } else {
      if (clubCurrentMemberCnt >= 8) {
        alert("?????? ???????????? ????????? ???????????????.");
      } else {
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
      }
    }
  };

  // ?????? ?????? ?????? ??????
  const checkCheckbox = () => {
    return checkIn ? <CheckedBox /> : <UncheckedBox />;
  };

  // ?????? ?????? ????????? ???
  const apply = () => {
    setModal(true);
  };

  useEffect(() => {
    checkCheckbox();
  }, [checkIn]);

  useEffect(() => {
    getIsCheckIn();
  }, [whereCheckIn]);

  useEffect(() => {
    getClubData();
  }, [image]);

  // ????????? ???????????? ??????

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    const uri = result.uri;
    setImage(uri);
    console.log("image : " + image);
    console.log("result : " + result);
    callApi();
  };

  const callApi = async () => {
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", {
          uri: image,
          name: image.split("/").pop(),
          type: "image/png",
        });
        console.log("?????????????????? ?????????");
      } else {
        formData.append("image", null);
        console.log("image is null");
      }
      const response = await axios({
        method: "put",
        url: `http://15.165.169.129/api/club/${clubPk}/background_image`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "*/*",
        },
      });
      console.log(response.data.data);
      console.log("API ????????? ?????????");
    } catch (error) {
      console.log("error in callAPI : " + error);
    }
  };

  if (userType == "") {
    AsyncStorage.getItem("userType.userType", (err, result) => {
      setUserType(result);
    });
  }
  return loading ? (
    <Loader />
  ) : (
    <View>
      <Container
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userType == "manager" ? (
          <TouchableOpacity style={styles.Btn} onPress={pickImage}>
            <Text style={{ fontSize: 15, color: "white" }}>
              ????????? ???????????? ??????
            </Text>
          </TouchableOpacity>
        ) : (
          <View></View>
        )}

        {/* <ClubImage source={require("../assets/freeImages.png")} /> */}
        <ImgBox>
          <Image
            style={{
              width: 325,
              height: 260,
              borderColor: "#38aeea",
              borderWidth: 10,
              borderRadius: 10,
              marginTop: 20,
            }}
            source={{
              width: 325,
              height: 260,
              borderColor: "#38aeea",
              borderWidth: 20,
              borderRadius: 10,
              uri: `${clubData.data.backgroundImgUrl}`,
            }}
          />
        </ImgBox>

        <VContent>
          <VCenter>
            <Title>{clubData.data.clubName}</Title>
          </VCenter>
          <ClubInfo>
            {/* <SpaceBetween>
              <ContentText>????????? ??? ?????? :</ContentText>
              <ContentText>{clubData.data.totalMemberCnt}</ContentText>
            </SpaceBetween> */}
            <SpaceBetween>
              <ContentText>???????????? ?????? ?????? :</ContentText>
              <ContentText>{clubData.data.currentMemberCnt}</ContentText>
            </SpaceBetween>
            <CheckinView>
              <ContentText>?????????</ContentText>
              <TouchableOpacity onPress={clickCheckBox}>
                {checkCheckbox()}
              </TouchableOpacity>
            </CheckinView>
          </ClubInfo>
        </VContent>

        <Posting>
          <OnPressButton
            title="????????????"
            onPress={() => {
              props.navigation.navigate("Notice", {
                member_pk: member_pk,
                clubPk: clubPk,
              });
            }}
          >
            <ButtonText>????????????</ButtonText>
          </OnPressButton>
          <OnPressButton
            title="????????????"
            onPress={() => {
              props.navigation.navigate("Timeline", {
                member_pk: member_pk,
                clubPk: clubPk,
              });
            }}
          >
            <ButtonText>????????????</ButtonText>
          </OnPressButton>
        </Posting>
        <SubmitButton onPress={apply}>
          <ButtonText>????????????</ButtonText>
        </SubmitButton>
      </Container>
      <IntroducingContainer>
        <IntroducingLabel>????????? ??????</IntroducingLabel>
        <Introducing>
          <IntroducingText>{clubData.data.intro}</IntroducingText>
        </Introducing>
      </IntroducingContainer>
      <Modal>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            height: 200,
            borderWidth: "2px",
            borderColor: "#38aeea",
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 10 }}>??????</Text>
            <TextInput placeholder="?????????" />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text style={{ marginRight: 10 }}>????????????</Text>
            <TextInput placeholder="010-0000-0000" />
          </View>
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 90,
              height: 30,
              marginTop: 50,
              backgroundColor: "#38aeea",
              borderRadius: 4,
            }}
            onPress={() => {
              alert(clubData.data.clubName + " ???????????? ?????? ?????????????????????.");
              setModal(!ModalVisible);
            }}
          >
            <Text style={{ color: "white" }}>????????????</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  Btn: {
    borderRadius: 3,
    backgroundColor: "#ced1ce",
    width: 150,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Club;
