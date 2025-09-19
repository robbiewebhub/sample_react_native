import React, {useState, useEffect} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {useDispatch} from 'react-redux';
import ButtonBox from '../../components/button';
import InputField from '../../components/inputfield';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecureInputField from '../../components/inputfield/secureInput';
import {COLORS, FONTS, ICONS, IMAGES, SCREEN_HEIGHT} from '../../constant';
import {useGetUserProfileQuery, useLoginMutation} from '../../services/api';
import {setUser} from '../../store/slices/userSlice';
import {navigate, resetAndNavigate} from '../../utils/navigations';

import {useFormik} from 'formik';
import {loginValidation} from '../../utils/validations';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {showError, showSuccess} from '../../utils/flashMessageUtils';
import {setUserProfileData} from '../../store/slices/userProfileSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [checkRemember, setCheckRemember] = useState(false);
  const [loadingCreds, setLoadingCreds] = useState(true);
  const [initialCreds, setInitialCreds] = useState({email: '', password: ''});
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false);

  const [login, {isLoading}] = useLoginMutation();

  const {
    data: profileData,
    isSuccess: profileSuccess,
    isLoading: profileLoading,
  } = useGetUserProfileQuery(undefined, {
    skip: !shouldFetchProfile, // Skip the query until we need it
  });

  useEffect(() => {
    if (profileSuccess && profileData) {
      dispatch(setUserProfileData(profileData?.data));
      resetAndNavigate('BottomTab');
    }
  }, [profileSuccess, profileData, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('credentials');
        if (raw) {
          const creds = JSON.parse(raw);
          setInitialCreds(creds);
          setCheckRemember(true);
        }
      } catch (e) {
        console.warn('Failed to load credentials', e);
      } finally {
        setLoadingCreds(false);
      }
    })();
  }, []);

  const formik = useFormik({
    initialValues: initialCreds,
    enableReinitialize: true,
    validationSchema: loginValidation,
    onSubmit: async (values, {resetForm}) => {
      Keyboard.dismiss();
      try {
        const result = await login(values).unwrap();
        console.log('login result...', result);
        if (result?.success) {
          showSuccess(result?.message ?? 'Logged In');
          dispatch(setUser(result.data));
        }
        if (checkRemember) {
          await AsyncStorage.setItem('credentials', JSON.stringify(values));
        } else {
          await AsyncStorage.removeItem('credentials');
        }

        resetForm();
        setCheckRemember(false);
        setShouldFetchProfile(true);
        // resetAndNavigate('BottomTab');
      } catch (e) {
        // handle error, e.g., show toast
        console.log('Login failed:', e);
        showError('Login Failed', e?.data?.message);
      }
    },
  });

  if (loadingCreds) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
          <Text style={styles.title}>Hi, Welcome 👋🏼</Text>
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
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
              <Text style={styles.checkText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('ForgotScreen')}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <ButtonBox
            label="Log in"
            disabled={isLoading || !formik.isValid}
            isLoading={isLoading}
            onPress={formik.handleSubmit}
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>Don't have an account?</Text>
        <Text onPress={() => navigate('SignupScreen')}>
          <Text style={styles.ctaTextLink}>Sign up</Text>
        </Text>
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
    marginTop: 100,
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

export default LoginScreen;
