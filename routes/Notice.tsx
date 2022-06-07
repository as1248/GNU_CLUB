import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import styled from 'styled-components/native';
import axios from "axios";

const Main = styled.View`
    display: flex;
    align-items: center;
    height: 98%;
`;

const Header = styled.View`
    width: 75%;
    margin-top: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const List = styled.ScrollView`
    width: 100%;
    margin-left: 30%;
    display: flex;
`;

const Posted = styled.TouchableOpacity`
    width: 70%;
    height: 60px;
    margin-top: 8%;
    border: 1px solid rgba(0,0,0,0.3);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
const Title = styled.Text`
    font-size: 25px;
`;

const Posting = styled.Text`
    font-size: 40px;
`;

const GoBack = styled.Text`
    font-size: 40px;
`;

const Notice = ({navigation, route}) => {
    const clubPk = route.params.clubPk;
    const member_pk = route.params.member_pk;
    const [noticeList,setNoticeList] = useState<any>();
    const [loading,setLoading] = useState(true);
    
    const callApi = async() => {
        try{
            const response = await axios.get(`http://15.165.169.129/api/club/${clubPk}/notices`);
            setNoticeList(response.data.data);
            setLoading(false);
        }catch(error){
            console.log(error);
        };
    }
    
    useEffect(() => {callApi()},[noticeList]);
    return (
      <View>
          {loading ? (<View>
              <ActivityIndicator size="large" />
          </View>) : (
        <Main>
            <Header>
                <GoBack onPress={() => navigation.goBack()}>&lt;</GoBack>
                <Posting onPress={() => navigation.navigate('NoticePosting',{clubPk: clubPk})}>+</Posting>
            </Header>   
            <List>
                {noticeList.reverse().map((notice:any,index:number)=>{
                    return(
                    <Posted onPress={() => navigation.navigate('WatchNotice',{noticePk: notice.noticePk, memberPk: member_pk})} key={index}>
                        <Title>{notice.title}</Title>
                    </Posted>
                    );
                })}
            </List>
        </Main>
            ) }    
        </View>
    );
};

export default Notice;