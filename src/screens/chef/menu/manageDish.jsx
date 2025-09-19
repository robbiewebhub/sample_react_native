import { useRoute } from '@react-navigation/native';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageCropPicker from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import * as Yup from 'yup';
import FormDropDown from '../../../components/bottomSheet/FormDropDown';
import ButtonBox from '../../../components/button';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import InputField from '../../../components/inputfield';
import SwitchBox from '../../../components/switchbox';
import TimeSelection from '../../../components/timeSelection';
import { COLORS, FONTS, ICONS } from '../../../constant';
import {
  imageBaseUrl,
  useCreateMenuMutation,
  useGetMyKitchenQuery,
  useUpdateMenuDataMutation
} from '../../../services/api';
import { showSuccess } from '../../../utils/flashMessageUtils';
import { goBack } from '../../../utils/navigations';

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Dish name is required')
    .min(2, 'Dish name must be at least 2 characters'),
  ingredient: Yup.string(),
  short_description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  cuisine_type: Yup.string().required('Cuisine type is required'),
  price: Yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .typeError('Price must be a valid number'),
  portion_size: Yup.string().required('Portion size is required'),
  prep_time: Yup.string().required('Prep time is required'),
  start_time: Yup.string().when('is_menu_enabled', {
    is: true,
    then: schema =>
      schema.required('Start time is required when menu is enabled'),
    otherwise: schema => schema.nullable(),
  }),
  end_time: Yup.string().when('is_menu_enabled', {
    is: true,
    then: schema =>
      schema.required('End time is required when menu is enabled'),
    otherwise: schema => schema.nullable(),
  }),
});

const dishType = [
  {label: 'Vegan', action: null},
  {label: 'Vegetarian', action: null},
  {label: 'Carnivore', action: null},
  {label: 'Pescatarian', action: null},
  {label: 'Gluten-Free', action: null},
  {label: 'Dairy-Free', action: null},
  {label: 'Other', action: null},
];

const cuisineType = [
  {label: 'Indian', action: null},
  {label: 'American', action: null},
  {label: 'Chinese', action: null},
  {label: 'Thai', action: null},
];

const allergensList = [
  {label: 'Gluten', action: null},
  {label: 'Peanuts', action: null},
  {label: 'Tree Nuts', action: null},
  {label: 'Dairy', action: null},
  {label: 'Eggs', action: null},
  {label: 'Shellfish', action: null},
  {label: 'Soy', action: null},
  {label: 'Sesame', action: null},
];

