import React, {useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTS, ICONS, IMAGES} from '../../constant';
import ButtonBox from '../button';
import CustomModal from '../customModal';
import InputField from '../inputfield';

const paymentMethods = [
  {
    id: 1101,
    method: 'PayPal',
  },
  {
    id: 1102,
    method: 'Venmp',
  },
  {
    id: 1103,
    method: 'Zelle',
  },
];

const issues = [
  'Cook unresponsive',
  'Change of plans',
  'Delayed beyond pickup time',
];

const foodItems = [
  {
    id: 1,
    name: 'Strawberry Pancake',
    price: 11,
    quantity: 2,
    image: IMAGES.productImg1,
  },
];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const RequestSendModal = ({openRef, parentRef}) => {
  const handleRequestSend = () => {
    openRef.current.close();
    parentRef.current.close();
  };
  return (
    <CustomModal openRef={openRef}>
      <View style={{gap: 8}}>
        <View style={{alignItems: 'center', gap: 24}}>
          <View style={styles.imgContainer}>
            <Image
              source={ICONS.sendPinkIcon}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          <Text
            style={
              styles.backSoonText
            }>{`Your request has been sent. You\'ll hear back soon!`}</Text>
        </View>
        <ButtonBox
          label="Close"
          onPress={handleRequestSend}
          customStyle={{marginVertical: 16}}
        />
      </View>
    </CustomModal>
  );
};

const PaymentRefundModal = ({openRef}) => {
  const requestSendRef = useRef(null);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [account, setAccount] = useState('');

  const handleRequestSend = () => {
    requestSendRef.current.present();
  };

  const isSubmitEnabled = selectedMethodId !== null && account.trim() !== '';

  return (
    <CustomModal openRef={openRef} title="Request Refund">
      <View style={{gap: 16}}>
        <Text style={styles.text}>
          Your payment will be returned through the method you chose once the
          cook approves and confirms the refund.
        </Text>
        <View style={styles.cardsWrapper}>
          {paymentMethods.map(item => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                selectedMethodId === item.id && {
                  borderColor: COLORS.neutral.black,
                },
              ]}
              onPress={() => setSelectedMethodId(item.id)}>
              <Text style={styles.cardText}>{item.method}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <InputField
          placeholder="Your account"
          value={account}
          onChangeText={setAccount}
        />
        <ButtonBox
          label="Submit Refund Request"
          disabled={!isSubmitEnabled}
          onPress={handleRequestSend}
          customStyle={{marginVertical: 16}}
        />
      </View>
      <RequestSendModal openRef={requestSendRef} parentRef={openRef} />
    </CustomModal>
  );
};

