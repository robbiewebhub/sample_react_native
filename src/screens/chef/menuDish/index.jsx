import { useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import InnerHeader from '../../../components/header/innerHeader';
import { COLORS, FONTS, ICONS, SCREEN_HEIGHT } from '../../../constant';
import { imageBaseUrl } from '../../../services/api';
import { navigate } from '../../../utils/navigations';

export default function MenuDishScreen() {
  const {
    params: {menuItem},
  } = useRoute();

  return (
    <View style={styles.wrapper}>
      <InnerHeader>
        <View style={{position: 'relative'}}>
          <TouchableOpacity
            onPress={() =>
              navigate('ManageDishScreen', {isEdit: true, menuItem: menuItem})
            }>
            <Image source={ICONS.editIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </InnerHeader>
      <ScrollView
        contentContainerStyle={{paddingBottom: 60, gap: 16}}
        showsVerticalScrollIndicator={false}>
        <View style={{gap: 16}}>
          {/* <Image
            source={{uri: `${imageBaseUrl}${menuItem.image[0]}`}}
            style={styles.wrapperImg}
          /> */}
          <FastImage source={{uri: `${imageBaseUrl}${menuItem.image[0]}`, priority: FastImage.priority.normal}} style={styles.wrapperImg} />
        </View>

        <View style={styles.layout}>
          <View style={styles.tagView}>
            <View style={{flexDirection: 'row', gap: 8}}>
              <View style={styles.itemLayout}>
                <Text style={styles.itemType}>Chinese</Text>
              </View>
              <View style={[styles.itemLayout, {backgroundColor: '#EBF4EC'}]}>
                <Text style={[styles.itemType, {color: '#225725'}]}>
                  Vegeterian
                </Text>
              </View>
            </View>
          </View>

          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Text style={styles.priceText}>{`$${menuItem?.price}`}</Text>
          </View>
        </View>
        <View style={{paddingHorizontal: 16}}>
          <Text style={styles.title}>{menuItem?.name}</Text>
          <Text style={styles.subTitle}>May's Chinese Cuisine</Text>
          <View style={{flexDirection: 'row', gap: 4}}>
            <Text style={styles.desc}>{`${menuItem?.prep_time} mins`}</Text>
            <Text style={styles.desc}>·</Text>
            <Text style={styles.desc}>{`${menuItem?.serving} serving`}</Text>
          </View>

          <Text style={[styles.desc]}>{menuItem?.ingredient}</Text>
        </View>

        <View style={styles.caution}>
          <Image source={ICONS.warningIcon} style={{width: 24, height: 24}} />
          <View>
            <Text style={styles.infoText}>Allergen Info</Text>
            <Text style={[styles.desc]}>This dish contains eggs.</Text>
          </View>
        </View>

        <View style={{marginHorizontal: 16}}>
          <Text style={styles.fromChefText}>From chef</Text>

          <Text style={[styles.bodyXsText]}>{menuItem?.short_description}</Text>
        </View>
      </ScrollView>
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
  wrapperImg: {
    width: '100%',
    // height: 220,
    height: SCREEN_HEIGHT * 0.26,
    resizeMode: 'cover',
  },
  layout: {
    paddingHorizontal: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagView: {
    width: '65%',
    height: 'auto',
    gap: 8,
  },
  itemLayout: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: '#FF8A9C',
  },
  itemType: {
    color: '#63000F',
    fontFamily: FONTS.poppins[400],
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 12,
  },
  priceText: {
    color: COLORS.neutral[900],
    textAlign: 'center',
    fontFamily: FONTS.poppins[600],
    fontSize: 20,
  },
  title: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[600],
    fontSize: 20,
  },
  subTitle: {
    color: COLORS.neutral['black'],
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  desc: {
    color: COLORS.neutral[600],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  infoText: {
    color: COLORS.error[300],
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
  },
  caution: {
    flexDirection: 'row',
    backgroundColor: '#FBEAEA',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  fromChefText: {
    color: COLORS.neutral[600],
    fontFamily: FONTS.poppins[400],
    fontSize: 12,
  },
  bodyXsText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
});
