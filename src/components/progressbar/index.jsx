import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, ICONS } from '../../constant';
import ButtonBox from '../button';

const isPollExpired = expiresAt => {
  return new Date() > new Date(expiresAt);
};

const Progressbar = ({
  title,
  value,
  onPress,
  isVotingPoll,
  isSelected,
  pollData,
  allowMultiple,
  userHasVoted,
}) => {
  const expired = isPollExpired(pollData.expires_at);

  return (
    <View style={styles.wrapper}>
      {!userHasVoted && !expired ? (
          <ButtonBox
            type="light"
            onPress={onPress}
            label={title}
            customStyle={{ borderRadius: 8 }}
            isLoading={isVotingPoll}
          />
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 4,
              borderRadius: 4,
            }}>
          <TouchableOpacity
            onPress={allowMultiple ? onPress : ()=>{} }
            disabled={!allowMultiple}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {
                allowMultiple ?
                <Image
                  source={
                    isSelected ? ICONS.selectedRadioBtn : ICONS.unselectedRadioBtn
                  }
                  style={{ width: 24, height: 24 }}
                /> : null
              }
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
            <Text style={styles.value}>{value}</Text>
          </View>
          <View style={styles.progressbar}>
            <View style={[styles.bar, { width: value }]} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  title: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  value: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  progressbar: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: 2,
    width: '100%',
    height: 4,
  },
  bar: {
    borderRadius: 2,
    backgroundColor: COLORS.primary[300],
    height: '100%',
  },
});

export default Progressbar;
