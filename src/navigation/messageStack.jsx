import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {COLORS} from '../constant';
import MessageScreen from '../screens/buyer/messages';
import NewMessageScreen from '../screens/buyer/messages/newMessage';
import ChatScreen from '../screens/buyer/messages/chatScreen';
// import MessageScreen from '../screens/messages';
// import ChatScreen from '../screens/messages/chatScreen';
// import NewMessageScreen from '../screens/messages/newMessage';

const Stack = createNativeStackNavigator();

export default function MessageStack() {
  return (
    <Stack.Navigator
      initialRouteName="Message"
      screenOptions={({route}) => ({
        headerShown: false,
        contentStyle: {
          backgroundColor: COLORS.common.white,
        },
      })}>
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="NewMessage" component={NewMessageScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}
