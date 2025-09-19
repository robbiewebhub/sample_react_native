import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONTS, ICONS, IMAGES} from '../../../constant';
import SwitchBox from '../../../components/switchbox';
import Avatar from '../../../components/avatar';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {navigate} from '../../../utils/navigations';

const EarningCard = ({isOpen, onClick}) => {
  return (
    <View style={styles.earnCard}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <Avatar path={IMAGES.userImg1} size={24} />
        <Text style={styles.earnCardName}>May’s Chinese Cuisine</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.earnCardBox}>
          <Text style={styles.earnCardPrice}>
            {isOpen ? '$185.00' : '$0.00'}
          </Text>
          <View style={{flexDirection: 'row', gap: 4, alignItems: 'center'}}>
            <Text style={styles.earnCardTxt}>Today’s Earnings</Text>
            <Image
              source={ICONS.leftArrowIcon}
              style={styles.earnCardArrow}
              tintColor={COLORS.common.white}
            />
          </View>
        </View>
        <View style={styles.earnCardBox}>
          <View style={{minHeight: 32, justifyContent: 'center'}}>
            <SwitchBox onToggle={onClick} status={isOpen} />
          </View>
          <Text style={styles.earnCardTxt}>{isOpen ? 'Open' : 'Closed'}</Text>
        </View>
      </View>
    </View>
  );
};

const MyOrderCard = ({icon, label, number, onPress}) => {
  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress}>
      <View style={styles.orderCardIcon}>
        <Image
          source={icon}
          style={{width: 24, height: 24}}
          tintColor={COLORS.neutral[600]}
        />
        {number ? <Text style={styles.orderCardNum}>{number}</Text> : null}
      </View>
      <Text style={styles.orderCardText}>{label}</Text>
    </TouchableOpacity>
  );
};

const MyOrder = ({isOpen}) => {
  return (
    <View style={styles.myOrder}>
      <View style={styles.myOrderHead}>
        <Image source={ICONS.listIcon} style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Order Status</Text>
        <Image
          source={ICONS.leftArrowIcon}
          style={[styles.buttonIcon, {transform: [{rotateY: '180deg'}]}]}
        />
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <MyOrderCard
          number={isOpen ? 1 : null}
          icon={ICONS.hourglassIcon}
          label="New"
        />
        <MyOrderCard
          number={isOpen ? 1 : null}
          icon={ICONS.chefCapIcon}
          label="In Progress"
        />
        <MyOrderCard
          number={isOpen ? 2 : null}
          icon={ICONS.shoppingBagIcon}
          label="Ready"
        />
        <MyOrderCard icon={ICONS.tickIcon} label="Completed" />
        <MyOrderCard icon={ICONS.deleteIcon} label="Canceled" />
      </View>
    </View>
  );
};

const DashboardScreen = () => {
  const [isOpen, setIsOpen] = useState();
  const tabBarHeight = useBottomTabBarHeight();
  const onIsOpen = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      navigate('TodayMenuScreen');
    }
  };
  return (
    <View style={{flex: 1, paddingBottom: tabBarHeight}}>
      <View style={styles.header}>
        <Text style={styles.headerTtl}>Good morning!</Text>
      </View>
      <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
        <View style={{gap: 16}}>
          <EarningCard isOpen={isOpen} onClick={onIsOpen} />
          <MyOrder isOpen={isOpen} />
          <Text style={styles.lastDays}>Last 7 days</Text>
          <View style={{gap: 8}}>
            <View style={[styles.card, {alignItems: 'center'}]}>
              <Text style={styles.cardMostTxt}>Most popular dish</Text>
              <Text style={styles.cardMostItem}>Egg Fried Rice</Text>
            </View>
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
          <TouchableOpacity style={styles.performBtn}>
            <Text style={styles.performBtnLbl}>Kitchen Performance</Text>
            <Image
              style={styles.performBtnIcon}
              source={ICONS.rightArrowIcon}
              tintColor={COLORS.neutral['black']}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  headerTtl: {
    color: COLORS.neutral[900],
    fontSize: 28,
    fontFamily: FONTS.poppins[600],
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  earnCard: {
    borderRadius: 8,
    backgroundColor: COLORS.neutral[900],
    gap: 16,
    padding: 16,
  },
  earnCardName: {
    color: COLORS.common.white,
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  earnCardBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  earnCardPrice: {
    color: COLORS.secondary[300],
    fontSize: 24,
    fontFamily: FONTS.poppins[600],
    lineHeight: 32,
  },
  earnCardTxt: {
    color: COLORS.common.white,
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  earnCardArrow: {
    width: 20,
    height: 20,
    transform: [{rotateY: '180deg'}],
  },
  buttonIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.neutral[600],
  },
  buttonText: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    flex: 1,
  },
  myOrder: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.neutral[200],
    gap: 8,
    padding: 16,
  },
  myOrderHead: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral[100],
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  orderCard: {
    alignItems: 'center',
    gap: 4,
  },
  orderCardIcon: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 44,
    borderColor: COLORS.neutral[100],
    justifyContent: 'center',
    width: 44,
    height: 44,
    position: 'relative',
  },
  orderCardNum: {
    borderRadius: 20,
    backgroundColor: COLORS.primary[300],
    color: COLORS.common.white,
    lineHeight: 20,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.poppins[500],
    top: 0,
    right: -6,
    width: 20,
    height: 20,
    position: 'absolute',
  },
  orderCardText: {
    color: COLORS.neutral[600],
    fontFamily: FONTS.poppins[400],
    fontSize: 10,
  },
  lastDays: {
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
  performBtn: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral['black'],
    marginBottom: 16,
  },
  performBtnLbl: {
    color: COLORS.neutral['black'],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  performBtnIcon: {
    width: 20,
    height: 20,
  },
});

export default DashboardScreen;
