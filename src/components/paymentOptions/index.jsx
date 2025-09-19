import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {COLORS, FONTS, ICONS} from '../../constant';

const PaymentOptions = ({label, icon, iconSize, isSelected, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkBoxContainer}>
      <Image
        source={isSelected ? ICONS.selectedRadioBtn : ICONS.unselectedRadioBtn}
        style={{width: 24, height: 24}}
      />
      <Image source={icon} style={iconSize} />
      <Text style={styles.text}>{label}</Text>
      {isSelected ? (
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Text
            style={
              styles.upiText
            }>{`${label?.toLowerCase()}.me / cheflulu`}</Text>
          <TouchableOpacity style={styles.copyBtn}>
            <Image source={ICONS.copyIcon} style={{width: 24, height: 24}} />
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default PaymentOptions;

const styles = StyleSheet.create({
  checkBoxContainer: {
    width: '100%',
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: COLORS.neutral[800],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
    flex: 1,
  },
  upiText: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  copyBtn: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 32,
    borderColor: COLORS.neutral[100],
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});
