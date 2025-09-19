import {useFormik} from 'formik';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import ButtonBox from '../../components/button';
import PrimaryHeader from '../../components/header/PrimaryHeader';
import SecureInputField from '../../components/inputfield/secureInput';
import {COLORS, FONTS} from '../../constant';
import {useResetPasswordMutation} from '../../services/api';
import {resetAndNavigate} from '../../utils/navigations';
import {passwordValidation} from '../../utils/validations';
import {useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';

const ResetPasswordScreen = () => {
  const {params} = useRoute();
  // console.log("🚀 ~ ResetPasswordScreen ~ params:", params);
  const [resetPassword, {isLoading}] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidation,
    onSubmit: async (values, {resetForm}) => {
      try {
        const result = await resetPassword({
          resetToken: params?.resetToken,
          password: values.confirmPassword,
        }).unwrap();
        console.log('🚀 ~ onSubmit: ~ result:', result);
        resetForm();
        resetAndNavigate('LoginScreen');
      } catch (e) {
        // handle error, e.g., show toast
        console.log('Request failed:', e);
      }
    },
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <PrimaryHeader />
      <KeyboardAwareScrollView
        contentContainerStyle={{flexGrow: 1, paddingHorizontal: 24}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.text}>
            Set a strong password to secure your account.
          </Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupLbl}>New Password</Text>
            <SecureInputField
              placeholder="Enter your password"
              value={formik.values.password}
              onChangeText={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldGroupLbl}>Confirm Password</Text>
            <SecureInputField
              placeholder="Confirm your password"
              value={formik.values.confirmPassword}
              onChangeText={formik.handleChange('confirmPassword')}
              onBlur={formik.handleBlur('confirmPassword')}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
                  : undefined
              }
            />
          </View>
        </View>
        <ButtonBox
          disabled={!formik.isValid}
          isLoading={isLoading}
          label="Reset"
          onPress={formik.handleSubmit}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 40,
    flex: 1,
    gap: 24,
  },
  title: {
    color: COLORS.neutral.black,
    fontSize: 24,
    fontFamily: FONTS.poppins[600],
    textAlign: 'center',
  },
  text: {
    color: COLORS.neutral.black,
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    textAlign: 'center',
  },
  fieldGroup: {
    gap: 4,
  },
  fieldGroupLbl: {
    color: COLORS.neutral.black,
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
});

export default ResetPasswordScreen;
