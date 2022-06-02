import React from "react";
import Main from "./Main";
import SignIn from "./SignIn";
import ClubList from "./ClubList";
import Club from "./Club";
import Notice from "./Notice";
import Timeline from "./Timeline";
import NoticePosting from "./NoticePosting";
import TimelinePosting from "./TimelinePosting";
import Login from "./Login";
import EditInfo from "./EditInfo";
import WatchNotice from "./WatchNotice";
import WatchTimeline from "./WatchTimeline";
import ClubCategory from "./ClubCategory";
import ManagerLogin from "./ManagerLogin ";

import { createNativeStackNavigator } from "@react-navigation/native-stack";


const Stack = createNativeStackNavigator();

const Root = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Login"
  >
    <Stack.Screen name="Main" component={Main} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="ClubList" component={ClubList} />
    <Stack.Screen name="Club" component={Club} />
    <Stack.Screen name="Notice" component={Notice} />
    <Stack.Screen name="Timeline" component={Timeline} />
    <Stack.Screen name="NoticePosting" component={NoticePosting} />
    <Stack.Screen name="TimelinePosting" component={TimelinePosting} />
    <Stack.Screen name="EditInfo" component={EditInfo} />
    <Stack.Screen name="WatchNotice" component={WatchNotice} />
    <Stack.Screen name="WatchTimeline" component={WatchTimeline} />
    <Stack.Screen name="ClubCategory" component={ClubCategory} />
    <Stack.Screen name="ManagerLogin" component={ManagerLogin} />
    
  </Stack.Navigator>
);

export default Root;
