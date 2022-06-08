import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const Timeline = ({navigation, route}) => {
    const clubPk = route.params.clubPk;
    const member_pk = route.params.member_pk;
    const [timelineList,setTimelineList] = useState<any>();
    const [loading,setLoading] = useState(true);
    const [userType,setUserType] = useState('');
    const callApi = async() => {
        try{
            const response = await axios.get(`http://15.165.169.129/api/club/${clubPk}/timelines`);
            setTimelineList(response.data.data);
            setLoading(false);
        }catch(error){
            console.log(error);
        };
    }
    
    useEffect(() => {callApi()},[timelineList]);
    if(userType == ''){
        AsyncStorage.getItem('userType.userType', (err, result) => {
            setUserType(result); // 유저 타입 출력
        });
    }
    return (
      <View>
          {loading ? (<View>
              <ActivityIndicator size="large" />
          </View>) : (
        <Main>
            <Header>
                <GoBack onPress={() => navigation.goBack()}>&lt;</GoBack>
                {(userType == 'manager') ?
                    (<Posting onPress={() => navigation.navigate('TimelinePosting',{clubPk: clubPk})}>+</Posting>) : (<View></View>)
                }
            </Header>   
            <List>
                {timelineList.reverse().map((timeline:any,index:number)=>{
                    return(
                    <Posted onPress={() => navigation.navigate('WatchTimeline',{timelinePk: timeline.timelinePk, memberPk: member_pk, userType})} key={index}>
                        <Title>{timeline.title}</Title>
                    </Posted>
                    );
                })}
            </List>
        </Main>
            ) }    
        </View>
    );
};

export default Timeline;