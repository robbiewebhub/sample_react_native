import React, {useMemo} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {COLORS, FONTS, ICONS} from '../../../constant';
import ButtonBox from '../../../components/button';
import InputField from '../../../components/inputfield';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useFormik} from 'formik';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {
  useCreatePollMutation,
  useUpdatePollMutation,
} from '../../../services/api';
import {useRoute} from '@react-navigation/native';
import {showSuccess} from '../../../utils/flashMessageUtils';
import {goBack, navigate} from '../../../utils/navigations';

const pollType = [{label: 'Single'}, {label: 'Multiple'}];
const pollDuration = [
  {label: '1 day'},
  {label: '3 days'},
  {label: '7 days'},
  {label: 'Custom'},
];

const ValidationSchema = Yup.object().shape({
  question: Yup.string().trim().required('Poll question is required'),
  options: Yup.array()
    .of(Yup.string().trim().required('Option cannot be empty'))
    .min(2, 'Add at least two options')
    .test('no-empty', 'Options cannot be all empty', (arr = []) =>
      arr.some(v => (v || '').trim().length > 0),
    ),
  pollType: Yup.mixed().oneOf(['Single', 'Multiple']).required(),
  pollDuration: Yup.mixed()
    .oneOf(['1 day', '3 days', '7 days', 'Custom'])
    .required(),
  customDays: Yup.string().when('pollDuration', {
    is: 'Custom',
    then: s =>
      s
        .required('Enter custom duration')
        .matches(/^\d+$/, 'Enter a valid number')
        .test(
          'min-1',
          'Must be at least 1 day',
          v => parseInt(v || '0', 10) >= 1,
        )
        .test('max-30', 'Max 30 days', v => parseInt(v || '0', 10) <= 30),
    otherwise: s => s.notRequired(),
  }),
});

// Helper function to determine poll duration label from duration value
const getDurationLabel = duration => {
  switch (duration) {
    case 1:
      return '1 day';
    case 3:
      return '3 days';
    case 7:
      return '7 days';
    default:
      return 'Custom';
  }
};

// Helper function to process poll data for form initialization
const processPollData = pollData => {
  if (!pollData) {
    return {
      question: '',
      options: ['', ''],
      pollType: 'Single',
      pollDuration: '1 day',
      customDays: '',
    };
  }

  // Convert options from object format [{text: "...", order: 0}] to string array
  const optionsArray = Array.isArray(pollData.options)
    ? pollData.options
        .sort((a, b) => a.order - b.order) // Sort by order
        .map(option => option.text || '')
    : ['', ''];

  // Ensure at least 2 options
  if (optionsArray.length < 2) {
    optionsArray.push('', '');
  }

  const durationLabel = getDurationLabel(pollData.duration);
  const isCustom = durationLabel === 'Custom';

  return {
    question: pollData.question || '',
    options: optionsArray,
    pollType: pollData.allow_multiple ? 'Multiple' : 'Single',
    pollDuration: durationLabel,
    customDays: isCustom ? String(pollData.duration) : '',
  };
};

