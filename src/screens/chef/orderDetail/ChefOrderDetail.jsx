import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRef} from 'react';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {COLORS, FONTS, ICONS} from '../../../constant';
import {goBack, navigate} from '../../../utils/navigations';
import ButtonBox from '../../../components/button';
import RequestRefundModal from '../../../components/order/RequestRefundModal';

const steps = [
  'Order received',
  'Preparing',
  'Cooking',
  'Ready for pickup',
  'Completed',
];

const ChefOrderDetail = ({route}) => {
  const {item} = route?.params || {};
  console.log('routes--->>', item);

  const activeStep = 0;
  const requestRefundRef = useRef(null);

  return (
    <SafeAreaView style={styles.wrapper}>
      <PrimaryHeader
        icon={ICONS.leftArrowIcon}
        title="Orders Details"
        onPress={() => goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 16, paddingBottom: 16 }}>
        <Text style={styles.text}>
          You’ve received a new order — accept to prepare!
        </Text>
        <View style={styles.containerBox}>
          <View style={styles.headerRow}>
            <Text style={styles.dateText}>Fri, Apr 04, 2025</Text>
          </View>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View
                style={[
                  styles.circle,
                  {
                    borderWidth: index === activeStep ? 0 : 2,
                    backgroundColor:
                      index === activeStep
                        ? COLORS.success[300]
                        : COLORS.common.white,
                  },
                ]}>
                {index === activeStep && (
                  <Image
                    source={ICONS.tickIcon}
                    style={{width: 14, height: 14}}
                  />
                )}
              </View>
              {index < steps.length - 1 && <View style={styles.stepLine} />}
              <View style={styles.stepTextLayout}>
                <Text
                  style={[
                    styles.stepText,
                    {
                      color:
                        index <= activeStep
                          ? COLORS.neutral[900]
                          : COLORS.neutral[400],
                    },
                  ]}>
                  {step}
                </Text>
                {index === activeStep && (
                  <Text style={styles.timeText}>04:51 PM</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.text}>Buyer info</Text>
        <View style={styles.containerBox}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '75%', flexDirection: 'row'}}>
              <Image
                source={require('../../../assets/images/userImg1.png')}
                style={{width: 44, height: 44}}
              />
              <View style={{marginLeft: 8}}>
                <Text style={styles.kitchenName}>Amelia Chu</Text>
                <View style={styles.metaRow}>
                  <Image source={ICONS.starIcon} style={styles.ratingIcon} />
                  <Text style={styles.infoText}> 5.0 (2)</Text>
                </View>
              </View>
            </View>
            <View style={{width: '25%'}}>
              <TouchableOpacity style={styles.chatIconView}>
                <Image
                  source={require('../../../assets/icons/chatIcon.png')}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.text}>Item info</Text>
        <View style={styles.containerBox}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '75%', flexDirection: 'row'}}>
              <View style={styles.imageRow}>
                <View style={styles.itemImageWrapper}>
                  <Image
                    source={require('../../../assets/images/productImg1.png')}
                    style={styles.itemImage}
                  />
                  <View style={styles.qtyView}>
                    <Text style={styles.qtyText}>x2</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.kitchenName}>Strawberry Pancake</Text>
                <View style={styles.metaRow}>
                  <Image source={ICONS.starIcon} style={styles.ratingIcon} />
                  <Text style={styles.infoText}> $11.00 * 2 Qty</Text>
                </View>
              </View>
            </View>
            <View style={{width: '25%', alignItems: 'flex-end'}}>
              <Text style={styles.kitchenName}>$22.00</Text>
            </View>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={{width: '75%', flexDirection: 'row'}}>
              <View style={styles.imageRow}>
                <View style={styles.itemImageWrapper}>
                  <Image
                    source={require('../../../assets/images/productImg1.png')}
                    style={styles.itemImage}
                  />
                  <View style={styles.qtyView}>
                    <Text style={styles.qtyText}>x2</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.kitchenName}>Strawberry Pancake</Text>
                <View style={styles.metaRow}>
                  <Image source={ICONS.starIcon} style={styles.ratingIcon} />
                  <Text style={styles.infoText}> $11.00 * 2 Qty</Text>
                </View>
              </View>
            </View>
            <View style={{width: '25%', alignItems: 'flex-end'}}>
              <Text style={styles.kitchenName}>$22.00</Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLORS.neutral[75],
              padding: 16,
              borderRadius: 8,
              marginBottom: 12,
            }}>
            <Text style={styles.dateText}>No utensils, no scallion, thx</Text>
          </View>

          <View style={styles.divider} />
          <View style={styles.detailsLayout}>
            <Text style={[styles.kitchenName, {marginTop: 8}]}>
              Amount paid
            </Text>
            <Text style={[styles.kitchenName, {marginTop: 8, fontSize: 18}]}>
              $22.00
            </Text>
          </View>
        </View>

        <Text style={styles.text}>Order details</Text>
        <View style={styles.containerBox}>
          <View style={styles.detailsLayout}>
            <Text style={styles.stepText}>Order#</Text>
            <Text style={styles.stepText}>2345</Text>
          </View>
          <View style={styles.detailsLayout}>
            <Text style={styles.stepText}>Order total</Text>
            <Text style={styles.stepText}>$22.00</Text>
          </View>
          <View style={styles.detailsLayout}>
            <Text style={styles.stepText}>Order date</Text>
            <Text style={styles.stepText}>Fri 04/04/2025</Text>
          </View>
          <View style={styles.detailsLayout}>
            <Text style={styles.stepText}>Payment method</Text>
            <Text style={styles.stepText}>Venmo</Text>
          </View>
        </View>

        {!item?.isRated ? (
          <View style={{marginTop: 36}}>
            <ButtonBox
              label="Rate the buyer"
              onPress={() =>
                navigate('ChefRateOrder', {...item, isReviewed: false})
              }
            />
          </View>
        ) : (
          <View style={styles.buttonAlignment}>
            <ButtonBox
              label="Cancel"
              outline
              customStyle={{width: '48%'}}
              onPress={() => {}}
            />
            <ButtonBox label="Confirm" customStyle={{width: '48%'}} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChefOrderDetail;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  text: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 18,
    lineHeight: 24,
    marginVertical: 12,
  },
  containerBox: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D1D1',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateText: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    lineHeight: 16,
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    lineHeight: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderColor: COLORS.neutral[200],
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  stepLine: {
    position: 'absolute',
    left: 8,
    top: 24,
    height: 16,
    width: 2,
    backgroundColor: COLORS.neutral[200],
    zIndex: 0,
  },
  stepTextLayout: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stepText: {
    color: COLORS.neutral[900],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    lineHeight: 16,
    marginVertical: 8,
  },
  chatIconView: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary[50],
    borderRadius: 999,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kitchenName: {
    color: COLORS.neutral[900],
    fontFamily: FONTS.poppins[500],
    fontSize: 16,
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
  infoText: {
    color: COLORS.neutral[600],
    fontSize: 12,
    fontFamily: FONTS.poppins[400],
    lineHeight: 16,
  },
  detailsLayout: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
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
  divider: {
    borderBottomColor: COLORS.neutral[100],
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  buttonAlignment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 36,
  },
});
