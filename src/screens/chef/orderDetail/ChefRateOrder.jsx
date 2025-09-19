import {Rating} from '@kolking/react-native-rating';
import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ButtonBox from '../../../components/button';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {COLORS, FONTS, ICONS, SCREEN_WIDTH} from '../../../constant';
import {goBack} from '../../../utils/navigations';
import {useRoute} from '@react-navigation/native';

const orderId = 'ORDER_123456';
const orderTime = '2025-04-04T17:35:00+05:30';
const restaurant = "Chef Anna's Kitchen";

const STATUS_OPTIONS = ['On Time', 'Late', 'No Show'];

const ChefRateOrder = ({value, onChange}) => {
  const {
    params: {isReviewed},
  } = useRoute();
  const [isEditMode, setIsEditMode] = useState(isReviewed);
  const [rating, setRating] = useState(0);
  const [selected, setSelected] = useState(value || STATUS_OPTIONS[0]);

  const handlePress = option => {
    setSelected(option);
    onChange && onChange(option);
  };

  const handleSubmit = () => {
    const payload = {
      orderId,
      orderTime,
      restaurant,
      rating,
    };

    setIsEditMode(true);

    // TODO: Replace with actual API call
    console.log('Submitting payload:', JSON.stringify(payload, null, 2));
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <PrimaryHeader
        icon={ICONS.closeIcon}
        title="Review your buyer"
        onPress={() => goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>{`Rate your buyer: Amelia Chu`}</Text>

        {isEditMode ? (
          <>
            <View style={{gap: 8}}>
              <View style={styles.editWrapper}>
                <Text style={styles.largeText}>Buyer rating</Text>
                <Text
                  style={styles.editText}
                  onPress={() => setIsEditMode(false)}>
                  Edit
                </Text>
              </View>
              <View style={styles.editWrapper}>
                <View style={{width: '50%'}}>
                  <Text style={[styles.text, {fontSize: 16}]}>
                    How was your experience with the buyer?
                  </Text>
                </View>

                <Rating rating={rating} disabled size={24} />
              </View>
            </View>
            <View style={{gap: 4}}></View>
          </>
        ) : (
          <>
            <View style={{gap: 8}}>
              <Text style={styles.largeText}>
                How was your experience with the buyer?
              </Text>
              <Rating rating={rating} onChange={value => setRating(value)} />
            </View>
          </>
        )}

        <View style={{gap: 8}}>
          <Text
            style={[
              styles.largeText,
              {fontSize: 18, fontFamily: FONTS.poppins[500]},
            ]}>
            Pickup experience
          </Text>

          <View style={styles.boxContainer}>
            {STATUS_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.box, selected === option && styles.boxSelected]}
                onPress={() => handlePress(option)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.text,
                    selected === option && styles.textSelected,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      {isEditMode ? null : !!rating ? (
        <ButtonBox
          label="Submit review"
          //   disabled={!rating || selectedIssues.length === 0}
          onPress={handleSubmit}
          customStyle={styles.footer}
        />
      ) : null}
    </SafeAreaView>
  );
};

export default ChefRateOrder;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 16,
    gap: 24,
    paddingBottom: 16,
  },
  text: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  largeText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[600],
    fontSize: 24,
  },
  editWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editText: {
    color: COLORS.primary[300],
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
  },
  starRow: {
    flexDirection: 'row',
  },

  footer: {
    margin: 16,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  box: {
    width: SCREEN_WIDTH * 0.292,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  boxSelected: {
    borderColor: '#111',
  },
  text: {
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    color: COLORS.neutral[800],
  },
  textSelected: {
    fontWeight: '600',
  },
});
