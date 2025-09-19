import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {COLORS, FONTS, ICONS} from '../../../constant';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import EarningGraph from '../../../components/earninggraph';
import Avatar from '../../../components/avatar';
import {navigate} from '../../../utils/navigations';
import moment from 'moment';

const filterList = [
  {id: 1, label: 'Today'},
  {id: 2, label: 'Last 7 days'},
  {id: 3, label: 'Last 30 days'},
  {id: 4, label: 'More'},
];

const {width} = Dimensions.get('screen');

const reviewList = [
  {
    id: 1,
    rating: 5,
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    userPic:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
    name: 'Will',
    note: 'Braised Beef Brisket *1',
  },
  {
    id: 2,
    rating: 5,
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    userPic:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
    name: 'Will',
    note: 'Braised Beef Brisket *1',
  },
  {
    id: 3,
    rating: 5,
    review:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    userPic:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
    name: 'Will',
    note: 'Braised Beef Brisket *1',
  },
];

const ReviewCard = () => {
  return (
    <View style={[styles.review]}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <View style={{gap: 8, flex: 1}}>
          <Text style={styles.reviewTtl}>Rating & Feedback</Text>
          <Text style={styles.reviewSubTtl}>Rated by 24 buyers</Text>
        </View>
        <View style={{alignItems: 'center', flexDirection: 'row', gap: 4}}>
          <Image source={ICONS.starIcon} style={{width: 24, height: 24}} />
          <Text style={styles.reviewPrice}>4.8</Text>
        </View>
      </View>
      <FlatList
        horizontal
        data={reviewList}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.reviewCard}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}>
              <Image source={ICONS.starIcon} style={{width: 16, height: 16}} />
              <Text style={styles.reviewRating}>{item.rating}</Text>
            </View>
            <Text numberOfLines={3} style={styles.reviewText}>
              {item.review}
            </Text>
            <View style={{flexDirection: 'row', gap: 8}}>
              <Avatar path={item.userPic} size={36} />
              <View style={{justifyContent: 'space-between'}}>
                <Text style={styles.reviewUserName}>{item.name}</Text>
                <Text style={styles.reviewNote}>{item.note}</Text>
              </View>
            </View>
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() => navigate('ReviewScreen')}
        style={{alignSelf: 'flex-start'}}>
        <Text style={styles.reviewCta}>See all reviews</Text>
      </TouchableOpacity>
    </View>
  );
};

