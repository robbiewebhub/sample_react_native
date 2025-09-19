import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {COLORS} from '../constant';
import DashboardScreen from '../screens/chef/dashboard';
import TodayMenuScreen from '../screens/chef/kitchentodaymenu';
const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={({route}) => ({
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.common.white,
        },
      })}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="TodayMenuScreen" component={TodayMenuScreen} />
    </Stack.Navigator>
  );
}
