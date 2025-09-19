import React, {forwardRef, useMemo} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {COLORS, FONTS, ICONS} from '../../../constant';
import ButtonBox from '../../../components/button';

const MenuPopup = forwardRef(({onGoToMenu, onClose}, ref) => {
  const snapPoints = useMemo(() => ['60%'], []);

  const renderBackdrop = props => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheetModal
      ref={ref}
      // snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      onDismiss={onClose}>
      <BottomSheetView style={styles.container}>
        <Image
          source={ICONS.dairyIcon}
          style={styles.icon}
          tintColor={COLORS.primary[75]}
        />
        <Text style={styles.title}>Your menu is currently empty.</Text>
        <Text style={styles.subtitle}>
          Add items now to showcase your offerings and start receiving orders.
        </Text>
        <View style={{width: '100%', marginTop: 32, marginBottom: 20}}>
          <ButtonBox label="Go to menu" onPress={onGoToMenu} />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default MenuPopup;

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[400],
    textAlign: 'center',
    marginTop: 8,
  },
});