const NewPollScreen = () => {
  const {params} = useRoute();
  // console.log('params poll data ---->>>', params?.pollData);

  const [createPoll, {isLoading: isCreatingPoll}] = useCreatePollMutation();
  const [updatePoll, {isLoading: isUpdatingPoll}] = useUpdatePollMutation();

  const isLoading = isCreatingPoll || isUpdatingPoll;
  const isEdit = params?.isEdit || false;
  const pollId = params?.pollId || params?.pollData?.id;
  const pollData = params?.pollData;

  // Process initial values based on edit mode
  const initialValues = useMemo(() => processPollData(pollData), [pollData]);

  const formik = useFormik({
    initialValues,
    validationSchema: ValidationSchema,
    enableReinitialize: true, // Allow reinitializing when poll data changes
    onSubmit: async values => {
      try {
        const daysMap = {'1 day': 1, '3 days': 3, '7 days': 7};
        const durationDays =
          values.pollDuration === 'Custom'
            ? parseInt(values.customDays, 10)
            : daysMap[values.pollDuration];

        const filteredOptions = values.options
          .map(v => (v || '').trim())
          .filter(v => v.length > 0);

        const payload = {
          kitchenId: pollData?.kitchenId || params?.kitcheProfileData?.id,
          question: values.question,
          options: filteredOptions.map((text, i) => ({text, order: i})),
          allow_multiple: values.pollType === 'Multiple',
          duration: durationDays,
          expires_at: new Date(
            Date.now() + durationDays * 24 * 60 * 60 * 1000,
          ).toISOString(),
        };

        console.log('POLL PAYLOAD =>', payload);

        let result;
        if (isEdit && pollId) {
          console.log('Updating poll with ID:', pollId);
          result = await updatePoll({
            id: pollId,
            data: payload,
          }).unwrap();
        } else {
          result = await createPoll(payload).unwrap();
        }

        if (result?.success) {
          showSuccess(
            result?.message ||
              `Poll ${isEdit ? 'updated' : 'created'} successfully`,
          );
        }

        console.log(`${isEdit ? 'Update' : 'Create'} poll result:`, result);
        goBack();
      } catch (e) {
        console.warn(`${isEdit ? 'updatePoll' : 'createPoll'} failed`, e);
        // Could add error handling here
      }
    },
  });

  const addOption = () => {
    if (formik.values.options.length < 10) {
      // Limit to 10 options max
      formik.setFieldValue('options', [...formik.values.options, '']);
    }
  };

  const removeOption = indexToRemove => {
    if (formik.values.options.length > 2) {
      // Keep at least 2 options
      const newOptions = formik.values.options.filter(
        (_, index) => index !== indexToRemove,
      );
      formik.setFieldValue('options', newOptions);

      // Also remove from touched/errors arrays
      if (Array.isArray(formik.touched.options)) {
        const newTouched = formik.touched.options.filter(
          (_, index) => index !== indexToRemove,
        );
        formik.setTouched({...formik.touched, options: newTouched});
      }
    }
  };

  const handleOptionChange = (text, idx) => {
    const next = [...formik.values.options];
    next[idx] = text;
    formik.setFieldValue('options', next);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PrimaryHeader
        icon={ICONS.closeIcon}
        title={isEdit ? 'Edit Poll' : 'New Poll'}
      />
      <KeyboardAwareScrollView
        style={{flex: 1, zIndex: 100}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 16, paddingBottom: 16}}
        bounces={false}
        bottomOffset={30}
        keyboardShouldPersistTaps="handled">
        <View style={{paddingHorizontal: 16, gap: 16}}>
          {/* Question */}
          <View style={styles.group}>
            <Text style={styles.groupTtl}>Poll Question</Text>
            <InputField
              placeholder="I'm testing desserts! Help me pick the first release:"
              multiline
              value={formik.values.question}
              onChangeText={t => formik.setFieldValue('question', t)}
              onBlur={() => formik.setFieldTouched('question', true)}
              customStyle={{
                height: 80,
                borderRadius: 8,
              }}
              textAlignVertical="top"
            />
            {formik.touched.question && formik.errors.question ? (
              <Text style={styles.errorText}>{formik.errors.question}</Text>
            ) : null}
          </View>

          {/* Options */}
          <View style={styles.group}>
            <Text style={styles.groupTtl}>Poll Options</Text>
            {formik.values.options.map((item, idx) => {
              const touchedArr = formik.touched.options || [];
              const errorArr = formik.errors.options || [];
              const hasErr =
                Array.isArray(touchedArr) &&
                touchedArr[idx] &&
                Array.isArray(errorArr) &&
                errorArr[idx];

              return (
                <View key={`options__${idx}`} style={{gap: 4}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.groupSubTtl}>Option {idx + 1}</Text>
                    {formik.values.options.length > 2 && (
                      <TouchableOpacity
                        onPress={() => removeOption(idx)}
                        style={{padding: 4}}>
                        <Image
                          source={ICONS.closeIcon}
                          style={{width: 16, height: 16}}
                          tintColor={COLORS.error[500]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <InputField
                    value={item}
                    placeholder={
                      idx === 0
                        ? 'Matcha Tiramisu'
                        : idx === 1
                        ? 'Strawberry Cheesecake'
                        : `Option ${idx + 1}`
                    }
                    onChangeText={text => handleOptionChange(text, idx)}
                    onBlur={() => {
                      const touched = Array.isArray(formik.touched.options)
                        ? [...formik.touched.options]
                        : [];
                      touched[idx] = true;
                      formik.setTouched({...formik.touched, options: touched});
                    }}
                  />
                  {hasErr ? (
                    <Text style={styles.errorText}>
                      {formik.errors.options[idx]}
                    </Text>
                  ) : null}
                </View>
              );
            })}
            {typeof formik.errors.options === 'string' ? (
              <Text style={styles.errorText}>{formik.errors.options}</Text>
            ) : null}

            {formik.values.options.length < 10 && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  alignSelf: 'flex-start',
                }}
                onPress={addOption}>
                <Image
                  source={ICONS.addIcon}
                  style={{width: 20, height: 20}}
                  tintColor={COLORS.primary[300]}
                />
                <Text style={styles.addText}>Add Option</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Poll Type */}
          <View style={styles.group}>
            <Text style={styles.groupTtl}>Poll Type</Text>
            <View style={{flexDirection: 'row', gap: 8}}>
              {pollType.map((item, idx) => {
                const selected = formik.values.pollType === item.label;
                return (
                  <TouchableOpacity
                    key={`pollType__${idx}`}
                    style={[
                      styles.tab,
                      {
                        borderWidth: selected ? 2 : 1,
                        borderColor: selected
                          ? COLORS.neutral[900]
                          : COLORS.neutral[200],
                      },
                    ]}
                    onPress={() => {
                      formik.setFieldValue('pollType', item.label);
                      formik.setFieldTouched('pollType', true, false);
                    }}>
                    <Text style={styles.tabText}>
                      {item.label}{' '}
                      {item.label === 'Multiple' ? 'Choice' : 'Choice'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {formik.touched.pollType && formik.errors.pollType ? (
              <Text style={styles.errorText}>{formik.errors.pollType}</Text>
            ) : null}
          </View>

          {/* Poll Duration */}
          <View style={styles.group}>
            <Text style={styles.groupTtl}>Poll Duration</Text>
            <View style={{flexDirection: 'row', gap: 8, flexWrap: 'wrap'}}>
              {pollDuration.map((item, idx) => {
                const selected = formik.values.pollDuration === item.label;
                return (
                  <TouchableOpacity
                    key={`pollDuration__${idx}`}
                    style={[
                      styles.tab,
                      {
                        borderWidth: selected ? 2 : 1,
                        borderColor: selected
                          ? COLORS.neutral[900]
                          : COLORS.neutral[200],
                        minWidth: 80,
                      },
                    ]}
                    onPress={() => {
                      formik.setFieldValue('pollDuration', item.label);
                      formik.setFieldTouched('pollDuration', true, false);
                      // Reset custom days if not custom
                      if (item.label !== 'Custom') {
                        formik.setFieldValue('customDays', '');
                      }
                    }}>
                    <Text style={styles.tabText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {formik.touched.pollDuration && formik.errors.pollDuration ? (
              <Text style={styles.errorText}>{formik.errors.pollDuration}</Text>
            ) : null}

            {formik.values.pollDuration === 'Custom' ? (
              <View style={{gap: 4}}>
                <Text style={styles.groupSubTtl}>Custom duration (days)</Text>
                <View style={{position: 'relative'}}>
                  <InputField
                    placeholder="Enter custom duration"
                    value={formik.values.customDays}
                    onChangeText={t => formik.setFieldValue('customDays', t)}
                    onBlur={() => formik.setFieldTouched('customDays', true)}
                    keyboardType="numeric"
                  />
                  <Image source={ICONS.clockIcon} style={styles.inputIcon} />
                </View>
                {formik.touched.customDays && formik.errors.customDays ? (
                  <Text style={styles.errorText}>
                    {formik.errors.customDays}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <View style={{paddingHorizontal: 16, marginBottom: 10}}>
        <ButtonBox
          label={isEdit ? 'Update Poll' : 'Post Poll'}
          disabled={isLoading}
          onPress={formik.handleSubmit}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  group: {gap: 8},
  groupTtl: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  groupSubTtl: {
    color: COLORS.neutral[500],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  addText: {
    color: COLORS.primary[300],
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  tabText: {
    textAlign: 'center',
    color: COLORS.neutral[800],
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  inputIcon: {
    top: '50%',
    right: 16,
    width: 24,
    height: 24,
    tintColor: COLORS.neutral[400],
    transform: [{translateY: '-50%'}],
    position: 'absolute',
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    fontFamily: FONTS.poppins[400],
    marginTop: 2,
  },
});

export default NewPollScreen;
