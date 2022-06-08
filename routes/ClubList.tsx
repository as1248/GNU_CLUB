import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Text, View } from "react-native";

const Container = styled.ScrollView`
  padding-top: 5%;
`;

const List = styled.View`
  display: flex;
  justify-content: center;
  border: 3px;
  border-radius: 10px;
  border-color: #9a9a9a;
  margin: 2% 10%;
  background-color: #ced1ce;
  height: 50px;
`;

const CategoryText = styled.Text`
  margin-left: 5%;
  font-size: 25px;
  color: #4b4b4b;
`;

const ClubList = ({ navigation }) => {
  const [categoryList, setCategoryList] = useState([]);

  // 유저 데이터 가져오기
  const getUserDate = async () => {
    try {
      // const memberPk = AsyncStorage.getItem(pk);
      const response = await fetch(
        `http://15.165.169.129/api/member/1/my_page`
      );
      const json = await response.json();

      //redux 저장 필요
    } catch (error) {
      console.log("error in get Category List: " + error);
    }

    // 유저 타입 불러오기
    AsyncStorage.getItem("userType.userType", (err, result) => {
      console.log(result); // 유저 타입 출력
    });
  };

  // 카테 고리 가져오기
  const getCategoryList = async () => {
    try {
      const response = await fetch(`http://15.165.169.129/api/categories`);
      const json = await response.json();
      setCategoryList(json.data);
    } catch (error) {
      console.log("error in get Category List: " + error);
    }
  };

  // 시작 시 실행 함수
  useEffect(() => {
    getCategoryList();
    getUserDate();
  }, []);

  return (
    <Container>
      {categoryList.map((category, key) => {
        return (
          <List key={key}>
            <CategoryText
              onPress={() =>
                navigation.navigate("ClubCategory", {
                  categoryName: category.categoryName,
                  categoryPk: category.categoryPk,
                })
              }
            >
              {category.categoryName} 분야
            </CategoryText>
          </List>
        );
      })}
    </Container>
  );
};

export default ClubList;
