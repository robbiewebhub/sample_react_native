import {useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  findNodeHandle,
} from 'react-native';
import ButtonBox from '../../../components/button';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import ImageCarousel from '../../../components/imageCarousel';
import InputField from '../../../components/inputfield';
import {
  COLORS,
  FONTS,
  ICONS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../constant';
import {goBack, navigate} from '../../../utils/navigations';
import ImageCropPicker from 'react-native-image-crop-picker';
import {
  imageBaseUrl,
  useCreatePostMutation,
  useUpdatePostMutation,
} from '../../../services/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {showError, showSuccess} from '../../../utils/flashMessageUtils';

/* ---------------- helpers ---------------- */
const toRNFile = (img, i = 0) => {
  const uri = img?.path?.startsWith('file://')
    ? img.path
    : `file://${img?.path}`;
  const type = img?.mime || 'image/jpeg';
  const extFromMime = type.split('/')[1] || 'jpg';
  const extFromPath = (img?.path || '').split('.').pop();
  const ext = extFromPath?.length <= 5 ? extFromPath : extFromMime;
  const name = img?.filename || `image-${Date.now()}-${i}.${ext || 'jpg'}`;
  return {uri, name, type};
};

// Helper to convert existing image URLs to image objects
const processImage = (image, index = 0) => {
  if (typeof image === 'object' && image.path) {
    return image;
  }
  if (typeof image === 'string') {
    const baseUrl = imageBaseUrl;
    const fullUrl = image.startsWith('http') ? image : `${baseUrl}/${image}`;

    return {
      path: fullUrl,
      originalPath: image,
      mime: 'image/jpeg',
      filename: `existing-image-${index}.jpg`,
      size: 0,
      width: 300,
      height: 400,
      isExisting: true,
    };
  }
  return image;
};

/* ---------------- validation ---------------- */
const PostSchema = Yup.object().shape({
  caption: Yup.string()
    .trim()
    .required('Caption is required')
    .max(500, 'Max 500 characters'),
  images: Yup.array().of(Yup.mixed()).min(1, 'Add at least one photo'),
});

export default function ManagePost() {
  const {params} = useRoute();

  const [createPost, {isLoading: isCreatingPost}] = useCreatePostMutation();
  const [updatePost, {isLoading: isUpdatingPost}] = useUpdatePostMutation();

  const isLoading = isCreatingPost || isUpdatingPost;
  const isEdit = params?.isEdit || false;
  const postId = params?.postId;

  const [removedImages, setRemovedImages] = useState([]);
  console.log('removedImages ---->>>>', removedImages);

  const initialImages = React.useMemo(() => {
    const imageData =
      params?.images || params?.image || params?.postData?.images;

    if (!imageData) return [];

    const images = Array.isArray(imageData) ? imageData : [imageData];

    return images.map((img, index) => processImage(img, index));
  }, [params?.images, params?.image, params?.postData?.images]);

  const scrollRef = useRef(null);
  const refs = {
    images: useRef(null),
    caption: useRef(null),
  };

  const formik = useFormik({
    initialValues: {
      caption: params?.postData?.body ?? '',
      images: initialImages,
      kitchenId:
        params?.postData?.kitchenId ?? params?.kitcheProfileData?.id ?? null,
      postId: params?.postData?.id ?? null,
    },
    validationSchema: PostSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async values => {
      try {
        const fd = new FormData();
        fd.append('body', values.caption.trim());

        if (!isEdit && values.kitchenId != null) {
          fd.append('kitchenId', String(values.kitchenId));
        }

        if (isEdit) {
          const existingImages = [];

          values.images.forEach((img, i) => {
            if (img.isExisting) {
              // Use original path for existing images that should be retained
              existingImages.push(img.originalPath || img.path);
            } else {
              // New images to upload
              const file = toRNFile(img, i);
              fd.append('image', file);
            }
          });

          // Add existing images to form data (if any should be kept)
          if (existingImages.length > 0) {
            fd.append('image', JSON.stringify(existingImages));
          }

          // Add removed images to form data
          if (removedImages.length > 0) {
            fd.append('imagesRemoved', removedImages);
            // console.log('Removed images being sent:', removedImages.join(','));
          }

          console.log('FormData for update:', fd);

          const result = await updatePost({
            id: postId,
            formData: fd,
          }).unwrap();

          if (result?.success) {
            showSuccess(result?.message || 'Post updated successfully');
          }
          console.log('Update post result:', result);
        } else {
          values.images.forEach((img, i) => {
            const file = toRNFile(img, i);
            fd.append('image', file);
          });

          const result = await createPost(fd).unwrap();
          if (result?.success) {
            showSuccess(result?.message || 'Post created successfully');
          }
          console.log('Create post result:', result);
        }
        goBack();
      } catch (err) {
        console.log(isEdit ? 'updatePost failed' : 'createPost failed', err);
      }
    },
  });

  const handlePick = async () => {
    try {
      const picked = await ImageCropPicker.openPicker({
        width: 300,
        height: 400,
        cropping: false,
        multiple: true,
        mediaType: 'photo',
      });

      const newImages = Array.isArray(picked) ? picked : [picked];

      if (isEdit) {
        const currentImages = formik.values.images || [];
        formik.setFieldValue('images', [...currentImages, ...newImages]);
      } else {
        formik.setFieldValue('images', newImages);
      }

      formik.setFieldTouched('images', true, false);
    } catch (error) {
      console.log('Image picker cancelled or failed:', error);
    }
  };

  const handleImageDelete = index => {
    const imageToDelete = formik.values.images[index];

    // If it's an existing image (from edit mode), track it as removed
    if (imageToDelete && imageToDelete.isExisting && isEdit) {
      // Use the original path if available, otherwise extract from the full path
      const imagePath =
        imageToDelete.originalPath ||
        (imageToDelete.path.includes('/')
          ? imageToDelete.path.split('/').slice(-2).join('/')
          : imageToDelete.path);

      setRemovedImages(prev => {
        if (!prev.includes(imagePath)) {
          const updated = [...prev, imagePath];
          return updated;
        }
        return prev;
      });
    }

    const updatedImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue('images', updatedImages);

    // If no images left, mark field as touched to show validation error
    if (updatedImages.length === 0) {
      formik.setFieldTouched('images', true, false);
    }
  };

  // scroll to first error if any, else submit
  const scrollToFirstError = async () => {
    const errors = await formik.validateForm();
    if (!errors || Object.keys(errors).length === 0) {
      formik.handleSubmit();
      return;
    }

    formik.setTouched(
      Object.keys(formik.values).reduce((acc, k) => ({...acc, [k]: true}), {}),
    );

    const order = ['images', 'caption'];
    for (const key of order) {
      if (errors[key] && refs[key]?.current) {
        const handle = findNodeHandle(refs[key].current);
        if (handle && scrollRef.current?.scrollToFocusedInput) {
          scrollRef.current.scrollToFocusedInput(handle);
        }
        break;
      }
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <PrimaryHeader
        icon={isEdit ? ICONS.closeIcon : ICONS.leftArrowIcon}
        title={isEdit ? 'Edit Post' : 'New Post'}
      />

      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{flex: 1, zIndex: 100}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}
        bounces={false}
        bottomOffset={30}
        keyboardShouldPersistTaps="handled">
        {!formik.values.images || formik.values.images.length === 0 ? (
          <TouchableOpacity
            ref={refs.images}
            onPress={handlePick}
            style={styles.coverImgContainer}>
            <Image
              source={ICONS.cameraIcon}
              style={styles.img}
              resizeMode="contain"
              tintColor={COLORS.neutral[200]}
            />
            <Text style={styles.addPhotoText}>Add photos</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <ImageCarousel
              images={formik.values.images}
              onDelete={handleImageDelete}
              onAddMore={handlePick}
              showAddMore={true}
            />
          </View>
        )}

        {formik.touched.images && formik.errors.images ? (
          <Text style={[styles.errorText, {paddingHorizontal: 16}]}>
            {formik.errors.images}
          </Text>
        ) : null}

        {/* Caption */}
        <View style={styles.textInputStyle}>
          <InputField
            ref={refs.caption}
            placeholder="Add a caption..."
            value={formik.values.caption}
            onChangeText={t => formik.setFieldValue('caption', t)}
            onBlur={() => formik.setFieldTouched('caption', true)}
            multiline
            customStyle={{
              paddingVertical: 16,
              borderRadius: 8,
              height: 300,
            }}
            maxLength={500}
            textAlignVertical="top"
          />
          {formik.touched.caption && formik.errors.caption ? (
            <Text style={styles.errorText}>{formik.errors.caption}</Text>
          ) : null}

          {/* Character count */}
          <Text style={styles.characterCount}>
            {formik.values.caption.length}/500
          </Text>
        </View>

        {/* Button inside scroll so it moves with keyboard */}
        <ButtonBox
          label={isEdit ? 'Update Post' : 'Create Post'}
          disabled={isLoading}
          onPress={scrollToFirstError}
          customStyle={{margin: 16}}
          isLoading={isLoading}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  coverImgContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.36,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  img: {
    width: 40,
    height: 40,
  },
  textInputStyle: {
    padding: 16,
  },
  addPhotoText: {
    fontFamily: FONTS.poppins[400],
    fontSize: 12,
    color: COLORS.neutral[400],
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    fontFamily: FONTS.poppins[400],
    marginTop: 2,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: COLORS.neutral[400],
    fontFamily: FONTS.poppins[400],
    marginTop: 4,
  },
});
