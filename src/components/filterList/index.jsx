import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '../../constant';
import DropdownBtn from '../bottomSheet/DropdownBtn';

export default function FilterList({filterList}) {
    console.log("🚀 ~ FilterList ~ filterList:", filterList);
    const timeRef = useRef(null);
    const [timeSelection, setTimeSelection] = useState(filterList[0]);
    
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={{flexDirection: 'row', gap: 8}}>
        {filterList.map(item => (
          <DropdownBtn ref={timeRef} selectedItem={timeSelection} setItem={setTimeSelection} key={item.label} >
            <Text style={styles.filterDropdownLabel}>{item.label}</Text>
          </DropdownBtn>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterDropdown: {
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.neutral[100],
    flexDirection: 'row',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  filterDropdownLabel: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  filterDropdownIcon: {
    width: 16,
    height: 16,
    tintColor: COLORS.neutral[500],
  },
});
