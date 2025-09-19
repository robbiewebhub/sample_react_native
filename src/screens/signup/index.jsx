import {useFormik} from 'formik';
import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import ButtonBox from '../../components/button';
import InputField from '../../components/inputfield';
import SecureInputField from '../../components/inputfield/secureInput';
import {COLORS, FONTS, ICONS, IMAGES, SCREEN_HEIGHT} from '../../constant';
import {useSignupMutation} from '../../services/api';
import {navigate, replace} from '../../utils/navigations';
import {signupValidation} from '../../utils/validations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showSuccess, showError} from '../../utils/flashMessageUtils';

const SignupScreen = () => {
  const [checkRemember, setCheckRemember] = useState(false);
  const [signup, {isLoading}] = useSignupMutation();
  const [confirmTerms, setConfirmTerms] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signupValidation,
    onSubmit: async (values, {resetForm}) => {
      if (!checkRemember) {
        setConfirmTerms(true);
        return;
      }
      try {
        setConfirmTerms(false);
        const result = await signup({
          email: values.email,
          password: values.password,
        }).unwrap();
        await AsyncStorage.removeItem('credentials');
        replace('LoginScreen');
        resetForm();
        setCheckRemember(false);
        showSuccess(result?.message ?? 'Logged In');
      } catch (e) {
        console.log('Signup failed:', e);
        showError(e?.data?.message);
      }
    },
  });

  return (
    <View
      style={{flex: 1, paddingBottom: Platform.select({ios: 16, android: 20})}}>
      <KeyboardAwareScrollView
        style={{flex: 1, zIndex: 100}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{gap: 24}}
        bounces={false}
        bottomOffset={30}
        keyboardShouldPersistTaps={'handled'}>
        <Image source={IMAGES.loginImg} style={styles.topImg} />
        <View style={styles.wrapper}>
          <Text style={styles.title}>Create account</Text>
          <View style={{gap: 16}}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldGroupLbl}>Email Address</Text>
              <InputField
                placeholder="Your email"
                value={formik.values.email}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
              />
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldGroupLbl}>Password</Text>
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
                placeholder="Repeat password"
                value={formik.values.confirmPassword}
                onChangeText={formik.handleChange('confirmPassword')}
                onBlur={formik.handleBlur('confirmPassword')}
                error={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? formik.errors.confirmPassword
                    : undefined
                }
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                gap: 8,
                flexDirection: 'row',
              }}
              onPress={() => setCheckRemember(!checkRemember)}>
              <Image
                source={
                  checkRemember
                    ? ICONS.checkboxIcon
                    : ICONS.checkboxSelectedIcon
                }
                style={{width: 24, height: 24}}
              />
              <Text style={styles.checkText}>I accept the</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigate('TermsServiceScreen')}> */}
            <Text
              style={[
                styles.checkText,
                {
                  textDecorationLine: 'underline',
                },
              ]}>
              terms
            </Text>
            {/* </TouchableOpacity> */}
            <Text style={styles.checkText}>and</Text>
            {/* <TouchableOpacity onPress={() => navigate('PrivacyPolicyScreen')}> */}
            <Text
              style={[
                styles.checkText,
                {
                  textDecorationLine: 'underline',
                },
              ]}>
              privacy policy
            </Text>
            {/* </TouchableOpacity> */}
          </View>
          <View style={{marginTop: -16}}>
            {confirmTerms && (
              <Text
                style={{
                  color: COLORS.error[300],
                  fontSize: 12,
                  fontFamily: FONTS.poppins[400],
                }}>
                Please accept terms and conditions
              </Text>
            )}
          </View>
          <ButtonBox
            label="Create account"
            onPress={formik.handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>Already have an account?</Text>
        <TouchableOpacity
          onPress={() => {
            navigate('LoginScreen');
          }}>
          <Text style={styles.ctaTextLink}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topImg: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.36,
    objectFit: 'cover',
    marginBottom: -SCREEN_HEIGHT * 0.06,
  },
  wrapper: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: COLORS.common.white,
    flex: 1,
    gap: 24,
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  title: {
    color: COLORS.neutral.black,
    fontSize: 24,
    fontFamily: FONTS.poppins[600],
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
  checkText: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  forgotText: {
    color: COLORS.neutral.black,
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  cta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  ctaText: {
    color: COLORS.neutral.black,
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  ctaTextLink: {
    color: COLORS.neutral.black,
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
    textDecorationLine: 'underline',
  },
});

export default SignupScreen;
