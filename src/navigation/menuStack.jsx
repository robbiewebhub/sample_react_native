import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { COLORS } from '../constant';
import MenuScreen from '../screens/chef/menu';
import ManageDishScreen from '../screens/chef/menu/manageDish';
import MenuDishScreen from '../screens/chef/menuDish';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator
      initialRouteName="Menu"
      screenOptions={({route}) => ({
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.common.white,
        },
      })}>
      <Stack.Screen name="Menu" component={MenuScreen} />
      <Stack.Screen name="MenuDishScreen" component={MenuDishScreen} />
      <Stack.Screen name="ManageDishScreen" component={ManageDishScreen} />
    </Stack.Navigator>
  );
}
