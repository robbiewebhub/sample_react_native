import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Modal} from 'react-native';
import {COLORS, FONTS} from '../../constant';

export default function FullScreenLoader({
  isVisible = false,
  message = 'Loading...',
}) {
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.primary[300]} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.neutral[500] || '#333',
    fontFamily: FONTS.poppins[500]
  },
});