const KitchenPerformanceScreen = () => {
  const [isFilter, setIsFilter] = useState('Today');
  const [dateRange, setDateRange] = useState(getDateRange('Today'));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [customDate, setCustomDate] = useState(moment());

  const onFilter = value => {
    setIsFilter(value);
    if (value === 'More') {
      setDatePickerVisibility(true);
    } else {
      setDateRange(getDateRange(value));
    }
  };

  function getDateRange(tab) {
    const today = moment();

    switch (tab) {
      case 'Today':
        return today.format('MMM DD, YYYY');

      case 'Last 7 days': {
        const start = moment(today).subtract(6, 'days');
        const sameMonth = start.month() === today.month();
        const sameYear = start.year() === today.year();

        if (sameYear && sameMonth) {
          return `${start.format('MMM DD')} – ${today.format('DD, YYYY')}`;
        } else if (sameYear && !sameMonth) {
          return `${start.format('MMM DD')} – ${today.format('MMM DD, YYYY')}`;
        } else {
          return `${start.format('MMM DD, YYYY')} – ${today.format(
            'MMM DD, YYYY',
          )}`;
        }
      }

      case 'Last 30 days': {
        const start = moment(today).subtract(29, 'days');
        const sameMonth = start.month() === today.month();
        const sameYear = start.year() === today.year();

        if (sameYear && sameMonth) {
          return `${start.format('MMM DD')} – ${today.format('DD, YYYY')}`;
        } else if (sameYear && !sameMonth) {
          return `${start.format('MMM DD')} – ${today.format('MMM DD, YYYY')}`;
        } else {
          return `${start.format('MMM DD, YYYY')} – ${today.format(
            'MMM DD, YYYY',
          )}`;
        }
      }

      default:
        return '';
    }
  }

  const handleDateConfirm = date => {
    if (!date) return;
    const selected = moment(date);
    setCustomDate(selected);
    setDateRange(selected.format('MMM DD, YYYY'));
    setDatePickerVisibility(false);
  };

  return (
    <View style={{flex: 1}}>
      <PrimaryHeader title="Kitchen Performance" />
      <ScrollView
        style={{flex: 1, paddingHorizontal: 16}}
        showsVerticalScrollIndicator={false}>
        <View style={{flexDirection: 'row', gap: 8}}>
          <View style={{flex: 1, gap: 8}}>
            <View style={styles.box}>
              <Text style={styles.boxVal}>6–8 PM</Text>
              <Text style={styles.boxLbl}>Best Selling Time</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.boxVal}>Friday</Text>
              <Text style={styles.boxLbl}>Most Popular Day</Text>
            </View>
          </View>
          <View style={[styles.box, {flex: 1}]}>
            <Text style={styles.boxVal}>42%</Text>
            <Text style={styles.boxLbl}>Repeat Customers</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={{gap: 16}}>
          <Text style={styles.title}>Earnings</Text>
          <FlatList
            horizontal
            data={filterList}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={{gap: 8}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  isFilter === item.label ? styles.activeTab : null,
                ]}
                onPress={() => onFilter(item.label)}>
                <Text
                  style={[
                    styles.filterBtnText,
                    {
                      color:
                        isFilter === item.label
                          ? COLORS.common.white
                          : COLORS.neutral[400],
                    },
                  ]}>
                  {item.label}
                </Text>
                {item.label === 'More' ? (
                  <Image
                    source={ICONS.downArrowIcon}
                    tintColor={
                      isFilter === item.label
                        ? COLORS.common.white
                        : COLORS.neutral[400]
                    }
                    style={styles.filterBtnIcon}
                  />
                ) : null}
              </TouchableOpacity>
            )}
          />
          <Text style={styles.earnDate}>{dateRange}</Text>
          <View style={{gap: 8}}>
            <TouchableOpacity
              onPress={() => navigate('TotalEarningScreen')}
              style={[styles.card, {alignItems: 'center'}]}>
              <Text style={styles.cardMostTxt}>Total Earnings</Text>
              <Text style={[styles.cardMostItem, {flex: 1}]}>$185.00</Text>
              <Image
                source={ICONS.leftArrowIcon}
                tintColor={COLORS.neutral[600]}
                style={{
                  width: 20,
                  height: 20,
                  transform: [{rotateY: '180deg'}],
                }}
              />
            </TouchableOpacity>
            <View style={{flexDirection: 'row', gap: 8}}>
              <View style={[styles.card, {flex: 1}]}>
                <Image source={ICONS.listIcon} style={styles.cardIcon} />
                <View style={{flex: 1, gap: 4}}>
                  <Text style={styles.cardLabel}>Orders Completed</Text>
                  <Text style={styles.cardMostItem}>12</Text>
                </View>
              </View>
              <View style={[styles.card, {flex: 1}]}>
                <Image source={ICONS.shoppingBagIcon} style={styles.cardIcon} />
                <View style={{flex: 1, gap: 4}}>
                  <Text style={styles.cardLabel}>Dishes Sold</Text>
                  <Text style={styles.cardMostItem}>20</Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: 8}}>
              <View style={[styles.card, {flex: 1}]}>
                <Image source={ICONS.dollarIcon} style={styles.cardIcon} />
                <View style={{flex: 1, gap: 4}}>
                  <Text style={styles.cardLabel}>Avg. Order Value</Text>
                  <Text style={styles.cardMostItem}>$12.14</Text>
                </View>
              </View>
              <View style={[styles.card, {flex: 1}]}>
                <Image source={ICONS.eyeIcon} style={styles.cardIcon} />
                <View style={{flex: 1, gap: 4}}>
                  <Text style={styles.cardLabel}>Views on kitchen</Text>
                  <Text style={styles.cardMostItem}>86</Text>
                </View>
              </View>
            </View>
          </View>
          <EarningGraph />
        </View>
        <View style={styles.divider} />
        <ReviewCard />
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={customDate.toDate()}
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.neutral[75],
    justifyContent: 'center',
    gap: 4,
    padding: 16,
  },
  boxVal: {
    color: COLORS.neutral[900],
    fontSize: 18,
    fontFamily: FONTS.poppins[500],
    textAlign: 'center',
  },
  boxLbl: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    textAlign: 'center',
  },
  divider: {
    backgroundColor: COLORS.neutral[200],
    height: 1,
    marginVertical: 24,
  },
  title: {
    color: COLORS.neutral[900],
    fontSize: 18,
    fontFamily: FONTS.poppins[500],
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 30,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeTab: {
    borderColor: COLORS.neutral[800],
    backgroundColor: COLORS.neutral[800],
  },
  filterBtnText: {
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  filterBtnIcon: {
    width: 20,
    height: 20,
  },
  earnDate: {
    color: COLORS.neutral[900],
    fontSize: 12,
    fontFamily: FONTS.poppins[500],
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.neutral[75],
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    padding: 16,
  },
  cardMostTxt: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  cardMostItem: {
    color: COLORS.neutral[900],
    fontSize: 18,
    fontFamily: FONTS.poppins[500],
    textAlign: 'right',
  },
  cardIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.neutral[600],
  },
  cardLabel: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    textAlign: 'right',
  },
  review: {
    gap: 16,
  },
  reviewTtl: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 18,
  },
  reviewSubTtl: {
    color: COLORS.neutral[600],
    fontFamily: FONTS.poppins[400],
    fontSize: 12,
  },
  reviewPrice: {
    color: COLORS.neutral[900],
    fontSize: 24,
    fontFamily: FONTS.poppins[600],
  },
  reviewCard: {
    borderRadius: 8,
    borderColor: COLORS.neutral[200],
    borderWidth: 1,
    width: width / 1.7,
    marginRight: 8,
    padding: 16,
  },
  reviewRating: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  reviewText: {
    color: COLORS.neutral[900],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    marginBottom: 16,
  },
  reviewUserName: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  reviewNote: {
    color: COLORS.neutral[900],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  reviewCta: {
    color: COLORS.neutral,
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
    textDecorationLine: 'underline',
  },
});

export default KitchenPerformanceScreen;
