import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {COLORS} from '../constant';
import CartScreen from '../screens/buyer/cart';
import CookProfileScreen from '../screens/buyer/cookprofile';
import {navigationRef} from '../utils/navigations';
import BottomTab from './bottomtabbar';
import Checkout from '../screens/buyer/checkout';
import SpinTheWheel from '../screens/buyer/wheel';
import OrderScreen from '../screens/buyer/order';
import OrderDetail from '../screens/buyer/orderDetail';
import {KeyboardAvoidingView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RateOrder from '../screens/buyer/orderDetail/RateOrder';
import {useAppSwitcher} from '../hooks/appSwitcher';
import SecondBottomTab from './secondbottomtabbar';
import LoginScreen from '../screens/login';
import SignupScreen from '../screens/signup';
import ForgotScreen from '../screens/forgot';
import OtpScreen from '../screens/otp';
import TermsServiceScreen from '../screens/termservice';
import PrivacyPolicyScreen from '../screens/privacypolicy';
import {useSelector} from 'react-redux';
import ResetPasswordScreen from '../screens/resetpassword';
import KitchenProfileScreen from '../screens/chef/kitchenprofile';
import ProfileSettingScreen from '../screens/buyer/profilesettings';
import NewPollScreen from '../screens/chef/newpoll';
import ManagePost from '../screens/chef/posts';
import ManageEvent from '../screens/chef/events';
import ViewPost from '../screens/chef/viewpost';
import SettingScreen from '../screens/chef/account/setting';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const {bottom} = useSafeAreaInsets();
  const {isSecondApp} = useAppSwitcher();
  const userData = useSelector(state => state.user);
  const isLoggedIn = userData?.isLoggedIn;

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        paddingBottom: bottom,
        backgroundColor: COLORS.common.white,
      }}>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'BottomTab' : 'LoginScreen'}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.common.white,
          },
        }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name="TermsServiceScreen"
          component={TermsServiceScreen}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
        />
        <Stack.Screen
          name="BottomTab"
          component={isSecondApp ? SecondBottomTab : BottomTab}
        />
        <Stack.Screen name="CookProfileScreen" component={CookProfileScreen} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="RateOrder" component={RateOrder} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="SpinTheWheel" component={SpinTheWheel} />
        <Stack.Screen
          name="KitchenProfileScreen"
          component={KitchenProfileScreen}
        />
        <Stack.Screen
          name="ProfileSettingScreen"
          component={ProfileSettingScreen}
        />
        <Stack.Screen name="SecondBottomTab" component={SecondBottomTab} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
        <Stack.Screen name="NewPollScreen" component={NewPollScreen} />
        <Stack.Screen name="ManagePost" component={ManagePost} />
        <Stack.Screen name="ManageEvent" component={ManageEvent} />
        <Stack.Screen name="ViewPost" component={ViewPost} />
      </Stack.Navigator>
    </KeyboardAvoidingView>
  );
};

export default RootNavigator;
