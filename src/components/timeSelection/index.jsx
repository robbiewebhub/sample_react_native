import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLORS, FONTS, ICONS} from '../../constant';

export default function TimeSelection({
  label = 'from now',
  timeString,
  onTimeChange,
  initialChecked = false,
  // initialTime = new Date(),
  initialDate = new Date(),
  disabled = false,
}) {
  const [checked, setChecked] = useState(initialChecked);
  const [time, setTime] = useState(timeString);
  const [date, setDate] = useState(initialDate);
  const [isPickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    onTimeChange(initialDate);
  }, []);

  // Open modal picker
  const showPicker = () => setPickerVisible(true);
  const hidePicker = () => setPickerVisible(false);

  // Checkbox toggle (internal)
  const handleCheckChange = () => setChecked(prev => !prev);

  const handleConfirm = date => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${displayHours}:${displayMinutes} ${ampm}`;

    console.log('🚀 ~ handleConfirm ~ time:', formattedTime);
    console.log('🚀 ~ handleConfirm ~ date:', date.toString());

    setTime(formattedTime);
    setDate(date);
    if (onTimeChange) onTimeChange(date);
    hidePicker();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.displayTime,
          checked ? styles.displayTimeDisabled : null,
        ]}
        onPress={() => !checked && !disabled && showPicker()}
        activeOpacity={checked ? 1 : 0.6}
        disabled={checked || disabled}>
        <Text
          style={[
            styles.btnText,
            {color: checked ? COLORS.neutral[400] : COLORS.neutral[900]},
          ]}>
          {checked ? label : time}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        date={date}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
        headerTextIOS="Pick a time"
        is24Hour={false}
      />

      <TouchableOpacity
        style={styles.optionRow}
        onPress={handleCheckChange}
        disabled={disabled}>
        <Image
          source={checked ? ICONS.checkboxIcon : ICONS.checkboxSelectedIcon}
          style={{width: 24, height: 24, opacity: disabled ? 0.5 : 1}}
        />
        <Text style={styles.smallText}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  displayTime: {
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 999,
    width: 211,
    justifyContent: 'center',
  },
  displayTimeDisabled: {
    backgroundColor: COLORS.neutral[200],
  },
  btnText: {
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  smallText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
});
