import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import React, {useRef} from 'react';
import {COLORS, FONTS, ICONS} from '../../constant';
import ButtonBox from '../button';
import {navigate} from '../../utils/navigations';
import RequestRefundModal from './RequestRefundModal';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const OrderCard = ({ordersData}) => {
  const requestRefundRef = useRef(null);
  const tabBarHeight = useBottomTabBarHeight();
  const getDisplayStatus = item => {
    if (item.status === 'TO REVIEW') {
      return 'COMPLETED';
    } else if (item.status === 'NEW') {
      return 'NEW ORDER';
    } else if (item.status === 'CANCELED') {
      if (item.refundStatus === 'requested') {
        return 'REQUEST REFUND';
      } else {
        return 'REFUNDED';
      }
    } else return item.status;
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item?.userType === 'buyer') {
          navigate('OrderDetail', {item});
        } else {
          navigate('ChefOrderDetail', {item});
        }
      }}>
      <View style={styles.chefRow}>
        <Image
          source={require('../../assets/images/userImg1.png')}
          style={styles.avatar}
        />
        <View style={styles.chefLayout}>
          <View>
            <Text style={styles.chefName}>{item?.chef}</Text>
            {item?.userType === 'chef' ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={ICONS.starIcon}
                  style={{width: 16, height: 16}}
                />
                <Text style={styles.info}>{item?.rating.toFixed(1)} ·</Text>
                <Text style={styles.info}> ({item?.ratingCount})</Text>
              </View>
            ) : (
              <Text style={styles.time}>Est. Ready at {item.time}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.chatIconView}>
            <Image
              source={require('../../assets/icons/chatIcon.png')}
              style={{width: 24, height: 24}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.status, statusStyle(item.status)]}>
        {getDisplayStatus(item)}
      </Text>
      <View style={styles.detailsRow}>
        <Text style={styles.orderText}>
          Order#{' '}
          {item?.userType === 'chef'
            ? `${item.id} | Paid via ${item?.paymentMethod}`
            : `${item.id}`}
        </Text>
        <Text style={styles.sectionHeader}>${item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.imageRow}>
        {item.items.map((itm, idx) => (
          <View key={idx} style={styles.itemImageWrapper}>
            <Image source={itm.image} style={styles.itemImage} />
            <View style={styles.qtyView}>
              <Text style={styles.qtyText}>x{itm.qty}</Text>
            </View>
          </View>
        ))}
      </View>
      {item.status === 'NEW' && (
        <>
          <ButtonBox label="Check venmo" outline />
          <View style={styles.buttonAlignment}>
            <ButtonBox
              label="Cancel"
              outline
              customStyle={{width: '48%'}}
              onPress={() => {}}
            />
            <ButtonBox label="Confirm" customStyle={{width: '48%'}} />
          </View>
        </>
      )}

      {item.status === 'PREPARING' && item?.userType === 'buyer' && (
        <ButtonBox label="Pickup location" />
      )}

      {item.status === 'PREPARING' && item?.userType === 'chef' && (
        <>
          <View style={styles.buttonAlignment}>
            <ButtonBox
              label="Ready for pickup"
              outline
              customStyle={{width: '48%'}}
              onPress={() => {}}
            />
            <ButtonBox label="Start cooking" customStyle={{width: '48%'}} />
          </View>
        </>
      )}

      {item.status === 'COOKING' && item?.userType === 'buyer' && (
        <ButtonBox label="Pickup location" />
      )}

      {item.status === 'COOKING' && item?.userType === 'chef' && (
        <ButtonBox label="Ready for pickup" />
      )}

      {item.status === 'READY FOR PICKUP' && item?.userType === 'buyer' && (
        <>
          <ButtonBox label="Pickup location" outline />
          <View style={{marginTop: 8}}>
            <ButtonBox label="I've picked up" />
          </View>
        </>
      )}

      {item.status === 'READY FOR PICKUP' && item?.userType === 'chef' && (
        <ButtonBox label="Completed" />
      )}

      {item.status === 'ORDER ACCEPTED' && (
        <ButtonBox label="Pickup location" />
      )}

      {item.status === 'TO REVIEW' && item?.userType === 'buyer' && (
        <>
          {item.isRefundable ? (
            <>
              <ButtonBox
                label="Request refund"
                outline
                onPress={() => requestRefundRef.current.present()}
              />
              <View style={styles.buttonAlignment}>
                <ButtonBox
                  label="Review"
                  outline
                  customStyle={{width: '48%'}}
                  onPress={() =>
                    navigate('RateOrder', {...item, isReviewed: false})
                  }
                />
                <ButtonBox label="Reorder" customStyle={{width: '48%'}} />
              </View>
            </>
          ) : (
            <>
              <View style={styles.buttonAlignment}>
                <ButtonBox
                  label="My Rating"
                  outline
                  customStyle={{width: '48%'}}
                  onPress={() =>
                    navigate('RateOrder', {...item, isReviewed: true})
                  }
                />
                <ButtonBox label="Reorder" customStyle={{width: '48%'}} />
              </View>
            </>
          )}
        </>
      )}

      {item.status === 'TO REVIEW' && item?.userType === 'chef' && (
        <>
          {item?.isRated ? (
            <ButtonBox label="My rating" outline onPress={() => {}} />
          ) : (
            <ButtonBox
              label="Rate the buyer"
              onPress={() => navigate('ChefOrderDetail', {item})}
            />
          )}
        </>
      )}

      {item.status === 'CANCELED' && item?.userType === 'buyer' && (
        <>
          {item.refundStatus === 'requested' ? (
            <>
              <TouchableOpacity
                style={[
                  styles.outlineBtn,
                  {
                    backgroundColor: COLORS.neutral[100],
                    borderColor: COLORS.neutral[100],
                  },
                ]}>
                <Text
                  style={[styles.outlineText, {color: COLORS.neutral[400]}]}>
                  Request refund
                </Text>
              </TouchableOpacity>
              <ButtonBox label="Reorder" />
            </>
          ) : (
            <ButtonBox label="Reorder" />
          )}
        </>
      )}

      {item.status === 'CANCELED' && item?.userType === 'chef' && (
        <>
          {item.refundStatus === 'requested' ? (
            <>
              <View style={styles.buttonAlignment}>
                <ButtonBox
                  label="Declined refund"
                  outline
                  customStyle={{width: '48%'}}
                  onPress={() => {}}
                />
                <ButtonBox
                  label="Complete refund"
                  customStyle={{width: '48%'}}
                />
              </View>
            </>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{}}>
      <SectionList
        showsVerticalScrollIndicator={false}
        sections={ordersData}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderItem}
        renderSectionHeader={({section: {title}}) => (
          <View
            style={{paddingVertical: 16, backgroundColor: COLORS.neutral[100]}}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        contentContainerStyle={[
          styles.container,
          {paddingBottom: tabBarHeight},
        ]}
      />
      <RequestRefundModal openRef={requestRefundRef} />
    </View>
  );
};

export default OrderCard;

const statusStyle = status => {
  switch (status) {
    case 'READY FOR PICKUP':
      return {backgroundColor: COLORS.success[50], color: COLORS.success[300]};
    case 'NEW':
      return {backgroundColor: COLORS.warning[50], color: COLORS.warning[400]};
    case 'PAYMENT SENT':
      return {backgroundColor: COLORS.warning[50], color: COLORS.warning[400]};
    case 'ORDER ACCEPTED':
      return {backgroundColor: COLORS.info[50], color: COLORS.info[300]};
    case 'COMPLETED':
      return {backgroundColor: COLORS.neutral[100], color: COLORS.neutral[800]};
    case 'REQUEST REFUND':
      return {backgroundColor: COLORS.neutral[100], color: COLORS.neutral[800]};
    case 'PREPARING':
      return {backgroundColor: COLORS.info[50], color: COLORS.info[300]};
    case 'COOKING':
      return {backgroundColor: COLORS.info[50], color: COLORS.info[300]};
    case 'TO REVIEW':
      return {backgroundColor: COLORS.neutral[100], color: COLORS.neutral[800]};
    case 'CANCELED':
      return {backgroundColor: COLORS.error[50], color: COLORS.error[300]};
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.neutral[100],
  },
  sectionHeader: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  chefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chefName: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
  },
  time: {
    color: COLORS.neutral[500],
    fontFamily: FONTS.poppins[400],
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  orderText: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  qtyView: {
    position: 'absolute',
    bottom: -6,
    right: -8,
    backgroundColor: COLORS.neutral.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    width: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: COLORS.common.white,
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary[300],
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: 'auto',
    height: 44,
  },
  outlineText: {
    color: COLORS.primary[300],
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
  },
  primaryBtn: {
    backgroundColor: '#E91E63',
    borderRadius: 24,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 44,
  },
  primaryText: {
    color: '#FFF',
    fontWeight: '600',
  },
  chefLayout: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatIconView: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary[50],
    marginHorizontal: 16,
    borderRadius: 999,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
  },
  buttonAlignment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
