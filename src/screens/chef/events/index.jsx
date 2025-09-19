import {useRoute} from '@react-navigation/native';
import React, {useRef, useState, useMemo} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  findNodeHandle,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import ButtonBox from '../../../components/button';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import InputField from '../../../components/inputfield';
import {
  COLORS,
  FONTS,
  GOOGLE_MAP_API_KEY,
  ICONS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../constant';
import {navigate, goBack} from '../../../utils/navigations';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import PaymentOptions from '../../../components/paymentOptions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  imageBaseUrl,
  useCreateEventMutation,
  useUpdateEventMutation,
} from '../../../services/api';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showSuccess} from '../../../utils/flashMessageUtils';
import FastImage from 'react-native-fast-image';

/* ---------------- data ---------------- */
const paymentOptions = [
  {label: 'Paypal', icon: ICONS.paypalIcon, iconSize: {width: 15, height: 18}},
  {label: 'Venmo', icon: ICONS.venmoIcon, iconSize: {width: 24, height: 24}},
  {label: 'Zelle', icon: ICONS.zelleIcon, iconSize: {width: 24, height: 24}},
];

/* ---------------- helpers ---------------- */
const combineDateTimeISO = (date, time) => {
  const d = new Date(date);
  const t = new Date(time);
  const combo = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    t.getHours(),
    t.getMinutes(),
    0,
    0,
  );
  return combo.toISOString();
};

const toRNFile = img => {
  if (!img) return null;
  const uri = img?.path?.startsWith('file://')
    ? img.path
    : `file://${img?.path}`;
  const type = img?.mime || 'image/jpeg';
  const ext = (img?.path || '').split('.').pop() || 'jpg';
  const name = img?.filename || `event-cover-${Date.now()}.${ext}`;
  return {uri, type, name};
};

// Helper to process cover image for both create and edit modes
const processCoverImage = imageData => {
  if (!imageData) return null;

  // If it's a string (existing image path from server)
  if (typeof imageData === 'string') {
    return {
      isExisting: true,
      path: `${imageBaseUrl}/${imageData}`,
      originalPath: imageData,
    };
  }

  // If it's an image object from picker
  if (typeof imageData === 'object') {
    return imageData;
  }

  return null;
};

/* ---------------- stateless time input ---------------- */
const PickTimeInput = ({
  label = 'Date/Time',
  type = 'date',
  rightIcon,
  value,
  onChange,
  error,
  touched,
  inputRef,
  ...props
}) => {
  const [isPickerVisible, setPickerVisible] = React.useState(false);
  const asDate = value instanceof Date ? value : new Date(value || Date.now());

  const display = React.useMemo(() => {
    if (type === 'date') {
      return moment(asDate).isSame(moment(), 'day')
        ? `Today, ${moment(asDate).format('MMM D, YYYY')}`
        : moment(asDate).format('ddd, MMM D, YYYY');
    }
    if (type === 'time') return moment(asDate).format('hh:mm A');
    if (type === 'datetime')
      return moment(asDate).format('ddd, MMM D, YYYY hh:mm A');
    return '';
  }, [type, asDate]);

  const handleConfirm = date => {
    setPickerVisible(false);
    onChange?.(date);
  };

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        ref={inputRef}
        onPress={() => setPickerVisible(true)}
        style={styles.inputFieldStyle}>
        <Text
          style={[
            styles.inputTextStyle,
            touched && error ? {color: COLORS.error[600]} : null,
          ]}>
          {display}
        </Text>
        {rightIcon && (
          <View style={styles.iconStyle}>
            <Image
              source={rightIcon}
              style={styles.img}
              resizeMode="contain"
              tintColor={COLORS.neutral[400]}
            />
          </View>
        )}
      </TouchableOpacity>
      {touched && error ? <Text style={styles.errorText}>{error}</Text> : null}

      <DateTimePickerModal
        {...props}
        isVisible={isPickerVisible}
        mode={type}
        date={asDate}
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
        headerTextIOS={`Pick a ${type}`}
        is24Hour={false}
      />
    </>
  );
};

