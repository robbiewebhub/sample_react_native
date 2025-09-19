import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS, FONTS} from '../../constant';
import {useResentOtpMutation} from '../../services/api';

export default function ResentOtp({email = null}) {
  const [resentOtp, {isLoading}] = useResentOtpMutation();
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      if (!email || timer > 0) return;

      console.log('🚀 ~ ResentOtp ~ email:', email);
      const response = await resentOtp({email});
      console.log('🚀 ~ handleResendOtp ~ response:', response);

      // Start 1-minute timer
      setTimer(60);
    } catch (error) {
      console.log('🚀 ~ handleResendOtp ~ error:', error);
    }
  };

  const formatTime = sec => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.cta}>
      {timer > 0 ? (
        <Text style={styles.ctaText}>Resend code in {formatTime(timer)}</Text>
      ) : (
        <>
          <Text style={styles.ctaText}>I didn't receive a code</Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={isLoading}>
            <Text style={[styles.ctaTextLink, isLoading && {opacity: 0.5}]}>
              Resent
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
