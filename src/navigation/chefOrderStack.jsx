import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import OrderListScreen from '../screens/chef/order/OrderListScreen';
import {COLORS} from '../constant';
import ChefOrderDetail from '../screens/chef/orderDetail/ChefOrderDetail';
import ChefRateOrder from '../screens/chef/orderDetail/ChefRateOrder';

const Stack = createNativeStackNavigator();

export default function ChefOrderStack() {
  return (
    <Stack.Navigator
      initialRouteName="OrderList"
      screenOptions={({route}) => ({
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.common.white,
        },
      })}>
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="ChefOrderDetail" component={ChefOrderDetail} />
      <Stack.Screen name="ChefRateOrder" component={ChefRateOrder} />
    </Stack.Navigator>
  );
}