export default function RequestRefundModal({openRef}) {
  const requestSendRef = useRef(null);

  const [selectedIssues, setSelectedIssues] = useState([]);
  const [feedback, setFeedback] = useState('');

  const toggleIssue = issue => {
    const issueTag = `#${issue}`;
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(prev => prev.filter(i => i !== issue));
      setFeedback(fb =>
        fb
          .replace(new RegExp(`\\s*${escapeRegExp(issueTag)}\\b`, 'g'), '')
          .trim(),
      );
    } else {
      setSelectedIssues(prev => [...prev, issue]);
      setFeedback(fb =>
        fb.includes(issueTag) ? fb : (fb ? fb + ' ' : '') + issueTag,
      );
    }
  };

  const onFeedbackChange = text => {
    setFeedback(text);
    const foundIssues = issues.filter(issue =>
      new RegExp(`#${escapeRegExp(issue)}\\b`, 'i').test(text),
    );
    setSelectedIssues(foundIssues);
  };

  const handleRequestSend = () => {
    openRef.current.close();
    setTimeout(() => {
      requestSendRef.current.present();
    }, 350);
  };

  return (
    <CustomModal openRef={openRef} title="Request Refund">
      <View style={{gap: 16}}>
        <View style={styles.itemContainer}>
          {foodItems.map(item => (
            <View style={styles.foodItem} key={item.id}>
              <View style={styles.itemImageWrapper}>
                <Image
                  source={item.image}
                  style={styles.foodImage}
                  resizeMode="cover"
                />
                {item.quantity > 1 && (
                  <View style={styles.qtyView}>
                    <Text style={styles.qtyText}>X{item.quantity}</Text>
                  </View>
                )}
              </View>

              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>{item.name}</Text>
                <Text
                  style={
                    styles.foodPrice
                  }>{`$${item.price}.00 * ${item.quantity} Qty`}</Text>
              </View>
              <Text style={[styles.foodTitle]}>{`$${
                item.price * item.quantity
              }.00`}</Text>
            </View>
          ))}
          <View style={styles.lineSeparator} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.foodTitle}>Total refund amount</Text>
            <Text style={[styles.foodTitle, {fontSize: 16}]}>$22.00</Text>
          </View>
        </View>
        <Text style={styles.subTitleText}>What happened with your order?</Text>
        <View style={styles.tagsWrapper}>
          {issues.map((issue, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => toggleIssue(issue)}>
              <Text
                style={[
                  styles.tagText,
                  selectedIssues.includes(issue) && styles.tagTextSelected,
                ]}>
                {issue}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{gap: 4}}>
          <TextInput
            editable
            placeholder="Describe what happened..."
            multiline
            value={feedback}
            onChangeText={onFeedbackChange}
            style={styles.textArea}
            placeholderTextColor={COLORS.neutral[300]}
            maxLength={500}
          />
          <Text style={styles.charCount}>{feedback.length}/500</Text>
        </View>
        <ButtonBox
          label="Continue"
          disabled={selectedIssues.length === 0}
          onPress={handleRequestSend}
          customStyle={{marginVertical: 16}}
          rightIcon={ICONS.rightArrowIcon}
        />
      </View>
      <PaymentRefundModal openRef={requestSendRef} parentRef={openRef} />
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  lineSeparator: {
    height: 1,
    backgroundColor: COLORS.neutral[100],
  },
  itemContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    padding: 16,
    gap: 16,
  },
  text: {
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
    color: COLORS.neutral[500],
  },
  subTitleText: {
    fontFamily: FONTS.poppins[500],
    fontSize: 16,
    color: COLORS.neutral[900],
  },
  backSoonText: {
    fontFamily: FONTS.poppins[500],
    fontSize: 16,
    color: COLORS.neutral[900],
    textAlign: 'center',
    width: '65%',
  },
  cardsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  cardText: {
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    color: COLORS.neutral[900],
    textAlign: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    padding: 10,
  },
  imgContainer: {width: 100, height: 100},
  img: {width: '100%', height: '100%'},
  textArea: {
    borderColor: COLORS.neutral[300],
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: FONTS.poppins[400],
    fontSize: 14,
    color: COLORS.neutral[900],
  },
  charCount: {
    color: COLORS.neutral[500],
    fontSize: 12,
    alignSelf: 'flex-start',
    fontFamily: FONTS.poppins[500],
    color: COLORS.neutral[500],
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.neutral[75],
  },
  tagText: {
    fontFamily: FONTS.poppins[400],
    fontSize: 12,
    color: COLORS.neutral[600],
  },
  tagTextSelected: {
    color: COLORS.neutral[900],
  },
  foodItem: {
    flexDirection: 'row',
  },
  foodImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  itemImageWrapper: {
    position: 'relative',
  },
  foodInfo: {
    flex: 1,
    position: 'relative',
  },
  foodTitle: {
    fontFamily: FONTS.poppins[500],
    fontSize: 14,
    color: COLORS.neutral[900],
  },
  foodPrice: {
    fontFamily: FONTS.poppins[400],
    fontSize: 12,
    color: COLORS.neutral[500],
  },
  qtyView: {
    position: 'absolute',
    bottom: -8,
    right: 8,
    backgroundColor: COLORS.neutral.black,
    paddingHorizontal: 6,
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
  },
});
