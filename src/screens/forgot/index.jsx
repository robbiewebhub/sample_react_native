import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ButtonBox from '../../components/button';
import PrimaryHeader from '../../components/header/PrimaryHeader';
import InputField from '../../components/inputfield';
import {COLORS, FONTS} from '../../constant';
import {navigate} from '../../utils/navigations';
import {useFormik} from 'formik';
import {emailValidation} from '../../utils/validations';
import {useForgotPasswordMutation} from '../../services/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {showSuccess, showError} from '../../utils/flashMessageUtils';

const ForgotScreen = () => {
  const [forgotPassword, {isLoading}] = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailValidation,
    onSubmit: async (values, {resetForm}) => {
      try {
        const result = await forgotPassword(values).unwrap();
        console.log('🚀 ~ onSubmit: ~ result:', result);
        showSuccess(result?.message);
        // resetForm();
        navigate('OtpScreen', {email: values.email});
      } catch (e) {
        // handle error, e.g., show toast
        console.log('Request failed:', e);
        showError(e?.data?.message || "User does't exist");
      }
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.select({android: StatusBar.currentHeight, ios: 0}),
      }}>
      <PrimaryHeader />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1, padding: 24}}
        keyboardShouldPersistTaps={'handled'}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Forgot password</Text>
          <Text style={styles.text}>
            Don't worry! It happens. Please enter the email associated with your
            account.
          </Text>
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
        </View>
        <ButtonBox
          disabled={!formik.isValid || isLoading}
          isLoading={isLoading}
          label="Send code"
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

export default ForgotScreen;