export default function ManageDishScreen() {
  const {
    params: {isEdit, menuItem},
  } = useRoute();
  const [uploadedImg, setUploadedImg] = useState(dishData?.image || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [createMenu, {isLoading: isCreatingMenu}] = useCreateMenuMutation();
  const {data: getMyKitchen, refetch: refetchMyKitchen} =
    useGetMyKitchenQuery();
  // const [updateMenu, {isLoading: isUpdatingMenu}] = useUpdateMenuMutation();
  // const [updateMenuImages, {isLoading: isUpdatingMenuImages, error}] =
  //   useUpdateMenuImagesMutation();

  const [updateMenuData, {isLoading: isUpdatingMenuData}] =
    useUpdateMenuDataMutation();

  let kitcheProfileData = getMyKitchen?.data;

  const dishData = {
    name: menuItem?.name,
    ingredient: menuItem?.ingredient,
    short_description: menuItem?.short_description,
    cuisine_type: menuItem?.cuisine_type,
    price: menuItem?.price,
    portion_size: menuItem?.portion_size,
    prep_time: menuItem?.prep_time?.toString(),
    diet_type: menuItem?.diet_type,
    allergens: menuItem?.allergens,
    image: menuItem?.image,
    is_menu_enabled: menuItem?.is_menu_enabled,
    start_time: menuItem?.start_time,
    end_time: menuItem?.end_time,
  };

  useEffect(() => {
    if (isEdit && dishData?.image) {
      setUploadedImg(dishData.image);
    }
  }, [isEdit]);

  const initialValues = {
    name: dishData?.name || '',
    ingredient: dishData?.ingredient || '',
    short_description: dishData?.short_description || '',
    cuisine_type: dishData?.cuisine_type || '',
    price: dishData?.price ? dishData.price.toString() : '',
    portion_size: dishData?.portion_size || '',
    prep_time: dishData?.prep_time || '',
    image: dishData?.image || [],
    diet_type: dishData?.diet_type
      ? dishData.diet_type.map(
          type =>
            dishType.find(dt => dt.label === type) || {
              label: type,
              action: null,
            },
        )
      : [],
    allergens: dishData?.allergens
      ? dishData.allergens.map(
          allergen =>
            allergensList.find(al => al.label === allergen) || {
              label: allergen,
              action: null,
            },
        )
      : [],

    is_menu_enabled: dishData?.is_menu_enabled || false,
    start_time: dishData?.start_time || '',
    end_time: dishData?.end_time || '',
  };

  const separateImages = (uploadedImages, imageBaseUrl) => {
    const newImages = [];
    const existingImages = [];

    uploadedImages.forEach(img => {
      if (typeof img === 'string') {
        // Backend-sent string path
        existingImages.push({uri: `${imageBaseUrl}${img}`});
      } else if (img.uri?.startsWith('http')) {
        // Already a remote full URL
        existingImages.push(img);
      } else if (img.path || img.uri?.startsWith('file://') || img.sourceURL) {
        // Local file selected from device
        newImages.push(img);
      }
    });

    return {newImages, existingImages};
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      console.log('values ---->>', values);
      if (!uploadedImg?.length) {
        Alert.alert('Error', 'Please add at least one image');
        return;
      }
      if (uploadedImg?.length > 5) {
        Alert.alert('Error', 'You can only upload up to 5 images');
        return;
      }

      try {
        let result;

        if (isEdit) {
          const formData = new FormData();

          formData.append('name', values.name);
          formData.append('short_description', values.short_description);
          formData.append('cuisine_type', values.cuisine_type);
          formData.append('price', Number(values.price));
          formData.append('portion_size', values.portion_size.toString());
          formData.append('prep_time', values.prep_time.toString());
          formData.append('is_menu_enabled', values?.is_menu_enabled);
          formData.append('start_time', values?.start_time);
          formData.append('end_time', values?.end_time);

          formData.append(
            'kitchenId',
            `${kitcheProfileData?.id || values.kitchenId}`,
          );

          if (values.ingredient) {
            formData.append('ingredient', values.ingredient);
          }

          (removedImages || []).forEach(imgPath => {
            formData.append('imagesRemoved', imgPath);
          });

          (values.diet_type || []).forEach((item, index) => {
            formData.append(`diet_type[${index}]`, item?.label || item);
          });

          (values.allergens || []).forEach(item => {
            formData.append('allergens', item.label || item);
          });

          const {existingImages, newImages} = separateImages(
            uploadedImg,
            imageBaseUrl,
          );
          console.log(existingImages, newImages);

          // existingImages.forEach((img, index) => {
          //   formData.append('image', {
          //     uri: img.uri,
          //     name: `existing_image_${index}.jpg`,
          //     type: img.type || 'image/jpeg',
          //   });
          // });

          newImages.forEach((img, index) => {
            formData.append('image', {
              uri: img.path || img.uri || img.sourceURL,
              name: `image_${index}.jpg`,
              type: img.mime || img.type || 'image/jpeg',
            });
          });

          try {
            // console.log('formData --->>>', formData);
            const result = await updateMenuData({
              id: menuItem?.id,
              formData,
            }).unwrap();

            console.log('Menu update result:', result);

            if (result?.success) {
              showSuccess(result?.message || `Dish updated successfully!`);
              goBack();
              goBack();
              // navigate('SecondBottomTab', {screen: 'MenuStack'});
            }
          } catch (menuError) {
            console.error('Menu update failed:', menuError);
            throw new Error(
              'Images updated but menu details failed to update.',
            );
          }
        } else {
          // --------- CREATE NEW DISH ---------
          const formData = new FormData();
          formData.append('kitchenId', kitcheProfileData?.id);
          formData.append('name', values?.name);
          formData.append('short_description', values?.short_description);
          formData.append('cuisine_type', values?.cuisine_type);
          formData.append('price', values?.price);
          formData.append('portion_size', values?.portion_size);
          formData.append('prep_time', values?.prep_time);
          formData.append('is_menu_enabled', values?.is_menu_enabled);
          formData.append('start_time', values?.start_time);
          formData.append('end_time', values?.end_time);

          if (values.ingredient) {
            formData.append('ingredient', values?.ingredient);
          }

          (values.diet_type || []).forEach((item, index) => {
            formData.append(`diet_type[${index}]`, item?.label);
          });

          (values.allergens || []).forEach((item, index) => {
            formData.append(`allergens[${index}]`, item?.label);
          });

          uploadedImg.forEach((img, index) => {
            formData.append('image', {
              uri: img.path || img.uri || img.sourceURL,
              name: `image_${index}.jpg`,
              type: img.mime || img.type || 'image/jpeg',
            });
          });
          console.log('formData ----->>>', formData);

          try {
            result = await createMenu(formData).unwrap();
            console.log('Create menu result:', result);

            // Success handling
            if (result?.success) {
              showSuccess(result?.message || `Dish created successfully!`);
              goBack();
              formik.resetForm();
              setUploadedImg([]);
            } else {
              throw new Error(
                result?.message ||
                  `Failed to ${isEdit ? 'update' : 'create'} dish`,
              );
            }
          } catch (createError) {
            console.error('Create menu failed:', createError);
            throw new Error('Failed to create dish. Please try again.');
          }
        }
      } catch (error) {
        console.error('Form submission error:', error);

        let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} dish.`;
        if (error?.data?.message) errorMessage = error.data.message;
        else if (error?.message) errorMessage = error.message;
        console.log('errorMessage ---???', errorMessage);

        Alert.alert('Error', errorMessage);
      }
    },
  });

  const handleImagePicker = () => {
    ImageCropPicker.openPicker({
      cropping: false,
      multiple: true,
      mediaType: 'photo',
      maxFiles: 5,
    })
      .then(images => {
        console.log('Selected images:', images);
        setUploadedImg(prev => [...prev, ...images]);
      })
      .catch(error => {
        console.error('Image picker error:', error);
        if (error.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to pick images');
        }
      });
  };

  const removeImage = index => {
    setUploadedImg(prev => {
      const removed = prev[index];
      if (typeof removed === 'string') {
        setRemovedImages(prevRemoved => [...prevRemoved, removed]);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  return (
    <View style={{flex: 1}}>
      <PrimaryHeader
        icon={ICONS.closeIcon}
        title={isEdit ? 'Edit Dish' : 'Add a Dish'}
      />

      <KeyboardAwareScrollView
        style={{flex: 1, zIndex: 100}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 16, paddingHorizontal: 16}}
        bounces={false}
        bottomOffset={30}
        keyboardShouldPersistTaps={'handled'}>
        {/* Image Upload Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 16}}
          style={{flex: 1}}>
          <TouchableOpacity
            style={styles.addImages}
            onPress={handleImagePicker}>
            <Image
              source={ICONS.cameraIcon}
              tintColor={COLORS.neutral[400]}
              style={{width: 24, height: 24}}
            />
            <Text style={styles.addImagesTxt}>Add photos</Text>
          </TouchableOpacity>
          {uploadedImg?.map((item, idx) => {
            let imageUri;
            if (typeof item === 'string') {
              imageUri = `${imageBaseUrl}${item}`;
            } else {
              imageUri = item.sourceURL || item.path || item.uri;
            }

            return (
              <View key={idx} style={{position: 'relative'}}>
                {/* <Image
                  source={{uri: imageUri}}
                  style={{width: 100, height: 100, borderRadius: 8}}
                  onError={error => {
                    console.log('Image load error:', error.nativeEvent.error);
                    console.log('Failed URI:', imageUri);
                  }}
                /> */}
                <FastImage
                  source={{
                    uri: imageUri,
                    priority: FastImage.priority.high,
                  }}
                  style={{width: 100, height: 100, borderRadius: 8}}
                />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(idx)}>
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* Dish Name */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Dish Name</Text>
          <InputField
            placeholder="Grandma's Mapo Tofu"
            value={formik.values.name}
            onChangeText={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
          />
          {formik.touched.name && formik.errors.name && (
            <Text style={styles.errorText}>{formik.errors.name}</Text>
          )}
        </View>

        {/* Ingredients */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Ingredients (optional)</Text>
          <InputField
            placeholder="Rice, eggs, peas, carrots, soy sauce, green onions, sesame oil, garlic"
            value={formik.values.ingredient}
            onChangeText={formik.handleChange('ingredient')}
            onBlur={formik.handleBlur('ingredient')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            customStyle={{height: 80, borderRadius: 8}}
          />
        </View>

        {/* Description */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Short Description</Text>
          <InputField
            placeholder="What makes it special?"
            value={formik.values.short_description}
            onChangeText={formik.handleChange('short_description')}
            onBlur={formik.handleBlur('short_description')}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            customStyle={{height: 80, borderRadius: 8}}
          />
          {formik.touched.short_description &&
            formik.errors.short_description && (
              <Text style={styles.errorText}>
                {formik.errors.short_description}
              </Text>
            )}
        </View>

        {/* Diet Type */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Diet Type (optional)</Text>
          <FormDropDown
            placeholder="Select"
            actionList={dishType}
            selectedItem={formik.values.diet_type}
            setItem={value => formik.setFieldValue('diet_type', value)}
            multiSelect
          />
        </View>

        {/* Cuisine Type */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Cuisine Type</Text>
          <FormDropDown
            placeholder="Select"
            actionList={cuisineType}
            selectedItem={cuisineType.find(
              item => item.label === formik.values.cuisine_type,
            )}
            setItem={value => formik.setFieldValue('cuisine_type', value.label)}
          />
          {formik.touched.cuisine_type && formik.errors.cuisine_type && (
            <Text style={styles.errorText}>{formik.errors.cuisine_type}</Text>
          )}
        </View>

        {/* Price */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Price</Text>
          <InputField
            placeholder="12.00"
            value={formik.values.price}
            onChangeText={formik.handleChange('price')}
            onBlur={formik.handleBlur('price')}
            keyboardType="decimal-pad"
          />
          {formik.touched.price && formik.errors.price && (
            <Text style={styles.errorText}>{formik.errors.price}</Text>
          )}
        </View>

        {/* Portion Size */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Portion Size</Text>
          <InputField
            placeholder="Serves 1-2 or 4 rolls per order"
            value={formik.values.portion_size}
            onChangeText={formik.handleChange('portion_size')}
            onBlur={formik.handleBlur('portion_size')}
            keyboardType="decimal-pad"
          />
          {formik.touched.portion_size && formik.errors.portion_size && (
            <Text style={styles.errorText}>{formik.errors.portion_size}</Text>
          )}
        </View>

        {/* Prep Time */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Prep Time (mins)</Text>
          <InputField
            placeholder="5-10 mins"
            value={formik.values.prep_time}
            onChangeText={formik.handleChange('prep_time')}
            onBlur={formik.handleBlur('prep_time')}
            keyboardType="decimal-pad"
          />
          {formik.touched.prep_time && formik.errors.prep_time && (
            <Text style={styles.errorText}>{formik.errors.prep_time}</Text>
          )}
        </View>

        {/* Allergens */}
        <View style={{gap: 4}}>
          <Text style={styles.label}>Allergens (optional)</Text>
          <FormDropDown
            placeholder="Select"
            actionList={allergensList}
            selectedItem={formik.values.allergens}
            setItem={value => formik.setFieldValue('allergens', value)}
            multiSelect
          />
        </View>

        {/* Menu Toggle */}
        <View style={{gap: 8, flexDirection: 'row', alignItems: 'center'}}>
          <SwitchBox
            isIcon
            status={formik.values.is_menu_enabled}
            onToggle={() =>
              formik.setFieldValue(
                'is_menu_enabled',
                !formik.values.is_menu_enabled,
              )
            }
          />
          <Text style={styles.label}>
            {formik.values?.is_menu_enabled
              ? 'Show on Menu - Available to order today'
              : 'Hidden - Not available today'}
          </Text>
        </View>

        {/* Time Selection - Only shown when menu is enabled */}
        {formik.values.is_menu_enabled && (
          <>
            <View style={{gap: 4}}>
              <Text style={styles.label}>Start time</Text>

              <TimeSelection
                timeString={
                  formik.values.start_time ||
                  new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                }
                label="From now"
                onTimeChange={date => {
                  const timeString = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                  console.log('Selected Start Time:', timeString);
                  formik.setFieldValue('start_time', timeString);
                }}
              />

              {formik.touched.start_time && formik.errors.start_time && (
                <Text style={styles.errorText}>{formik.errors.start_time}</Text>
              )}
            </View>

            <View style={{gap: 4}}>
              <Text style={styles.label}>End time</Text>

              <TimeSelection
                timeString={
                  formik.values?.end_time ||
                  new Date().toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })
                }
                label="Until close"
                onTimeChange={date => {
                  const timeString = date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                  formik.setFieldValue('end_time', timeString);
                }}
              />

              {formik.touched.end_time && formik.errors.end_time && (
                <Text style={styles.errorText}>{formik.errors.end_time}</Text>
              )}
            </View>
          </>
        )}

        {/* Submit Button */}
        <ButtonBox
          disabled={isCreatingMenu || isUpdatingMenuData}
          label={isEdit ? 'Save Changes' : 'Save and Add'}
          onPress={formik.handleSubmit}
          customStyle={{marginTop: 16, marginBottom: 20}}
          isLoading={isCreatingMenu || isUpdatingMenuData}
        />
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.neutral[500],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  addImages: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.neutral[200],
    backgroundColor: COLORS.neutral[75],
    justifyContent: 'center',
    width: Dimensions.get('screen').width / 2.2,
    height: 100,
    gap: 4,
    flex: 1,
  },
  addImagesTxt: {
    color: COLORS.neutral[400],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    fontFamily: FONTS.poppins[400],
    marginTop: 2,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.error || '#FF0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
