import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {COLORS, FONTS, ICONS, IMAGES} from '../../../constant';
import Avatar from '../../../components/avatar';
import ImageCropPicker from 'react-native-image-crop-picker';
import CustomModal from '../../../components/customModal';
import ButtonBox from '../../../components/button';
import InputField from '../../../components/inputfield';

const profileData = [
  {
    label: 'Full Name',
    value: 'Sandy Chu',
  },
  {
    label: 'Email Address',
    value: 'sandy@gmail.com',
  },
  {
    label: 'Phone Number (Optional)',
    value: '+1 (123)-345-6790',
  },
];

const chefProfileData = [
  {
    label: 'Kitchen Name',
    value: "May's Chinese Cuisine",
    edit: true,
  },
  {
    label: 'Pickup Location',
    value: '123 West 13th st apt 1234, Brooklyn NY 10011',
    edit: true,
  },
  {
    label: 'Pickup Area',
    value: 'Brooklyn - Sunset Park',
    edit: false,
  },
  {
    label: 'Avg. Pickup Time (mins)',
    value: '5-15',
    edit: true,
  },
  {
    label: 'From the Cook',
    value:
      "Hi, I/’m May! I love cooking for my neighbors – hope you’re hungry! I believe that good food brings people together, and there’s nothing more special than sharing a homemade meal with the community. Everything I make comes from the heart, using recipes passed down from family and inspired by the seasons. Whether you're just around the corner or visiting for the first time, I'm so excited to share my kitchen with you!",
    edit: true,
    multiline: true,
  },
];

const tabList = [
  {
    label: 'Cook',
  },
  {
    label: 'Buyer',
  },
];

const ProfilePicture = () => {
  const [imageUri, setImageUri] = useState(IMAGES.userImg1);

  const pickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      });
      if (image?.path) {
        setImageUri(image.path);
      }
    } catch (e) {
      if (e.code === 'E_PICKER_CANCELLED') {
        console.log('User cancelled image picker');
      } else {
        console.log('ImageCropPicker Error:', e);
      }
    }
  };
  return (
    <View style={{position: 'relative', alignSelf: 'center'}}>
      <Avatar path={imageUri} size={80} />
      <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
        <Image source={ICONS.cameraIcon} style={{width: 20, height: 20}} />
      </TouchableOpacity>
    </View>
  );
};

const KitchenIntroScreen = () => {
  const fieldRef = useRef();
  const [currentTab, setCurrentTab] = useState('Cook');
  const [modalTitle, setModalTitle] = useState();
  const [modalValue, setModalValue] = useState();
  const [isMultiLine, setIsMultiLine] = useState(false);

  const onEditField = item => {
    setModalTitle(item.label);
    setModalValue(item.value);
    setIsMultiLine(item.multiline);
    fieldRef.current.present();
  };

  return (
    <View style={{flex: 1}}>
      <PrimaryHeader title={`${currentTab} intro`} />
      <View style={{flex: 1, paddingHorizontal: 40, gap: 16}}>
        <ProfilePicture />
        <View style={{flexDirection: 'row'}}>
          {tabList.map((item, idx) => (
            <TouchableOpacity
              key={`${idx}`}
              style={{flex: 1}}
              onPress={() => setCurrentTab(item.label)}>
              <Text
                style={[
                  styles.tabItem,
                  {
                    fontFamily:
                      currentTab === item.label
                        ? FONTS.poppins[500]
                        : FONTS.poppins[400],
                    color:
                      currentTab === item.label
                        ? COLORS.primary[300]
                        : COLORS.neutral[400],
                    borderBottomColor:
                      currentTab === item.label
                        ? COLORS.primary[300]
                        : 'transparent',
                  },
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {currentTab === 'Cook' ? (
            <View style={{gap: 16}}>
              {chefProfileData.map((item, idx) => (
                <View key={`chefprofile__${idx}`} style={{gap: 16}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, gap: 4}}>
                      <Text style={styles.label}>{item.label}</Text>
                      <Text style={styles.value}>{item.value}</Text>
                    </View>
                    {item.edit ? (
                      <TouchableOpacity onPress={() => onEditField(item)}>
                        <Image
                          source={ICONS.editIcon}
                          style={{width: 32, height: 32}}
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View style={styles.divider} />
                </View>
              ))}
            </View>
          ) : (
            <View style={{gap: 16}}>
              {profileData.map((item, idx) => (
                <View key={`profile__${idx}`} style={{gap: 16}}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 1, gap: 4}}>
                      <Text style={styles.label}>{item.label}</Text>
                      <Text style={styles.value}>{item.value}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onEditField(item)}>
                      <Image
                        source={ICONS.editIcon}
                        style={{width: 32, height: 32}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
      <CustomModal openRef={fieldRef} title={modalTitle}>
        <View style={{gap: 24}}>
          <View style={{gap: 4}}>
            <Text style={styles.label}>{modalTitle}</Text>
            <InputField
              placeholder={`Enter ${modalTitle}`}
              value={modalValue}
              onChange={e => setModalValue(e)}
              multiline={isMultiLine}
              customStyle={
                isMultiLine
                  ? {
                      paddingVertical: 16,
                      borderRadius: 8,
                    }
                  : null
              }
              maxLength={isMultiLine ? 500 : null}
            />
            {isMultiLine ? (
              <Text style={[styles.label, {marginTop: 5}]}>
                {modalValue.length}/500
              </Text>
            ) : null}
          </View>
          <ButtonBox label="Save" onPress={() => fieldRef.current.close()} />
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  tabItem: {
    borderBottomWidth: 2,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  cameraBtn: {
    alignItems: 'center',
    bottom: 0,
    borderRadius: 24,
    backgroundColor: COLORS.common.white,
    justifyContent: 'center',
    right: 0,
    width: 24,
    height: 24,
    position: 'absolute',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
  },
  label: {
    color: COLORS.neutral[500],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  value: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
});

export default KitchenIntroScreen;