const InputWithOption = ({
  placeholder,
  checkboxLabel,
  value,
  checked,
  onChangeValue,
  onChangeChecked,
  inputStyle,
  containerStyle,
  optionRowStyle,
  smallTextStyle,
  rightIcon,
  error,
  touched,
  inputRef,
}) => {
  return (
    <View style={containerStyle}>
      <InputField
        ref={inputRef}
        placeholder={placeholder}
        value={String(value ?? '')}
        onChangeText={txt => onChangeValue?.(txt)}
        editable={!checked}
        rightIcon={rightIcon}
        customStyle={[
          inputStyle,
          checked && {
            backgroundColor: COLORS.neutral[100],
            color: COLORS.neutral[400],
          },
          touched && error
            ? {borderColor: COLORS.error[500], borderWidth: 1}
            : null,
        ]}
        placeholderTextColor={COLORS.neutral[300]}
        keyboardType="numeric"
      />
      {touched && error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={optionRowStyle}
        onPress={() => onChangeChecked?.(!checked)}
        activeOpacity={0.8}>
        <Image
          source={checked ? ICONS.checkboxIcon : ICONS.checkboxSelectedIcon}
          style={{width: 24, height: 24, opacity: checked ? 0.5 : 1}}
        />
        <Text style={smallTextStyle}>{checkboxLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ---------------- validation ---------------- */
const EventSchema = Yup.object().shape({
  name: Yup.string().trim().required('Event name is required'),
  description: Yup.string().trim().max(500, 'Max 500 characters'),
  eventDate: Yup.date().required('Date is required'),
  fromTime: Yup.date().required('Start time is required'),
  toTime: Yup.date()
    .required('End time is required')
    .test('after-start', 'End time must be after start', function (value) {
      const {eventDate, fromTime} = this.parent;
      if (!eventDate || !fromTime || !value) return true;
      const start = new Date(
        new Date(eventDate).getFullYear(),
        new Date(eventDate).getMonth(),
        new Date(eventDate).getDate(),
        new Date(fromTime).getHours(),
        new Date(fromTime).getMinutes(),
      ).getTime();
      const end = new Date(
        new Date(eventDate).getFullYear(),
        new Date(eventDate).getMonth(),
        new Date(eventDate).getDate(),
        new Date(value).getHours(),
        new Date(value).getMinutes(),
      ).getTime();
      return end > start;
    }),
  noLimit: Yup.boolean(),
  maxGuests: Yup.string().when('noLimit', {
    is: false,
    then: s =>
      s
        .required('Guest count required')
        .matches(/^\d+$/, 'Enter a valid number')
        .test('min-1', 'Must be at least 1', v => parseInt(v || '0', 10) >= 1),
  }),
  isFree: Yup.boolean(),
  pricePerPerson: Yup.string().when('isFree', {
    is: false,
    then: s =>
      s
        .required('Amount required')
        .matches(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount'),
  }),
  payout_method: Yup.string().required('Please select a payout method'),
  location: Yup.string().trim().required('Location is required'),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
  image: Yup.mixed().required('Cover image is required'),
});

/* ===================== component ===================== */
export default function ManageEvent() {
  const {params} = useRoute();

  const [createEvent, {isLoading: isCreatingEvent}] = useCreateEventMutation();
  const [updateEvent, {isLoading: isUpdatingEvent}] = useUpdateEventMutation();
  const [coverImage, setCoverImage] = useState(null);

  const isLoading = isCreatingEvent || isUpdatingEvent;
  const isEdit = params?.isEdit || false;
  const eventId = params?.eventId;
  const eventData = params?.eventData;

  const initialValues = useMemo(() => {
    if (isEdit && eventData) {
      const startDate = new Date(eventData.start_at);
      const endDate = new Date(eventData.end_at);

      return {
        name: eventData.name || '',
        description: eventData.description || '',
        eventDate: startDate,
        fromTime: startDate,
        toTime: endDate,
        maxGuests: eventData.max_guests ? String(eventData.max_guests) : '6',
        noLimit: eventData.no_limit || false,
        pricePerPerson: eventData.price ? String(eventData.price) : '0',
        isFree: eventData.is_free || false,
        payout_method: eventData.payout_method || '',
        location: eventData.location || '',
        latitude: eventData.latitude ? parseFloat(eventData.latitude) : null,
        longitude: eventData.longitude ? parseFloat(eventData.longitude) : null,
        image: processCoverImage(eventData.cover),
        kitchenId: eventData.kitchenId || params?.kitcheProfileData?.id || null,
        eventId: eventData.id || null,
      };
    }

    // Default values for create mode
    const currentTime = new Date();
    const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000);

    return {
      name: '',
      description: '',
      eventDate: new Date(),
      fromTime: currentTime,
      toTime: oneHourLater,
      maxGuests: '6',
      noLimit: false,
      pricePerPerson: '0',
      isFree: false,
      payout_method: '',
      location: '',
      latitude: null,
      longitude: null,
      image: params?.image ? processCoverImage(params.image) : null,
      kitchenId: params?.kitcheProfileData?.id ?? null,
      eventId: null,
    };
  }, [isEdit, eventData, params]);

  // Initialize cover image state
  React.useEffect(() => {
    if (initialValues.image) {
      setCoverImage(initialValues.image);
    }
  }, []);

  // refs for scrolling to first error
  const scrollRef = useRef(null);
  const refs = {
    name: useRef(null),
    eventDate: useRef(null),
    fromTime: useRef(null),
    toTime: useRef(null),
    maxGuests: useRef(null),
    pricePerPerson: useRef(null),
    location: useRef(null),
    description: useRef(null),
    image: useRef(null),
  };

  // Draft ref for GooglePlacesAutocomplete to avoid controlled-loop
  const locationDraftRef = useRef(initialValues.location);

  const formik = useFormik({
    initialValues,
    validationSchema: EventSchema,
    enableReinitialize: true,
    onSubmit: async values => {
      // Validate cover image separately since it's not in formik
      if (!coverImage) {
        Alert.alert('Error', 'Please select a cover image');
        return;
      }

      try {
        const startAtISO = combineDateTimeISO(
          values.eventDate,
          values.fromTime,
        );
        const endAtISO = combineDateTimeISO(values.eventDate, values.toTime);

        const guests = values.noLimit
          ? null
          : parseInt(values.maxGuests || '0', 10);
        const price = values.isFree
          ? 0
          : parseFloat(values.pricePerPerson || '0');

        const fd = new FormData();
        fd.append('name', values.name.trim());
        if (values.kitchenId != null)
          fd.append('kitchenId', String(values.kitchenId));
        fd.append('description', values.description.trim());
        fd.append('start_at', startAtISO);
        fd.append('end_at', endAtISO);
        fd.append('payout_method', values.payout_method);
        fd.append('location', values.location);
        if (values.latitude != null && values.longitude != null) {
          fd.append('latitude', String(values.latitude));
          fd.append('longitude', String(values.longitude));
        }
        fd.append('no_limit', values.noLimit ? 'true' : 'false');
        if (!values.noLimit) fd.append('max_guests', String(guests));
        fd.append('is_free', values.isFree ? 'true' : 'false');
        if (!values.isFree) fd.append('price', String(price));

        // Handle cover image
        if (coverImage && !coverImage.isExisting) {
          // New image - convert to file and append
          const file = toRNFile(coverImage);
          if (file) fd.append('image', file);
        }
        // If it's existing image, don't append anything - server keeps the existing one

        let result;
        if (isEdit) {
          console.log('Updating event with ID:', values.eventId);
          result = await updateEvent({
            id: eventId,
            formData: fd,
          }).unwrap();
        } else {
          result = await createEvent(fd).unwrap();
        }

        if (result?.success) {
          showSuccess(
            result?.message ||
              `Event ${isEdit ? 'updated' : 'created'} successfully`,
          );
          goBack();
        }

        console.log(`${isEdit ? 'Update' : 'Create'} event result:`, result);
      } catch (e) {
        console.warn(`${isEdit ? 'updateEvent' : 'createEvent'} failed`, e);
        Alert.alert(
          'Error',
          `Failed to ${isEdit ? 'update' : 'create'} event. Please try again.`,
        );
      }
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  // scroll to first error on submit attempt
  const scrollToFirstError = async () => {
    const errors = await formik.validateForm();

    // Check cover image error
    let hasCoverError = false;
    if (!coverImage) {
      hasCoverError = true;
    }

    if ((!errors || Object.keys(errors).length === 0) && !hasCoverError) {
      formik.handleSubmit();
      return;
    }

    // mark all as touched once
    formik.setTouched(
      Object.keys(formik.values).reduce((acc, k) => ({...acc, [k]: true}), {}),
    );

    // known order of fields to focus/scroll
    const order = [
      'name',
      'eventDate',
      'fromTime',
      'toTime',
      'maxGuests',
      'pricePerPerson',
      'location',
      'description',
      'image',
    ];
    for (const key of order) {
      if (
        (key === 'image' && hasCoverError) ||
        (errors[key] && refs[key]?.current)
      ) {
        const handle = findNodeHandle(refs[key].current);
        if (handle && scrollRef.current?.scrollToFocusedInput) {
          scrollRef.current.scrollToFocusedInput(handle);
        }
        break;
      }
    }
  };

  const handlePickCover = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: false,
        mediaType: 'photo',
      });
      setCoverImage(image);
      formik.setFieldValue('image', image, true);
      formik.setFieldTouched('image', true, false);
    } catch (error) {
      console.log('Image picker cancelled:', error);
    }
  };

  // Get display URI for cover image
  const getCoverImageUri = () => {
    if (!coverImage) return null;

    if (coverImage.isExisting) {
      return coverImage.path; // Already includes base URL
    }

    // New image from picker
    return Platform.OS === 'android'
      ? coverImage.path
      : coverImage?.sourceURL || coverImage.path;
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <PrimaryHeader
        icon={isEdit ? ICONS.closeIcon : ICONS.leftArrowIcon}
        title={isEdit ? 'Edit Event' : 'New Event'}
      />

      <KeyboardAwareScrollView
        ref={scrollRef}
        style={{flex: 1, zIndex: 100}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 16}}
        bounces={false}
        bottomOffset={30}
        keyboardShouldPersistTaps="handled">
        {/* Cover */}
        <View style={styles.coverImgContainer}>
          {coverImage ? (
            // <Image
            //   source={{uri: getCoverImageUri()}}
            //   style={styles.img}
            //   resizeMode="cover"
            // />
            <FastImage
              source={{
                uri: getCoverImageUri(),
                priority: FastImage.priority.high,
              }}
              style={styles.img}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <View
              style={[
                styles.img,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <Text style={{color: COLORS.neutral[400]}}>Select a cover</Text>
            </View>
          )}
          <TouchableOpacity
            hitSlop={20}
            onPress={handlePickCover}
            style={styles.reloadImgContainer}>
            <Image source={ICONS.reloadIcon} style={{width: 24, height: 24}} />
          </TouchableOpacity>
        </View>

        {/* Show validation error if no cover image */}
        {!coverImage && (
          <Text style={[styles.errorText, {marginHorizontal: 16}]}>
            Cover image is required
          </Text>
        )}
        {/* Form */}
        <View style={styles.formWrapper}>
          {/* Event Name */}
          <View style={{gap: 4}}>
            <Text style={styles.label}>Event Name</Text>
            <InputField
              ref={refs.name}
              placeholder="Event Name"
              value={formik.values.name}
              onChangeText={e => formik.setFieldValue('name', e, true)}
              onBlur={() => formik.setFieldTouched('name', true)}
            />
            {formik.touched.name && formik.errors.name ? (
              <Text style={styles.errorText}>{formik.errors.name}</Text>
            ) : null}
          </View>

          {/* Date + Time */}
          <View style={{gap: 4}}>
            <PickTimeInput
              inputRef={refs.eventDate}
              label="Date"
              type="date"
              rightIcon={ICONS.calendarIcon}
              value={formik.values.eventDate}
              onChange={d => formik.setFieldValue('eventDate', d, true)}
              error={formik.errors.eventDate}
              touched={formik.touched.eventDate}
            />
          </View>

          <View style={styles.flexRow}>
            <View style={{gap: 4, flex: 1}}>
              <PickTimeInput
                inputRef={refs.fromTime}
                label="From"
                type="time"
                rightIcon={ICONS.clockIcon}
                value={formik.values.fromTime}
                onChange={d => formik.setFieldValue('fromTime', d, true)}
                error={formik.errors.fromTime}
                touched={formik.touched.fromTime}
              />
            </View>
            <View style={{gap: 4, flex: 1}}>
              <PickTimeInput
                inputRef={refs.toTime}
                label="To"
                type="time"
                rightIcon={ICONS.clockIcon}
                value={formik.values.toTime}
                // onChange={d => formik.setFieldValue('toTime', d, true)}
                onChange={d => {
                  console.log('d -->>', d);
                  const oneHourLater = new Date(d.getTime() + 60 * 60 * 1000);
                  formik.setFieldValue('toTime', oneHourLater, true);
                }}
                error={formik.errors.toTime}
                touched={formik.touched.toTime}
              />
            </View>
          </View>

          {/* Max guests */}
          <View style={{gap: 4}}>
            <Text style={styles.label}>Max guest number</Text>
            <View style={styles.flexwrap}>
              <InputWithOption
                inputRef={refs.maxGuests}
                placeholder="Guest count"
                checkboxLabel="No limit"
                value={formik.values.maxGuests}
                checked={formik.values.noLimit}
                onChangeValue={v => formik.setFieldValue('maxGuests', v, true)}
                onChangeChecked={checked => {
                  formik.setFieldValue('noLimit', checked, true);
                  if (checked) formik.setFieldTouched('maxGuests', false);
                }}
                containerStyle={styles.flexwrap}
                inputStyle={[styles.input, {width: SCREEN_WIDTH * 0.5}]}
                optionRowStyle={styles.optionRow}
                smallTextStyle={styles.smallText}
                error={formik.errors.maxGuests}
                touched={formik.touched.maxGuests && !formik.values.noLimit}
              />
            </View>
          </View>

          {/* Price */}
          <View style={{gap: 4}}>
            <Text style={styles.label}>Price per person</Text>
            <View style={{display: 'flex'}}>
              <InputWithOption
                inputRef={refs.pricePerPerson}
                placeholder="Amount"
                checkboxLabel="It's a free event"
                value={formik.values.pricePerPerson}
                checked={formik.values.isFree}
                onChangeValue={v =>
                  formik.setFieldValue('pricePerPerson', v, true)
                }
                onChangeChecked={checked => {
                  formik.setFieldValue('isFree', checked, true);
                  if (checked) formik.setFieldTouched('pricePerPerson', false);
                }}
                containerStyle={styles.flexwrap}
                inputStyle={[styles.input, {width: SCREEN_WIDTH * 0.5}]}
                optionRowStyle={styles.optionRow}
                smallTextStyle={styles.smallText}
                rightIcon={ICONS.dollarIcon}
                error={formik.errors.pricePerPerson}
                touched={formik.touched.pricePerPerson && !formik.values.isFree}
              />
            </View>
          </View>

          {/* Location */}
          <View style={{gap: 4}}>
            <Text style={styles.label}>Location</Text>
            <GooglePlacesAutocomplete
              // placeholder="Search for a Location"
              placeholder={
                isEdit
                  ? formik.values.location?.slice(0, 40)
                  : 'Search for a Location'
              }
              predefinedPlaces={[]}
              minLength={0}
              numberOfLines={1}
              keyboardShouldPersistTaps="always"
              textInputProps={{
                placeholderTextColor: isEdit
                  ? COLORS.neutral[900]
                  : COLORS.neutral[300],
                numberOfLines: 1,
                defaultValue: formik.values.location, // Set initial value for edit mode
                onChangeText: t => {
                  locationDraftRef.current = t;
                },
                onBlur: () => {
                  // commit draft to Formik once on blur
                  const next = (locationDraftRef.current || '').trim();
                  if (next !== formik.values.location) {
                    formik.setFieldValue('location', next, true);
                  }
                  formik.setFieldTouched('location', true);
                },
                ref: refs.location,
              }}
              styles={{
                textInputContainer: styles.textInputContainer,
                textInput: [styles.textInput],
              }}
              fetchDetails
              onPress={(data, details) => {
                const desc = data?.description || '';
                const loc = details?.geometry?.location;
                locationDraftRef.current = desc;
                formik.setFieldValue('location', desc, true);
                formik.setFieldValue('latitude', loc?.lat ?? null, false);
                formik.setFieldValue('longitude', loc?.lng ?? null, false);
              }}
              query={{key: GOOGLE_MAP_API_KEY, language: 'en'}}
              onFail={e => console.warn('Google Place Failed : ', e)}
              onNotFound={() => {}}
              onTimeout={() =>
                console.warn('google places autocomplete: request timeout')
              }
              timeout={20000}
              renderRightButton={() => (
                <View style={{justifyContent: 'center', padding: 10}}>
                  <Image
                    style={{width: 24, height: 24}}
                    source={ICONS.mapIcon}
                    tintColor={COLORS.neutral[400]}
                  />
                </View>
              )}
            />
            {formik.touched.location && formik.errors.location ? (
              <Text style={styles.errorText}>{formik.errors.location}</Text>
            ) : null}
          </View>

          {/* About */}
          <View style={{gap: 4}}>
            <Text style={styles.label}>About the Event </Text>
            <InputField
              ref={refs.description}
              placeholder="Add a caption..."
              value={formik.values.description}
              onChangeText={e => formik.setFieldValue('description', e, true)}
              onBlur={() => formik.setFieldTouched('description', true)}
              multiline
              customStyle={{
                paddingVertical: 16,
                borderRadius: 8,
                height: 100,
                ...(formik.touched.description && formik.errors.description
                  ? {borderColor: COLORS.error[500], borderWidth: 1}
                  : {}),
              }}
              textAlignVertical="top"
              maxLength={500}
            />
            {formik.touched.description && formik.errors.description ? (
              <Text style={styles.errorText}>{formik.errors.description}</Text>
            ) : null}
          </View>

          <View style={styles.lineSeparator} />

          {/* Payout method */}
          <View style={{gap: 4}}>
            <View style={[styles.flexRow, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.label,
                  {fontSize: 16, color: COLORS.neutral[900]},
                ]}>
                Payout method
              </Text>
              {/* <TouchableOpacity
                onPress={() => Alert.alert('Payment settings')}
                style={[styles.flexRow, {alignItems: 'center'}]}>
                <View style={styles.iconStyle}>
                  <Image
                    source={ICONS.settingIcon}
                    style={styles.img}
                    resizeMode="contain"
                    tintColor={COLORS.primary[300]}
                  />
                </View>
                <Text style={styles.setupText}>Setup</Text>
              </TouchableOpacity> */}
            </View>

            {paymentOptions.map(option => (
              <PaymentOptions
                key={option.label}
                label={option.label}
                icon={option.icon}
                iconSize={option.iconSize}
                isSelected={formik.values.payout_method === option.label}
                onPress={() => {
                  formik.setFieldValue('payout_method', option.label, true);
                  formik.setFieldTouched('payout_method', true, false);
                }}
              />
            ))}
            {formik.touched.payout_method && formik.errors.payout_method ? (
              <Text style={styles.errorText}>
                {formik.errors.payout_method}
              </Text>
            ) : null}
          </View>
        </View>

        {/* footer button inside scroll so it moves with keyboard */}
        <ButtonBox
          label={isEdit ? 'Update Event' : 'Create Event'}
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
  textInputContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    height: 44,
    alignItems: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 999,
    height: 42,
    marginLeft: 6,
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  coverImgContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.2,
    position: 'relative',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  reloadImgContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: COLORS.common.white,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {flex: 1, gap: 16, paddingHorizontal: 16, marginTop: 16},
  label: {
    color: COLORS.neutral[500],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  inputFieldStyle: {
    borderWidth: 1,
    borderRadius: 44,
    borderColor: COLORS.neutral[200],
    minHeight: 44,
    paddingHorizontal: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputTextStyle: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  setupText: {
    color: COLORS.primary[300],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  flexwrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineSeparator: {
    height: 1,
    backgroundColor: COLORS.neutral[200],
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    fontFamily: FONTS.poppins[400],
    marginTop: 2,
  },
});
