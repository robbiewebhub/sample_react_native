import {
  Alert,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useFormik } from 'formik';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import ImageCropPicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'; // Add this import
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../../components/avatar';
import ButtonBox from '../../../components/button';
import CustomModal from '../../../components/customModal';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import InputField from '../../../components/inputfield';
import FullScreenLoader from '../../../components/loader/FullScreenLoader';
import {
  COLORS,
  FONTS,
  GOOGLE_MAP_API_KEY,
  ICONS,
  IMAGES,
} from '../../../constant';
import { useAppSwitcher } from '../../../hooks/appSwitcher';
import {
  imageBaseUrl,
  useCreateKitchenMutation,
  useGetMyKitchenQuery,
  useGetUserProfileQuery,
  useRegisterChefMutation,
  useUpdateKitchenImageMutation,
  useUpdateKitchenMutation,
} from '../../../services/api';
import { showError, showSuccess } from '../../../utils/flashMessageUtils';
import { goBack } from '../../../utils/navigations';
import { kitchenProfileValidation } from '../../../utils/validations';

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

const CoverImageUploader = ({
  coverImageUri,
  setCoverImageUri,
  kitcheProfileData,
  updateKitchenImage,
  isUpdatingKitchenImage,
}) => {
  const pickCoverImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        width: 800,
        height: 400,
        mediaType: 'photo',
      });
      if (image?.path) {
        setCoverImageUri(image.path);
      }
    } catch (e) {
      if (e.code !== 'E_PICKER_CANCELLED') {
        console.log('Cover image picker error:', e);
        Alert.alert('Error', 'Failed to pick image');
      }
    }
  };

  const handleEditCoverImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        width: 800,
        height: 400,
        mediaType: 'photo',
      });

      if (image?.path) {
        setCoverImageUri(image?.path);

        const formData = new FormData();
        formData.append('kitchen', {
          uri: image.path,
          type: image.mime,
          name: 'cover.jpg',
        });

        const result = await updateKitchenImage({
          id: kitcheProfileData?.id,
          data: formData,
        }).unwrap();

        if (result?.success) {
          showSuccess('Cover image updated successfully');
        } else {
          showError('Update failed');
        }
      }
    } catch (e) {
      console.error('Cover image picker error:', e);
      Alert.alert('Error', 'Failed to update image');
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <Text style={styles.label}>Cover image</Text>

        {kitcheProfileData && (
          <TouchableOpacity
            onPress={handleEditCoverImage}
            style={{
              alignItems: 'center',
              borderRadius: 6,
              backgroundColor: COLORS.primary[500],
            }}>
            <Image source={ICONS.editIcon} style={{width: 32, height: 32}} />
          </TouchableOpacity>
        )}
      </View>

      <View>
        {coverImageUri ? (
          <>
            {isUpdatingKitchenImage && (
              <>
                <FullScreenLoader
                  isVisible={isUpdatingKitchenImage}
                  message="Updating cover image"
                />
              </>
            )}

            {/* <Image
              source={{uri: coverImageUri}}
              style={{
                width: '100%',
                height: 180,
                borderRadius: 12,
                marginTop: 10,
              }}
              resizeMode="cover"
            /> */}

            <FastImage
              source={{
                uri: coverImageUri,
                priority: FastImage.priority.high,
              }}
              style={{
                width: '100%',
                height: 180,
                borderRadius: 12,
                marginTop: 10,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            {/* <BlastedImage
              source={{uri: coverImageUri}}
              style={{
                // width: '100%',
                // height: 180,
                borderRadius: 12,
                marginTop: 10,
              }}
              height={180}
              width={'100%'}
            /> */}
          </>
        ) : (
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={pickCoverImage}>
            <Image
              source={ICONS.uploadIcon}
              style={{
                width: 16,
                height: 16,
                marginRight: 10,
              }}
              tintColor={COLORS.neutral[300]}
            />
            <Text style={[styles.value, {color: COLORS.neutral[300]}]}>
              No cover image yet
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const KitchenProfileScreen = () => {
  // const {
  //   params: {kitcheProfileData, isFetching},
  // } = useRoute();
  const fieldRef = useRef();
  const [modalTitle, setModalTitle] = useState();
  const [modalValue, setModalValue] = useState();
  const [isMultiLine, setIsMultiLine] = useState(false);
  const [coverImageUri, setCoverImageUri] = useState(null);
  const {toggleApp, isSecondApp} = useAppSwitcher();
  const {data: getUserProfile, refetch} = useGetUserProfileQuery();

  const {
    data: getMyKitchen,
    refetch: refetchMyKitchen,
    isFetching,
  } = useGetMyKitchenQuery();

  let userProfile = getUserProfile?.data;
  let kitcheProfileData = getMyKitchen?.data;

  // console.log('kitcheProfileData --->>>', kitcheProfileData);

  const [createKitchen, {isLoading}] = useCreateKitchenMutation();
  const [updateKitchen, {isLoading: isUpdatingKitchen}] =
    useUpdateKitchenMutation();

  const [updateKitchenImage, {isLoading: isUpdatingKitchenImage}] =
    useUpdateKitchenImageMutation();

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const snapPoints = useMemo(
    () => (keyboardVisible ? ['65%'] : ['40%']),
    [keyboardVisible],
  );

  const [registerChef, {isLoading: isRegisteringChef}] =
    useRegisterChefMutation();

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      fieldRef.current?.expand();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      fieldRef.current?.snapToIndex(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      kitchenName: kitcheProfileData?.name?.trim() || '',
      pickupLocation: kitcheProfileData?.pickup_location?.trim() || '',
      pickupTime: kitcheProfileData?.avg_pickup_time?.trim() || '',
      aboutCook: kitcheProfileData?.message?.trim() || '',
    },
    enableReinitialize: true,
    validationSchema: kitchenProfileValidation,
    onSubmit: async values => {
      Keyboard.dismiss();
      const formData = new FormData();
      formData.append('name', values.kitchenName);
      formData.append('pickup_location', values.pickupLocation);
      formData.append('avg_pickup_time', values.pickupTime);
      formData.append('message', values.aboutCook);

      if (coverImageUri) {
        formData.append('kitchen', {
          uri: coverImageUri,
          name: 'cover.jpg',
          type: 'image/jpeg',
        });
      }

      try {
        const result = await createKitchen(formData).unwrap();
        console.log('kitchen profile response', result);
        if (result?.success) {
          showSuccess('Kitchen profile created successfully');
          await registerChef().unwrap();
          goBack();
          toggleApp();
        }
      } catch (err) {
        console.error('Create Kitchen Error:', err);
        Alert.alert('Error', 'Failed to create kitchen profile');
      }
    },
  });

  // Set form values when kitchen data is available
  useEffect(() => {
    if (kitcheProfileData) {
      formik.setValues({
        kitchenName: kitcheProfileData.name || '',
        pickupLocation: kitcheProfileData.pickup_location || 'test',
        pickupTime: kitcheProfileData.avg_pickup_time || '',
        aboutCook: kitcheProfileData.message || '',
      });
    }
  }, [kitcheProfileData]);

  // Set cover image when kitchen data is available
  useEffect(() => {
    if (kitcheProfileData?.coverImage) {
      setCoverImageUri(`${imageBaseUrl}${kitcheProfileData.coverImage}`);
    }
  }, [kitcheProfileData]);

  const handleModalSave = async () => {
    Keyboard.dismiss(); // Add this line to dismiss keyboard when saving modal
    try {
      let fieldKey = '';
      if (modalTitle === 'Kitchen Name') fieldKey = 'name';
      else if (modalTitle === 'Pickup Location') fieldKey = 'pickup_location';
      else if (modalTitle === 'Avg. Pickup Time (mins)')
        fieldKey = 'avg_pickup_time';
      else if (modalTitle === 'From the Cook') fieldKey = 'message';

      const payload = {
        [fieldKey]: String(modalValue),
      };

      const result = await updateKitchen({
        id: kitcheProfileData?.id,
        data: payload,
      }).unwrap();
      if (kitcheProfileData) {
        refetchMyKitchen();
      }
      if (result?.success) {
        showSuccess(result.message || 'Kitchen updated');
        formik.setFieldValue(
          fieldKey === 'name'
            ? 'kitchenName'
            : fieldKey === 'pickup_location'
            ? 'pickupLocation'
            : fieldKey === 'avg_pickup_time'
            ? 'pickupTime'
            : 'aboutCook',
          modalValue,
        );
        fieldRef.current.close();
      } else {
        showError('Update failed');
      }
    } catch (e) {
      console.error('Kitchen update error:', e);
      showError('Update failed', e?.data?.message);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <PrimaryHeader
        title={
          kitcheProfileData
            ? 'Update your kitchen profile'
            : 'Build your kitchen profile'
        }
        icon={ICONS.closeIcon}
        onPress={() => {
          if (kitcheProfileData) {
            toggleApp();
            goBack();
          } else {
            goBack();
          }
        }}
      />

      {isFetching ? (
        <FullScreenLoader
          isVisible={isFetching}
          message="Loading kitchen profile"
        />
      ) : (
        <KeyboardAwareScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 40,
            gap: 16,
            paddingBottom: 20,
          }}
          bounces={false}
          bottomOffset={30}
          keyboardShouldPersistTaps={'handled'}>
          {/* Profile Picture Section */}
          <View style={styles.profilePicLayout}>
            <Avatar
              path={
                userProfile?.profilePic
                  ? `${imageBaseUrl}${userProfile.profilePic}`
                  : IMAGES.defaultAvatar
              }
              size={80}
            />
          </View>

          {/* Cover Image Uploader */}
          <CoverImageUploader
            coverImageUri={coverImageUri}
            setCoverImageUri={setCoverImageUri}
            kitcheProfileData={kitcheProfileData}
            updateKitchenImage={updateKitchenImage}
            isUpdatingKitchenImage={isUpdatingKitchenImage}
          />

          <View style={styles.divider} />

          {/* Form Fields */}
          {[
            {label: 'Kitchen Name', name: 'kitchenName'},
            {label: 'Pickup Location', name: 'pickupLocation'},
            {
              label: 'Avg. Pickup Time (mins)',
              name: 'pickupTime',
              keyboardType: 'decimal-pad',
            },
            {label: 'From the Cook', name: 'aboutCook', multiline: true},
          ].map((item, idx) => (
            <View key={item.name}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={[
                    styles.label,
                    {marginBottom: Platform.OS === 'ios' ? 8 : 0},
                  ]}>
                  {item.label}
                </Text>
                {kitcheProfileData && (
                  <TouchableOpacity
                    onPress={() => {
                      setModalTitle(item.label);
                      setModalValue(
                        item.label === 'Pickup Location'
                          ? formik?.values?.pickupLocation
                          : formik.values[item.name],
                      );
                      setIsMultiLine(!!item.multiline);
                      fieldRef.current.present();
                    }}>
                    <Image
                      source={ICONS.editIcon}
                      style={{width: 32, height: 32}}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {item?.label === 'Pickup Location' ? (
                <GooglePlacesAutocomplete
                  placeholder={item.label}
                  key={formik.values.pickupLocation}
                  predefinedPlaces={[]}
                  minLength={0}
                  numberOfLines={1}
                  keyboardShouldPersistTaps="always"
                  textInputProps={{
                    placeholderTextColor: !formik.values.pickupLocation
                      ? COLORS.neutral[300]
                      : COLORS.neutral[900],
                    placeholder: formik.values.pickupLocation || item.label,
                    editable: !kitcheProfileData,
                    scrollEnabled: true,
                    multiline: true,
                    // onChangeText: text =>
                    //   formik.setFieldValue(item.name, text.trimStart())
                  }}
                  styles={{
                    textInput: styles.textInput,
                  }}
                  onPress={(data, details = null) => {
                    console.log('Selected place:', data, details);
                    const address =
                      details?.formatted_address || data.description;
                    formik.setFieldValue(item.name, address);
                  }}
                  query={{
                    key: GOOGLE_MAP_API_KEY,
                    language: 'en',
                  }}
                  onFail={e => {
                    console.warn('Google Place Failed : ', e);
                  }}
                  onNotFound={() => {}}
                  onTimeout={() =>
                    console.warn('google places autocomplete: request timeout')
                  }
                  timeout={20000}
                />
              ) : (
                <TextInput
                  placeholder={item.label}
                  placeholderTextColor={COLORS.neutral[300]}
                  style={[
                    styles.value,
                    item.multiline && {
                      textAlignVertical: 'top',
                    },
                  ]}
                  selectionColor={COLORS.primary[300]}
                  value={formik.values[item.name]}
                  multiline={item.multiline}
                  keyboardType={item.keyboardType || 'default'}
                  // onChangeText={formik.handleChange(item.name)}
                  onChangeText={text =>
                    formik.setFieldValue(item.name, text.trimStart())
                  }
                  onBlur={formik.handleBlur(item.name)}
                  editable={!kitcheProfileData}
                />
              )}
              {formik.touched[item.name] && formik.errors[item.name] && (
                <Text style={{color: 'red', fontSize: 12, marginBottom: 10}}>
                  {formik.errors[item.name]}
                </Text>
              )}
              {idx !== 3 && <View style={styles.divider} />}
            </View>
          ))}

          {/* Save Button */}
          {!kitcheProfileData && (
            <View style={{marginTop: 20}}>
              <ButtonBox
                label={isLoading ? 'Saving...' : 'Save kitchen profile'}
                disabled={isLoading}
                onPress={formik.handleSubmit}
              />
            </View>
          )}
        </KeyboardAwareScrollView>
      )}

      <CustomModal
        openRef={fieldRef}
        title={modalTitle}
        snapPoints={isMultiLine ? ['90%'] : snapPoints}>
        <View style={{gap: 24}}>
          {modalTitle === 'Pickup Location' ? (
            <GooglePlacesAutocomplete
              // placeholder={`Enter ${modalTitle}`}
              placeholder={formik.values.pickupLocation}
              predefinedPlaces={[]}
              minLength={0}
              numberOfLines={1}
              keyboardShouldPersistTaps="always"
              textInputProps={{
                placeholderTextColor: COLORS.neutral[900],
                // value: modalValue,
                onChangeText: setModalValue,
                scrollEnabled: true,
                horizontal: true,
                multiline: true,
              }}
              styles={{
                textInput: styles.textInput,
              }}
              onPress={(data, details = null) => {
                console.log('Modal selected place:', data, details);
                const address = details?.formatted_address || data.description;
                setModalValue(address);
              }}
              query={{
                key: GOOGLE_MAP_API_KEY,
                language: 'en',
              }}
              onFail={e => {
                console.warn('Google Place Failed : ', e);
              }}
              onNotFound={() => {}}
              onTimeout={() =>
                console.warn('google places autocomplete: request timeout')
              }
              timeout={20000}
            />
          ) : (
            <>
              <InputField
                value={modalValue}
                placeholder={`Enter ${modalTitle}`}
                multiline={isMultiLine}
                onChangeText={setModalValue}
                maxLength={isMultiLine ? 500 : null}
                customStyle={
                  isMultiLine
                    ? {paddingVertical: 10, borderRadius: 8}
                    : undefined
                }
              />
              {isMultiLine && (
                <Text style={[styles.label, {marginTop: -15}]}>
                  {modalValue?.length || 0}/500
                </Text>
              )}
            </>
          )}

          <ButtonBox
            disabled={modalValue?.length === 0 || isUpdatingKitchen}
            label={isUpdatingKitchen ? 'Saving' : 'Save'}
            onPress={handleModalSave}
          />
        </View>
      </CustomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
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
    marginTop: Platform.OS === 'ios' ? 8 : 0,
  },
  label: {
    color: COLORS.neutral[500],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    marginBottom: 4,
  },
  value: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  profilePicLayout: {
    width: 80,
    height: 80,
    borderRadius: 80,
    borderWidth: 0.5,
    borderColor: '#C4C4C4',
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 999,
    height: 'auto',
    textAlignVertical: 'top',
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
    marginLeft: -6,
    selectionColor: COLORS.primary[300],
  },
});

export default KitchenProfileScreen;
