import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import { COLORS, FONTS } from '../../../constant';


export default function FaqDetailScreen() {
  const {
    params: {categoryName, question, answer},
  } = useRoute();
  return (
    <View style={{flex: 1}}>
      <PrimaryHeader title={categoryName ?? 'Query'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wrapper}>
        <View style={{gap: 16}}>
          <Text style={styles.questionText}>{question}</Text>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
    backgroundColor: COLORS.common.white,
  },
  questionText: {
    color: COLORS.neutral[900],
    fontSize: 18,
    fontFamily: FONTS.poppins[500],
  },
  answerText: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  label: {
    color: COLORS.neutral[500],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  value: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
});
