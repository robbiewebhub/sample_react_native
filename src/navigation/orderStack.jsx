import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {COLORS} from '../constant';
import OrderListScreen from '../screens/buyer/order/OrderListScreen';
const Stack = createNativeStackNavigator();

export default function OrderStack() {
  return (
    <Stack.Navigator
      initialRouteName="Discover"
      screenOptions={({route}) => ({
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.common.white,
        },
      })}>
      <Stack.Screen name="Discover" component={OrderListScreen} />
    </Stack.Navigator>
  );
}
