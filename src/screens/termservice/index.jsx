import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback} from 'react';
import PrimaryHeader from '../../components/header/PrimaryHeader';
import {COLORS, FONTS} from '../../constant';
import {SafeAreaView} from 'react-native-safe-area-context';
import RenderHtml from 'react-native-render-html';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {useGetTermsOfServiceQuery} from '../../services/api';
import FullScreenLoader from '../../components/loader/FullScreenLoader';

const data = [
  {
    id: 1,
    title: '1. Acceptance of Terms',
    text: 'By downloading, installing, accessing, or using [Your Mobile Application Name] (the "App"), provided by [Your Company Name] ("we," "us," or "our"), you ("you" or "User") agree to be bound by these Terms of Service (the "Terms"). If you do not agree to these Terms, do not download, install, access, or use the App.',
  },
  {
    id: 2,
    title: '2. Description of the App',
    text: '[Provide a brief, general description of what your app does. For example: "The App provides users with [briefly describe main functionality]."]',
  },
  {
    id: 3,
    title: '3. User Accounts (If Applicable)',
    text: '[If your app requires user accounts, include a section like this. Otherwise, you can delete it.]',
    list: [
      {
        id: '3.1',
        label:
          'You may be required to create an account to access certain features of the App.',
      },
      {
        id: '3.2',
        label:
          'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      },
      {
        id: '3.3',
        label:
          'You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.',
      },
      {
        id: '3.4',
        label:
          'We reserve the right to suspend or terminate your account if we suspect any unauthorized access or use.',
      },
    ],
  },
  {
    id: 4,
    title: '4. User Conduct',
    text: 'You agree not to:',
    list: [
      {
        id: '4.1',
        label: 'Use the App for any unlawful purpose.',
      },
      {
        id: '4.2',
        label:
          "Transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.",
      },
      {
        id: '4.3',
        label:
          'Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.',
      },
      {
        id: '4.4',
        label:
          'Interfere with or disrupt the operation of the App or the servers or networks used to make the App available.',
      },
      {
        id: '4.5',
        label:
          'Attempt to gain unauthorized access to any portion or feature of the App, or any other systems or networks connected to the App.',
      },
      {
        id: '4.6',
        label:
          'Modify, adapt, translate, reverse engineer, decompile, or disassemble any portion of the App.',
      },
      {
        id: '4.7',
        label:
          'Remove any copyright, trademark, or other proprietary rights notices contained in or on the App.',
      },
      {
        id: '4.8',
        label:
          'Use any robot, spider, site search/retrieval application, or other automated device, process, or means to access, retrieve, scrape, or index any portion of the App or any content therein.',
      },
    ],
  },
];

const TermsServiceScreen = () => {
  const {
    data: getTermsOfService,
    refetch,
    isFetching,
    error,
    isLoading,
  } = useGetTermsOfServiceQuery();

  console.log('getTermsOfService ---->>>', getTermsOfService, error);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch();
      };
      fetchData();
    }, []),
  );

  const updatedAt = getTermsOfService?.data?.updatedAt
    ? moment(getTermsOfService.data.updatedAt).format('MMMM DD, YYYY')
    : null;

  const html = getTermsOfService?.data?.html_content ?? '';
  console.log('html ----->>>>', html);

  const {width} = useWindowDimensions();

  return (
    <SafeAreaView style={{flex: 1}}>
      <PrimaryHeader title="Terms of Service" />

      <ScrollView style={styles.wrapper} showsVerticalScrollIndicator={false}>
        {isFetching ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
            }}>
            <ActivityIndicator color={COLORS.common.black} size={'small'} />
          </View>
        ) : (
          <View style={{gap: 16}}>
            {updatedAt && (
              <Text style={styles.updateText}>Last Updated: {updatedAt}</Text>
            )}

            <RenderHtml
              contentWidth={width}
              source={{html}}
              /* 1) Set your global defaults */
              baseStyle={{
                color: COLORS.neutral[900],
                fontFamily: FONTS.poppins[400],
                fontSize: 14,
              }}
              /* 2) Tell the renderer which custom fonts exist */
              systemFonts={[
                FONTS.poppins[400],
                FONTS.poppins[500],
                FONTS.poppins[600],
                'System',
              ]}
              /* 3) Style HTML tags explicitly */
              tagsStyles={{
                h1: {
                  color: COLORS.primary[300],
                  fontSize: 14,
                  fontFamily: FONTS.poppins[500],
                  marginBottom: 8,
                },
                h2: {
                  color: COLORS.primary[300],
                  fontSize: 12,
                  fontFamily: FONTS.poppins[500],
                  marginBottom: 8,
                },
                h3: {
                  color: COLORS.primary[300],
                  fontSize: 10,
                  fontFamily: FONTS.poppins[500],
                  marginBottom: 8,
                },
                p: {
                  color: COLORS.neutral[900],
                  fontSize: 14,
                  fontFamily: FONTS.poppins[400],
                  lineHeight: 22,
                },
                strong: {
                  fontFamily: FONTS.poppins[600],
                },
                a: {
                  color: COLORS.primary[500],
                  textDecorationLine: 'underline',
                },
                li: {
                  fontFamily: FONTS.poppins[400],
                  fontSize: 14,
                  color: COLORS.neutral[900],
                },
              }}
              /* 4) Map specific HTML classes from your CMS to RN styles (optional) */
              classesStyles={{
                'text-token-text-primary': {color: COLORS.neutral[900]},
              }}
              /* 5) Ensure inline styles like color are permitted */
              allowedStyles={[
                'color',
                'fontWeight',
                'backgroundColor',
                'textDecorationLine',
              ]}
              /* (Optional) Strip layout-heavy wrappers if needed */
              domVisitors={{
                onElement: el => {
                  // neutralize oversized inline widths from pasted HTML if any
                  if (el.attribs?.style?.includes('max-width')) {
                    el.attribs.style = el.attribs.style.replace(
                      /max-width:[^;]+;?/g,
                      '',
                    );
                  }
                },
              }}
              /* Fixed-width prefix so wrapped lines align */
              listsPrefixesRenderers={{
                ul: (_a, _c, _s, {key}) => (
                  <View key={key} style={{width: 22, alignItems: 'center'}}>
                    <View
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 3,
                        backgroundColor: COLORS.primary[500],
                        marginTop: 8,
                      }}
                    />
                  </View>
                ),
                ol: (_a, _c, _s, {index, key}) => (
                  <Text
                    key={key}
                    style={{
                      width: 22,
                      textAlign: 'right',
                      marginRight: 6,
                      color: COLORS.primary[500],
                      fontFamily: FONTS.poppins[600],
                    }}>
                    {index + 1}.
                  </Text>
                ),
              }}
              /* Make RNHTML reserve the same gutter width for wrapped lines */
              renderersProps={{
                ul: {markerTextStyle: {width: 22}},
                ol: {markerTextStyle: {width: 22}},
              }}
            />
            {/* {data.map(item => (
            <View style={{gap: 8}} key={item.id}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
              {item.list ? (
                <View>
                  {item.list.map(child => (
                    <View
                      key={child.id}
                      style={{
                        flexDirection: 'row',
                        gap: 10,
                        paddingLeft: 9,
                      }}>
                      <View style={styles.dot} />
                      <Text style={[styles.text, {flex: 1}]}>
                        {child.label}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ))} */}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  updateText: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  title: {
    color: COLORS.primary[300],
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  text: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  dot: {
    borderRadius: 3,
    backgroundColor: COLORS.neutral[900],
    width: 3,
    height: 3,
    marginTop: 9,
  },
});

export default TermsServiceScreen;
