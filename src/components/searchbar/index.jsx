import {Image, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS, ICONS} from '../../constant';

const SearchBar = ({placeholder, value, onChangeText, outline}) => {
  const [internalValue, setInternalValue] = useState('');
  const isControlled =
    typeof value === 'string' && typeof onChangeText === 'function';

  const styleType = outline ? styles.wrapperFieldOutline : styles.wrapperFieldBg;

  return (
    <View style={styles.wrapper}>
      <Image source={ICONS.searchFieldIcon} style={styles.wrapperIcon} />
      <TextInput
        placeholder={placeholder}
        style={[styles.wrapperField, styleType]}
        placeholderTextColor={COLORS.neutral[400]}
        value={isControlled ? value : internalValue}
        onChangeText={isControlled ? onChangeText : setInternalValue}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {internalValue ? (
      <TouchableOpacity onPress={()=> setInternalValue('')} style={styles.clearBtn}>
        <Image source={ICONS.closeIcon} tintColor={COLORS.neutral[900]} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  wrapperIcon: {
    position: 'absolute',
    top: 14,
    left: 16,
    width: 16,
    height: 16,
    zIndex: 1,
  },
  wrapperField: {
    borderRadius: 44,
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    height: 44,
    paddingHorizontal: 40,
  },
  wrapperFieldBg: {
    backgroundColor: COLORS.neutral[75],
  },
  wrapperFieldOutline: {
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  clearBtn: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: '-50%'}],
    right: 16,
    zIndex: 1,
  }
});

export default SearchBar;
