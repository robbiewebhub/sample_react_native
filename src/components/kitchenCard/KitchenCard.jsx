import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS, ICONS, IMAGES} from '../../constant';
import {imageBaseUrl} from '../../services/api';
import FastImage from 'react-native-fast-image';

const KitchenCard = ({item, onClick, isLikeable, userProfile}) => {
  if (!item) {
    return null;
  }
  const [isLike, setIsLike] = useState();
  return (
    <TouchableOpacity onPress={onClick}>
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <View style={styles.wrapperImgWrap}>
            {isLikeable ? (
              <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => setIsLike(!isLike)}>
                <Image
                  style={styles.heartBtnIcon}
                  source={isLike ? ICONS.heartFillIcon : ICONS.heartIcon}
                />
              </TouchableOpacity>
            ) : null}
            {/* <Image
              source={{uri: `${imageBaseUrl}${item?.coverImage}`}}
              style={styles.wrapperImg}
            /> */}
            <FastImage
              source={{
                uri: `${imageBaseUrl}${item?.coverImage}`,
                priority: FastImage.priority.high,
              }}
              style={styles.wrapperImg}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={styles.row}>
            {/* <Image source={{uri:`${imageBaseUrl}${item?.User?.profilePic}`}} style={styles.avatar} /> */}
            <FastImage
              source={{
                uri: `${imageBaseUrl}${userProfile?.profilePic}`,
                priority: FastImage.priority.normal,
              }}
              style={styles.avatar}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item?.name}</Text>
              <View style={styles.metaRow}>
                <Image source={ICONS.starIcon} style={styles.ratingIcon} />
                <Text style={styles.infoText}>
                  {' '}
                  {'4.8'} ({'1200'})
                </Text>
                <Text style={styles.infoText}>
                  {' '}
                  · {'0.6'} {'mi away'} · {'10'} {'min'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  wrapperImgWrap: {
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  heartBtn: {
    alignItems: 'center',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    backgroundColor: COLORS.common.white,
    justifyContent: 'center',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    position: 'absolute',
    zIndex: 1,
  },
  heartBtnIcon: {
    width: 24,
    height: 24,
  },
  wrapperImg: {
    width: '100%',
    height: 144,
    resizeMode: 'cover',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 44,
    objectFit: 'cover',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingIcon: {
    width: 16,
    height: 16,
  },
  infoText: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
});

export default KitchenCard;
