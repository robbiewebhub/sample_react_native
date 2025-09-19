import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {OtpInput} from 'react-native-otp-entry';
import ButtonBox from '../../components/button';
import PrimaryHeader from '../../components/header/PrimaryHeader';
import {COLORS, FONTS} from '../../constant';
import {navigate, replace} from '../../utils/navigations';
import {useResentOtpMutation, useVerifyOtpMutation} from '../../services/api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {showError, showSuccess} from '../../utils/flashMessageUtils';
import ResentOtp from './resentOtp';

const OtpScreen = () => {
  const [isError, setIsError] = useState(false);
  const {params} = useRoute();
  const [otpValue, setOtpValue] = useState(0);
  const [verifyOtp, {isLoading, error, status}] = useVerifyOtpMutation();
  console.log('🚀 ~ OtpScreen ~ error:', error);

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp({
        email: params?.email,
        otp: Number(otpValue),
      });
      console.log('🚀 ~ handleVerifyOtp ~ response:', response);
      showSuccess(response?.data?.message);
      if (
        response?.data?.data?.success === false ||
        response?.error?.data?.success === false
      ) {
        console.log('🚀 ~ handleVerifyOtp ~', response?.data);
        setIsError(true);
        showError(response?.error?.data?.message);
        return;
      }
      // console.log("🚀 ~ handleVerifyOtp ~ response:", response?.data?.data?.resetToken);
      replace('ResetPasswordScreen', {
        resetToken: response?.data?.data?.resetToken,
      });
    } catch (error) {
      console.log('🚀 ~ handleVerifyOtp ~ error:', error);
      showError(error?.data?.message);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.select({android: StatusBar.currentHeight, ios: 0}),
      }}>
      <PrimaryHeader />
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Please check your email</Text>
          <Text style={styles.text}>
            We've sent a code to{' '}
            <Text
              style={{
                fontFamily: FONTS.poppins[500],
              }}>
              {params?.email}
            </Text>
          </Text>
          <OtpInput
            numberOfDigits={6}
            focusColor={COLORS.neutral.black}
            autoFocus={false}
            hideStick={true}
            blurOnFilled={true}
            disabled={false}
            type="numeric"
            secureTextEntry={false}
            focusStickBlinkingDuration={500}
            onFocus={() => console.log('Focused')}
            onBlur={() => console.log('Blurred')}
            onTextChange={text => console.log(text)}
            onFilled={value => setOtpValue(value)}
            textInputProps={{
              accessibilityLabel: 'One-Time Password',
            }}
            textProps={{
              accessibilityRole: 'text',
              accessibilityLabel: 'OTP digit',
              allowFontScaling: false,
            }}
            theme={{
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
            // placeholder='999999'
          />
          {isError ? (
            <Text style={[styles.text, {color: COLORS.error[300]}]}>
              Wrong code, please try again.
            </Text>
          ) : null}
        </View>
        <ResentOtp email={params?.email} />
        <ButtonBox
          label="Verify"
          // disabled={!(otpValue.length === 6)}
          disabled={isLoading}
          isLoading={isLoading}
          onPress={handleVerifyOtp}
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
  pinCodeContainer: {
    borderRadius: 16,
    borderColor: COLORS.neutral[200],
    width: 50,
    height: 72,
  },
  activePinCodeContainer: {
    borderWidth: 2,
  },
  pinCodeText: {
    color: COLORS.neutral.black,
    fontSize: 28,
    fontFamily: FONTS.poppins[600],
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
    marginBottom: 16,
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

export default OtpScreen;
