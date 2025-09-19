import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useMemo} from 'react';
import PrimaryHeader from '../../../components/header/PrimaryHeader';
import {navigate} from '../../../utils/navigations';
import {COLORS, FONTS, ICONS} from '../../../constant';
import CategoryPills from '../../../components/categories/CategoryPills';

const helpList = [
  {
    id: 1201,
    categoryName: 'Popular Questions',
    question: 'How to request a refund through the app?',
    answer:
      "Go to your order history, select the order you wish to refund, and tap on 'Request Refund'. Follow the on-screen instructions to complete your request.",
  },
  {
    id: 1202,
    categoryName: 'Popular Questions',
    question: 'How to add dishes to an order?',
    answer:
      "On the login screen, tap 'Forgot Password'. Enter your registered email address, and you'll receive a reset link in your inbox.",
  },
  {
    id: 1203,
    categoryName: 'Popular Questions',
    question: 'Can I modify/cancel/add a tip?',
    answer:
      "Navigate to 'Profile' > 'Addresses' and tap 'Edit' to update or add a new delivery address.",
  },
  {
    id: 1204,
    categoryName: 'Popular Questions',
    question: 'How to get an invioce?',
    answer:
      'We accept credit cards, debit cards, UPI, and major digital wallets for all orders placed through the app.',
  },
  {
    id: 1301,
    categoryName: 'Order Inquiry',
    question: 'How to get an invioce?',
    answer:
      "Go to 'My Orders' from the main menu. Each order will display its current status, such as processing, shipped, or delivered.",
  },
  {
    id: 1302,
    categoryName: 'Order Inquiry',
    question: 'How to get an invioce?',
    answer:
      "Orders can be modified within 15 minutes of placement from the 'My Orders' section, as long as they haven’t been processed for shipping.",
  },
  {
    id: 1303,
    categoryName: 'Order Inquiry',
    question: 'How to get an invioce?',
    answer:
      "Once your order ships, you'll receive a tracking link by email and in the app's 'My Orders' section.",
  },
  {
    id: 1304,
    categoryName: 'Order Inquiry',
    question: 'How to get an invioce?',
    answer:
      'Orders may be cancelled due to payment failure, stock unavailability, or verification issues. Please check your email for specific details.',
  },
  {
    id: 1401,
    categoryName: 'Mail Order',
    question: 'How to get an invioce?',
    answer:
      'Download and print the mail order form from our website. Fill in your details and mail it along with payment to our address.',
  },
  {
    id: 1402,
    categoryName: 'Mail Order',
    question: 'How to get an invioce?',
    answer:
      'We accept bank drafts, money orders, and personal checks for mail orders. Please do not send cash.',
  },
];

const OptionCard = ({item}) => {
  return (
    <TouchableOpacity
      key={item.id}
      style={styles.button}
      onPress={() => navigate('QuestionScreen', {...item})}>
      <Text style={styles.buttonText}>{item.question}</Text>
      <Image
        source={ICONS.leftArrowIcon}
        style={[styles.buttonIcon, {transform: [{rotateY: '180deg'}]}]}
      />
    </TouchableOpacity>
  );
};

export default function FAQScreen() {
  const [activeStatus, setActiveStatus] = React.useState('');

  const handleFilterChange = status => {
    setActiveStatus(status);
  };

  const filteredHelpList = useMemo(
    () => helpList.filter(item => {
        if(activeStatus === '') return true;
        return (item.categoryName === activeStatus)
    }),
    [activeStatus],
  );

  return (
    <View style={{flex: 1}}>
      <PrimaryHeader title="FAQ" />
      <FlatList
        data={filteredHelpList}
        renderItem={({item}) => <OptionCard key={item.id} item={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={{padding: 16, gap: 8, paddingTop: 0}}
        ListHeaderComponent={() => (
          <CategoryPills
            pills={[...new Set(helpList.map(item => item.categoryName))]}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            onFilterChange={handleFilterChange}
            style={{marginVertical: 8}}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: COLORS.neutral[200],
    gap: 8,
    flexDirection: 'row',
    padding: 16,
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
});
