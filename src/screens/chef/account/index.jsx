import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import Avatar from '../../../components/avatar';
import DropdownBtn from '../../../components/bottomSheet/DropdownBtn';
import InnerHeader from '../../../components/header/innerHeader';
import { COLORS, FONTS, ICONS, IMAGES } from '../../../constant';
import {
  imageBaseUrl,
  useGetMyKitchenQuery,
  useGetUserMenuQuery,
  useGetUserProfileQuery,
} from '../../../services/api';
import { navigate } from '../../../utils/navigations';
import MenuPopup from '../menu/menuPopup';
import FeedTab from './feed';

export default function ChefAccountScreen() {
  const menuPopRef = useRef(null);
  const tabBarHeight = useBottomTabBarHeight();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const {data: getUserProfile, refetch} = useGetUserProfileQuery();

  const {data: getUserMenu, refetch: refetchUserMenu} = useGetUserMenuQuery();

  const {
    data: getMyKitchen,
    refetch: refetchMyKitchen,
    isFetching: isFetchingMyKitchen,
  } = useGetMyKitchenQuery();

  let userMenu = getUserMenu?.data;
  let kitcheProfileData = getMyKitchen?.data;
  let userProfile = getUserProfile?.data;

  const actionList = [
    {
      icon: ICONS.cameraIcon,
      label: 'New post',
      action: () =>
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          multiple: true,
          mediaType: 'photo',
        }).then(image => {
          navigate('ManagePost', {kitcheProfileData, image, isEdit: false});
        }),
    },
    {
      icon: ICONS.wineGlassIcon,
      label: 'New event',
      action: () =>
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: false,
          // multiple: true,
          mediaType: 'photo',
        }).then(image => {
          navigate('ManageEvent', {kitcheProfileData, image, isEdit: false});
        }),
    },
    {
      icon: ICONS.pollIcon,
      label: 'New poll',
      action: () => {
        navigate('NewPollScreen', {kitcheProfileData, isEdit: false});
      },
    },
  ];

  useFocusEffect(
    useCallback(() => {
      refetchUserMenu();
      refetchMyKitchen();
      return () => {
        console.log('Chef Account Screen unfocused');
      };
    }, [refetchUserMenu]),
  );

  //Show modal when data is fetched and empty

  useEffect(() => {
    if (userMenu?.length === 0) {
      menuPopRef.current?.present();
    }
  }, [userMenu]);

  const handleCloseMenuPopup = () => {
    menuPopRef.current?.dismiss();
  };

  const handleGoToMenu = () => {
    menuPopRef.current?.dismiss();
    setTimeout(() => {
      navigate('SecondBottomTab', {screen: 'MenuStack'});
    }, 1000);
  };

  return (
    <View style={[styles.wrapper, {paddingBottom: tabBarHeight}]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          // onPress={() => navigate('SettingScreen')}
          onPress={() => navigate('AccountStack', {screen: 'SettingScreen'})}
          style={{paddingLeft: 16}}>
          <Image source={ICONS.settingIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <InnerHeader hideBackBtn>
          <DropdownBtn
            actionList={actionList}
            selectedItem={selectedMenuItem}
            setItem={setSelectedMenuItem}>
            <Image
              source={ICONS.addIcon}
              style={styles.headerIcon}
              tintColor={COLORS.neutral[900]}
            />
          </DropdownBtn>
        </InnerHeader>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* <Image
              source={{uri: `${imageBaseUrl}${kitcheProfileData?.coverImage}`}}
              style={{
                width: '100%',
                height: 220,
              }}
              resizeMode="cover"
            /> */}
            <FastImage
              source={{
                uri: `${imageBaseUrl}${kitcheProfileData?.coverImage}`,
                priority: FastImage.priority.high,
              }}
              style={{width: "100%", height: 220}}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={{paddingVertical: 20, paddingHorizontal: 16, gap: 16}}>
              <View style={styles.infoCard}>
                <Avatar
                  path={
                    userProfile?.profilePic
                      ? `${imageBaseUrl}${userProfile.profilePic}`
                      : IMAGES.userImg1
                  }
                  size={80}
                />

                <Text style={styles.infoCardTtl}>
                  {kitcheProfileData?.name}
                </Text>
                <Text style={styles.infoCardRating}>
                  {kitcheProfileData?.message}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, gap: 4, alignItems: 'center'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                    }}>
                    <Image
                      source={ICONS.starIcon}
                      style={{width: 20, height: 20}}
                    />
                    <Text style={styles.infoVal}>4.8</Text>
                  </View>
                  <Text style={styles.infoLav}>Review</Text>
                </View>
                <View style={styles.divider} />
                <View style={{flex: 1, gap: 4, alignItems: 'center'}}>
                  {kitcheProfileData?.avg_pickup_time && (
                    <Text style={styles.infoVal}>{`${
                      kitcheProfileData?.avg_pickup_time || 0
                    } mins`}</Text>
                  )}

                  <Text style={styles.infoLav}>Pickup time</Text>
                </View>
                <View style={styles.divider} />
                <View style={{flex: 1, gap: 4, alignItems: 'center'}}>
                  <Text style={styles.infoVal}>15</Text>
                  <Text style={styles.infoLav}>Followers</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{marginBottom: 8}}
                onPress={() => navigate('CookProfileScreen')}>
                <View style={styles.chefProfile}>
                  <Text style={styles.chefProfileText}>
                    {`Hi, I’m ${kitcheProfileData?.name}! I love cooking for my neighbors – hope you’re hungry!`}
                  </Text>
                  <Image
                    source={ICONS.leftArrowIcon}
                    tintColor={COLORS.neutral[600]}
                    style={styles.chefProfileIcon}
                  />
                </View>
              </TouchableOpacity>
              <FeedTab
                kitcheProfileData={kitcheProfileData}
                userProfilePic={`${imageBaseUrl}${userProfile?.profilePic}`}
              />
            </View>
          </>
        )}
        ListFooterComponent={() => null}
      />
      <MenuPopup
        ref={menuPopRef}
        onGoToMenu={handleGoToMenu}
        onClose={handleCloseMenuPopup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
  infoCard: {
    alignItems: 'center',
    gap: 8,
  },
  infoCardTtl: {
    color: COLORS.neutral[900],
    fontSize: 18,
    fontFamily: FONTS.poppins[500],
  },
  infoCardRating: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.neutral[200],
  },
  infoVal: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  infoLav: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  chefProfile: {
    backgroundColor: COLORS.neutral[75],
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chefProfileText: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    gap: 8,
    flex: 1,
    paddingRight: 80,
  },
  chefProfileIcon: {
    width: 24,
    height: 24,
    transform: [{rotateY: '180deg'}],
  },
});
