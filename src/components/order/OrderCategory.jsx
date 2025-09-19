import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {COLORS, FONTS} from '../../constant';

const OrderCategory = ({
  statuses,
  onFilterChange,
  activeStatus,
  setActiveStatus,
}) => {
  const handlePress = status => {
    setActiveStatus(status);
    if (onFilterChange) onFilterChange(status);
  };
  return (
    <View style={{}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {statuses?.map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.tab, activeStatus === status && styles.activeTab]}
            onPress={() => handlePress(status)}>
            <Text
              style={[
                styles.tabText,
                activeStatus === status && styles.activeTabText,
              ]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.neutral[800],
    borderColor: COLORS.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: COLORS.neutral[400],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.common.white,
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
    fontStyle: 'normal',
  },
});

export default OrderCategory;
