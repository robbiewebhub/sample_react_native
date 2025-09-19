import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {COLORS, FONTS, ICONS} from '../../../constant';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {goBack} from '../../../utils/navigations';
import {SafeAreaView} from 'react-native-safe-area-context';

const guestAvatars = [
  require('../../../assets/images/userImg1.png'),
  require('../../../assets/images/userImg1.png'),
  require('../../../assets/images/userImg1.png'),
];

const guests = [
  {
    id: 1,
    name: 'Kimberley Zimmer',
    img: require('../../../assets/images/userImg1.png'),
    rating: '4.8',
    reviews: 2,
    date: 'Aug 25',
    status: 'Paid',
    actionIcon: ICONS.checkIcon,
  },
  {
    id: 2,
    name: 'Kimberley Zimmer',
    img: require('../../../assets/images/userImg1.png'),
    rating: '4.8',
    reviews: 2,
    date: 'Aug 25',
    status: 'Paid',
    actionIcon: ICONS.checkIcon,
  },
  {
    id: 3,
    name: 'Kimberley Zimmer',
    img: require('../../../assets/images/userImg1.png'),
    rating: '4.8',
    reviews: 2,
    date: 'Aug 25',
    status: 'Paid',
    actionIcon: ICONS.warningIcon,
  },
];

const ViewPost = () => {
  const [showGuestList, setShowGuestList] = useState(false);
  const toggleGuestList = () => {
    setShowGuestList(prev => !prev);
  };
  return (
    <SafeAreaView style={styles.wrapper}>
      <PrimaryHeader icon={ICONS.closeIcon} title="Pancake party" />
      <TouchableOpacity style={styles.editIconView}>
        <Image source={ICONS.editIcon} style={{width: 32, height: 32}} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 4, flexDirection: 'row', gap: 12}}>
          <Image
            source={require('../../../assets/images/productImg1.png')}
            style={styles.itemImage}
          />
          <View style={{flexDirection: 'row'}}>
            <View>
              <Text style={styles.hostText}> Pancake party</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Image
                  source={require('../../../assets/images/userImg1.png')}
                  style={styles.hostAvatar}
                />

                <Text
                  style={[
                    styles.hostText,
                    {
                      fontFamily: FONTS.poppins[500],
                      fontSize: 14,
                    },
                  ]}>
                  May's Chinese Cuisine
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoBlock}>
          <View style={styles.infoRow}>
            <Image source={ICONS.mapIcon} style={{width: 24, height: 24}} />
            <Text style={styles.smallText}>Aug 30 | 8:30 PM - 11:00 PM</Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={ICONS.mapIcon} style={{width: 24, height: 24}} />
            <Text style={styles.smallText}>$15.00 / per person</Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={ICONS.mapIcon} style={{width: 24, height: 24}} />
            <Text style={styles.smallText}>
              123 W 18th st apt 123, New York, NY 11011
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Image source={ICONS.mapIcon} style={{width: 24, height: 24}} />
            <Text style={styles.smallText}>3/6 have joined</Text>
            {!showGuestList ? (
              <View style={styles.avatarStack}>
                {guestAvatars.map((a, i) => (
                  <Image
                    key={i}
                    source={a}
                    style={[
                      styles.guestAvatar,
                      {marginLeft: i === 0 ? 0 : -10},
                    ]}
                  />
                ))}
              </View>
            ) : null}
          </View>
          <TouchableOpacity onPress={toggleGuestList}>
            <Text
              style={[
                styles.smallText,
                {
                  fontFamily: FONTS.poppins[500],
                  textDecorationLine: 'underline',
                  marginTop: 4,
                },
              ]}>
              {`${showGuestList ? 'Hide' : 'View'} guest list`}
            </Text>
          </TouchableOpacity>

          {showGuestList && (
            <View style={{gap: 8}}>
              {guests.map(guest => (
                <View style={styles.guestListView} key={guest.id}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: '85%', flexDirection: 'row'}}>
                      <Image
                        source={guest.img}
                        style={{width: 44, height: 44}}
                      />
                      <View style={{marginLeft: 8}}>
                        <Text style={styles.name}>{guest.name}</Text>
                        <View style={styles.metaRow}>
                          <Image
                            source={ICONS.starIcon}
                            style={styles.ratingIcon}
                          />
                          <Text style={styles.infoText}>
                            {`${guest.rating} (${guest.reviews}) · ${guest.date} ${guest.status}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '15%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <TouchableOpacity style={styles.chatIconView}>
                        <Image
                          source={guest.actionIcon}
                          style={{width: 24, height: 24}}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.chatIconView}>
                        <Image
                          source={ICONS.morefullIcon}
                          style={{width: 24, height: 24}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>About the Event</Text>
        <Text style={[styles.smallText, {color: COLORS.neutral[600]}]}>
          Come enjoy a fun, cozy gathering with fresh-off-the-griddle
          pancakes—sweet, savory, and everything in between. Hosted by home chef
          May, it’s all about good vibes and great food.
        </Text>
        <Text style={[styles.smallText, {color: COLORS.neutral[600]}]}>
          Spots are limited—RSVP to join the table!
        </Text>

        <Text style={styles.sectionTitle}>What’s Included?</Text>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>🥞</Text>
          <Text style={[styles.smallText, {color: COLORS.neutral[600]}]}>
            All-you-can-eat pancakes
          </Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>🍓</Text>
          <Text style={[styles.smallText, {color: COLORS.neutral[600]}]}>
            Fresh fruits & toppings
          </Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>☕️</Text>
          <Text style={[styles.smallText, {color: COLORS.neutral[600]}]}>
            Drinks (non-alcoholic)
          </Text>
        </View>
        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>🪑</Text>
          <Text style={[styles.smallText, {color: COLORS.neutral[600]}]}>
            Indoor seating provided
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.cancelEvent}>Cancel this event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewPost;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
  },
  editIconView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    alignItems: 'center',
    padding: 16,
    zIndex: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  hostText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 16,
  },
  smallText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  hostAvatar: {
    width: 24,
    height: 24,
    borderRadius: 14,
    marginRight: 6,
  },

  infoBlock: {
    marginTop: 14,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 17,
    marginRight: 6,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.neutral[600],
  },
  avatarStack: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  guestAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderColor: COLORS.white,
  },
  divider: {
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
  },
  sectionTitle: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[600],
    fontSize: 16,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelEvent: {
    color: COLORS.error[300],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
  },
  guestListView: {
    marginTop: 8,
  },
  name: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ratingIcon: {
    width: 16,
    height: 16,
  },
});
