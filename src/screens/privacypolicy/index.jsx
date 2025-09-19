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
import {useGetPrivacyPolicyQuery} from '../../services/api';
import RenderHtml from 'react-native-render-html';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';

const PrivacyPolicyScreen = () => {
  const {
    data: getPrivacyPolicy,
    refetch,
    isFetching,
    error,
    isLoading,
  } = useGetPrivacyPolicyQuery();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await refetch();
      };
      fetchData();
    }, []),
  );

  console.log('getTermsOfService ---->>>', getPrivacyPolicy, error);

  const updatedAt = getPrivacyPolicy?.data?.updatedAt
    ? moment(getPrivacyPolicy.data.updatedAt).format('MMMM DD, YYYY')
    : null;

  const html = getPrivacyPolicy?.data?.html_content ?? '';
  console.log('html ----->>>>', html);

  const {width} = useWindowDimensions();

  return (
    <SafeAreaView style={{flex: 1}}>
      <PrimaryHeader title="Privacy Policy" />
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
});

export default PrivacyPolicyScreen;
