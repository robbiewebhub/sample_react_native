import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import InnerHeader from '../../../components/header/innerHeader';
import {useAppSwitcher} from '../../../hooks/appSwitcher';
import Avatar from '../../../components/avatar';
import {COLORS, FONTS, ICONS, IMAGES} from '../../../constant';
import CustomModal from '../../../components/customModal';
import ButtonBox from '../../../components/button';
import {navigate, resetAndNavigate} from '../../../utils/navigations';
import {useDispatch, useSelector} from 'react-redux';
import {clearUser} from '../../../store/slices/userSlice';
import {
  api,
  useGetMyKitchenQuery,
  useLogoutMutation,
} from '../../../services/api';
import {showSuccess} from '../../../utils/flashMessageUtils';
import FullScreenLoader from '../../../components/loader/FullScreenLoader';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const actionList = [
  {
    icon: ICONS.kitchenIcon,
    label: 'Kitchen Profile',
    path: 'KitchenProfileScreen',
  },
  {
    icon: ICONS.chartIcon,
    label: 'Kitchen Performance',
    path: 'KitchenPerformanceScreen',
  },
  {
    icon: ICONS.videoIcon,
    label: 'Link Social Media',
    path: 'LinkSocialMediaScreen',
  },
  {
    icon: ICONS.notificationIcon,
    label: 'Notifications',
    path: 'NotificationScreen',
  },
  {
    icon: ICONS.questionIcon,
    label: 'FAQ',
    path: 'FAQScreen',
  },
  {
    icon: ICONS.infoIcon,
    label: 'About Munch',
    path: 'AboutMunchScreen',
  },
  {
    icon: ICONS.closeCircleIcon,
    label: 'Delete Account',
  },
];

const deleteList = [
  {
    label:
      'You’ll permanently delete your account and will no longer be able to login.',
  },
  {
    label:
      'Once your request is processes, your personal data will be deleted in accordance with applicable law.',
  },
];

const DeleteModal = ({openRef}) => {
  return (
    <CustomModal openRef={openRef} title="Request to Delete Your Account?">
      <View style={{gap: 24}}>
        <View style={{gap: 16}}>
          {deleteList.map((item, idx) => (
            <View key={idx} style={{flexDirection: 'row', gap: 8}}>
              <View style={styles.dot} />
              <Text style={styles.deleteText}>{item.label}</Text>
            </View>
          ))}
        </View>
        <ButtonBox
          label="Delete account"
          type="danger"
          onPress={() => openRef.current.close()}
        />
      </View>
    </CustomModal>
  );
};

const SettingScreen = () => {
  const deleteRef = useRef(null);
  const {toggleApp, isSecondApp, setIsSecondApp} = useAppSwitcher();
  const [logout, {data, isLoading, error}] = useLogoutMutation();
  const dispatch = useDispatch();

  const {
    data: getMyKitchen,
    refetch: refetchMyKitchen,
    isFetching,
  } = useGetMyKitchenQuery();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetchMyKitchen();
      };
      fetchData();
    }, []),
  );

  let kitcheProfileData = getMyKitchen?.data;

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();
      // console.log("🚀 ~ handleLogout ~ result:", result);
      if (result?.success) {
        showSuccess(result?.message ?? 'Logout done');
        dispatch(clearUser());
        resetAndNavigate('LoginScreen');
        setIsSecondApp(false);
        dispatch(api.util.resetApiState());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <PrimaryHeader icon={ICONS.closeIcon} title="Kitchen settings" />
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <View style={{gap: 8}}>
            {actionList.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.button}
                onPress={() => {
                  if (item.label === 'Delete Account') {
                    deleteRef.current.present();
                  } else if (item?.label === 'Kitchen Profile') {
                    navigate('KitchenProfileScreen', {
                      kitcheProfileData,
                      isFetching,
                    });
                  } else {
                    navigate(item.path);
                  }
                }}>
                <Image source={item.icon} style={styles.buttonIcon} />
                <Text style={styles.buttonText}>{item.label}</Text>
                <Image
                  source={ICONS.leftArrowIcon}
                  style={[
                    styles.buttonIcon,
                    {transform: [{rotateY: '180deg'}]},
                  ]}
                />
              </TouchableOpacity>
            ))}
            <View style={{paddingVertical: 16, gap: 21, alignItems: 'center'}}>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.logOut}>Log out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <FullScreenLoader isVisible={isLoading} />
      </ScrollView>
      <View style={{alignItems: 'center', marginBottom: 80}}>
        <ButtonBox
          icon={ICONS.sortIcon}
          label={'Switch to Buyer'}
          type="secondary"
          onPress={() => {
            navigate('BottomTab', {screen: 'AccountStack'});
            toggleApp();
          }}
        />
      </View>
      <DeleteModal openRef={deleteRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.neutral[200],
    gap: 8,
    flexDirection: 'row',
    padding: 16,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.neutral[600],
  },
  buttonText: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    flex: 1,
  },
  logOut: {
    color: COLORS.neutral['black'],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
    textDecorationLine: 'underline',
  },
  dot: {
    backgroundColor: COLORS.neutral[500],
    borderRadius: 4,
    width: 4,
    height: 4,
    marginTop: 8,
  },
  deleteText: {
    color: COLORS.neutral[500],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
});

export default SettingScreen;
