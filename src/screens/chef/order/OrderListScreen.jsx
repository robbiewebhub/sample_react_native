import {StyleSheet, Text, View, Image, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import OrderCategory from '../../../components/order/OrderCategory';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import OrderCard from '../../../components/order';
import {COLORS, FONTS, ICONS} from '../../../constant';

const OrderListScreen = () => {
  const [activeStatus, setActiveStatus] = useState('All');
  const statuses = [
    'All',
    'New',
    'Preparing',
    'Cooking',
    'Ready',
    'To review',
    'Canceled',
  ];

  const ordersData = [
    {
      title: 'TODAY, MAR 02',
      data: [
        {
          id: '4567',
          chef: 'Amelia Chu',
          status: 'NEW',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          price: 15.8,
          items: [
            {
              image: require('../../../assets/images/productImg1.png'),
              qty: 2,
            },
            {
              image: require('../../../assets/images/productImg2.png'),
              qty: 1,
            },
          ],
          pickedUp: false,
        },
      ],
    },
    {
      title: 'TODAY, MAR 02',
      data: [
        {
          id: '2345',
          chef: 'Chef Anna’s Kitchen',
          status: 'PREPARING',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          price: 22.0,
          items: [
            {image: require('../../../assets/images/productImg1.png'), qty: 3},
            {image: require('../../../assets/images/productImg2.png'), qty: 3},
            {image: require('../../../assets/images/productImg3.png'), qty: 3},
          ],
          pickedUp: false,
        },
      ],
    },
    {
      title: 'TODAY, MAR 02',
      data: [
        {
          id: '4567',
          chef: 'Amelia Chu',
          status: 'COOKING',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          price: 15.8,
          items: [
            {
              image: require('../../../assets/images/productImg1.png'),
              qty: 2,
            },
            {
              image: require('../../../assets/images/productImg2.png'),
              qty: 1,
            },
          ],
          pickedUp: false,
        },
      ],
    },
    {
      title: 'TODAY, MAR 02',
      data: [
        {
          id: '4567',
          chef: 'Amelia Chu',
          status: 'READY FOR PICKUP',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          price: 15.8,
          items: [
            {
              image: require('../../../assets/images/productImg1.png'),
              qty: 2,
            },
            {
              image: require('../../../assets/images/productImg2.png'),
              qty: 1,
            },
          ],
          pickedUp: false,
        },
      ],
    },
    {
      title: 'TODAY, MAR 02',
      data: [
        {
          id: '2345',
          chef: 'Chef Anna’s Kitchen',
          status: 'TO REVIEW',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          isRefundable: true,
          isRated: false,
          price: 22.0,
          items: [
            {image: require('../../../assets/images/productImg1.png'), qty: 2},
          ],
          pickedUp: false,
        },
        {
          id: '2345',
          chef: 'Chef Anna’s Kitchen',
          status: 'TO REVIEW',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          isRefundable: false,
          isRated: true,
          price: 22.0,
          items: [
            {image: require('../../../assets/images/productImg1.png'), qty: 2},
          ],
          pickedUp: false,
        },
      ],
    },
    {
      title: 'TODAY, MAR 02',
      data: [
        {
          id: '2345',
          chef: 'Chef Anna’s Kitchen',
          status: 'CANCELED',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          refundStatus: 'requested',
          price: 22.0,
          items: [
            {image: require('../../../assets/images/productImg1.png'), qty: 2},
          ],
          pickedUp: false,
        },
        {
          id: '2345',
          chef: 'Chef Anna’s Kitchen',
          status: 'CANCELED',
          userType: 'chef',
          paymentMethod: 'Venmo',
          rating: 5.0,
          ratingCount: 2,
          refundStatus: 'completed',
          price: 22.0,
          items: [
            {image: require('../../../assets/images/productImg1.png'), qty: 2},
          ],
          pickedUp: false,
        },
      ],
    },
  ];

  const handleFilterChange = status => {
    console.log('Selected filter:', status);
  };

  const getFilteredOrders = () => {
    if (activeStatus === 'All') return ordersData;

    return ordersData
      .map(section => {
        const filteredData = section.data.filter(order =>
          order.status.toLowerCase().includes(activeStatus.toLowerCase()),
        );
        if (filteredData.length > 0) {
          return {...section, data: filteredData};
        }
        return null;
      })
      .filter(section => section !== null);
  };

  const filteredOrders = getFilteredOrders();

  return (
    <SafeAreaView style={styles.wrapper}>
      <SecondaryHeader
        title="Orders"
        // icon1={ICONS.searchIcon}
        icon2={ICONS.cartIcon}
        onPress1={() => {}}
        onPress2={() => {}}
      />
      {ordersData.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: -80,
          }}>
          <Image
            source={ICONS.listIcon}
            style={{
              width: 80,
              height: 90,
            }}
          />

          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.text}>No order yet</Text>
            <ButtonBox label="Start ordering" />
          </View>
        </View>
      ) : (
        <>
          <OrderCategory
            statuses={statuses}
            onFilterChange={handleFilterChange}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
          />
          <View style={{flex: 1, backgroundColor: COLORS.neutral[100]}}>
            <OrderCard ordersData={filteredOrders} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default OrderListScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
  text: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[600],
    fontSize: 18,
    fontStyle: 'normal',
    lineHeight: 24,
    marginBottom: 8,
  },
});
