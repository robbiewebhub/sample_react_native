import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import SecondaryHeader from '../../../components/header/SecondaryHeader';
import SearchBar from '../../../components/searchbar';
import SwitchBox from '../../../components/switchbox';
import {COLORS, FONTS, ICONS} from '../../../constant';
import {navigate} from '../../../utils/navigations';
import ButtonBox from '../../../components/button';
import {
  imageBaseUrl,
  useGetUserMenuQuery,
  useToggleMenuEnabledMutation,
  useUpdateMenuServingMutation,
} from '../../../services/api';
import FastImage from 'react-native-fast-image';

const TABS = ['All', 'Active', 'Hide'];

export default function MenuScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const {
    data: getUserMenu,
    refetch: refetchUserMenu,
    isLoading,
  } = useGetUserMenuQuery();

  const [toggleMenuEnabled, {isLoading: isToggling}] =
    useToggleMenuEnabledMutation();

  const [updateMenuServing, {isLoading: isSaving}] =
    useUpdateMenuServingMutation();

  const [menuData, setMenuData] = useState([]);
  const [isUpdateServe, setIsUpdateServe] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [togglingId, setTogglingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const userMenu = getUserMenu?.data ?? [];

  useFocusEffect(
    useCallback(() => {
      refetchUserMenu();
      return undefined;
    }, []),
  );

  // normalize API → UI shape
  useEffect(() => {
    if (userMenu.length) {
      const transformed = userMenu.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: typeof item.price === 'number' ? item.price.toFixed(2) : '0.00',
        serving: item?.serving != null ? String(item?.serving) : '0',
        statusText: item.status,
        is_menu_enabled: !!item.is_menu_enabled,
        userId: item.userId,
        kitchenId: item.kitchenId,
        ingredient: item.ingredient,
        short_description: item.short_description,
        diet_type: item.diet_type,
        cuisine_type: item.cuisine_type,
        portion_size: item.portion_size,
        prep_time: item.prep_time,
        allergens: item.allergens,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        start_time: item.start_time,
        end_time: item.end_time,
      }));
      setMenuData(transformed);
    } else {
      setMenuData([]);
    }
  }, [userMenu]);

  // filter by tab selection using the enabled flag
  const filteredData = useMemo(() => {
    if (selectedTab === 'Active')
      return menuData.filter(i => i.is_menu_enabled);
    if (selectedTab === 'Hide') return menuData.filter(i => !i.is_menu_enabled);
    return menuData;
  }, [menuData, selectedTab]);

  // const onToggleEnabled = indexInFiltered => {
  //   // translate filtered index → original index
  //   const itemId = filteredData[indexInFiltered].id;
  //   const srcIndex = menuData.findIndex(x => x.id === itemId);
  //   if (srcIndex === -1) return;

  //   const newData = [...menuData];
  //   newData[srcIndex] = {
  //     ...newData[srcIndex],
  //     is_menu_enabled: !newData[srcIndex].is_menu_enabled,
  //   };
  //   setMenuData(newData);
  // };

  // --- call API with optimistic update ---
  const onToggleEnabled = async indexInFiltered => {
    const itemId = filteredData[indexInFiltered].id;
    const srcIndex = menuData.findIndex(x => x.id === itemId);
    if (srcIndex === -1) return;

    const prev = menuData[srcIndex].is_menu_enabled;

    // optimistic UI
    setMenuData(list => {
      const copy = [...list];
      copy[srcIndex] = {...copy[srcIndex], is_menu_enabled: !prev};
      return copy;
    });

    setTogglingId(itemId);
    try {
      await toggleMenuEnabled({id: itemId, is_menu_enabled: !prev}).unwrap();
      await refetchUserMenu();
    } catch (e) {
      // revert on failure
      setMenuData(list => {
        const copy = [...list];
        copy[srcIndex] = {...copy[srcIndex], is_menu_enabled: prev};
        return copy;
      });
      console.warn('Failed to update enabled state', e);
    } finally {
      setTogglingId(null);
    }
  };

  const RenderItem = ({item, index}) => {
    const [editToday, setEditToday] = useState(false);
    const [draftServing, setDraftServing] = useState(
      String(item.serving ?? '0'),
    );

    // Reset the draft when entering edit mode or when item.serving changes
    useEffect(() => {
      if (editToday) setDraftServing(String(item.serving ?? '0'));
    }, [editToday, item.serving]);

    const handleServingChange = async (idxInFiltered, value) => {
      const itemId = filteredData[idxInFiltered].id;
      const srcIndex = menuData.findIndex(x => x.id === itemId);
      if (srcIndex === -1) return;

      const clean = String(value).replace(/[^\d]/g, '');
      const nextServing = clean.length ? Number(clean) : 0;

      const prevServing = menuData[srcIndex].serving;

      // optimistic UI
      setMenuData(list => {
        const copy = [...list];
        copy[srcIndex] = {...copy[srcIndex], serving: String(nextServing)};
        return copy;
      });

      setSavingId(itemId);
      try {
        await updateMenuServing({id: itemId, serving: nextServing}).unwrap();
        await refetchUserMenu();
        setEditToday(false);
      } catch (e) {
        setMenuData(list => {
          const copy = [...list];
          copy[srcIndex] = {...copy[srcIndex], serving: prevServing};
          return copy;
        });
        console.warn('Failed to save serving', e);
      } finally {
        setSavingId(null);
      }
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigate('MenuDishScreen', {menuItem: item})}>
        {/* <BlastedImage
          source={{uri: `${imageBaseUrl}${item.image?.[0]}`}}
          style={styles.cardImg}
          width={100}
          height={100}
        /> */}
        <FastImage
          source={{uri: `${imageBaseUrl}${item.image?.[0]}`}}
          style={styles.cardImg}
        />

        <View style={{flex: 1, gap: 4}}>
          <Text style={styles.cardTtl}>{item.name}</Text>
          <Text style={styles.cardTxt}>{item.price}</Text>

          {item.is_menu_enabled ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              {editToday ? (
                <>
                  <TextInput
                    value={draftServing}
                    onChangeText={setDraftServing}
                    keyboardType="numeric"
                    blurOnSubmit={false}
                    returnKeyType="done"
                    selectionColor={COLORS.primary[300]}
                    onSubmitEditing={() =>
                      handleServingChange(index, draftServing)
                    }
                    style={{
                      width: 60,
                      height: 30,
                      textAlignVertical: 'center',
                      paddingVertical: 0,
                      paddingHorizontal: 10,
                      borderWidth: 1,
                      borderColor: COLORS.neutral[200],
                      borderRadius: 64,
                      backgroundColor: 'white',
                    }}
                  />

                  <TouchableOpacity
                    style={[styles.btn, {backgroundColor: COLORS.primary[50]}]}
                    onPress={() => setEditToday(false)}>
                    <Image
                      source={ICONS.closeIcon}
                      style={styles.btnIcon}
                      tintColor={COLORS.primary[300]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btn}
                    disabled={savingId === item.id || isSaving}
                    onPress={() => handleServingChange(index, draftServing)}>
                    {savingId === item.id ? (
                      <ActivityIndicator
                        size="small"
                        color={COLORS.common.white}
                      />
                    ) : (
                      <Image
                        source={ICONS.tickIcon}
                        style={styles.btnIcon}
                        tintColor={COLORS.common.white}
                      />
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.cardTxt}>Servings today:</Text>
                  <Text
                    style={[
                      styles.cardTxt,
                      {
                        fontFamily: FONTS.poppins[500],
                        color: COLORS.neutral[900],
                      },
                    ]}>
                    {item.serving}
                  </Text>
                  <TouchableOpacity onPress={() => setEditToday(true)}>
                    <Image
                      source={ICONS.editIcon}
                      style={{width: 20, height: 20}}
                      tintColor={COLORS.primary[300]}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : null}

          {item.start_time ? (
            <Text style={styles.cardTime}>
              {item.start_time} - {item.end_time}
            </Text>
          ) : null}
        </View>

        {!editToday ? (
          <SwitchBox
            isIcon
            status={item.is_menu_enabled}
            disabled={togglingId === item.id || isToggling}
            onToggle={() => onToggleEnabled(index)}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, paddingBottom: tabBarHeight}}>
      <SecondaryHeader
        title="Today's menu"
        icon2={menuData?.length ? ICONS.addIcon : undefined}
        onPress2={() => navigate('ManageDishScreen', {isEdit: false})}
      />

      {isLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.primary[300]} />
        </View>
      ) : menuData?.length === 0 ? (
        <View style={{flex: 1, alignItems: 'center', marginTop: 100}}>
          <Image
            source={ICONS.dairyIcon}
            style={styles.icon}
            tintColor={COLORS.neutral[200]}
          />
          <Text style={styles.title}>No dishes yet</Text>
          <View style={{marginVertical: 16}}>
            <ButtonBox
              label="Add items"
              onPress={() => navigate('ManageDishScreen', {isEdit: false})}
            />
          </View>
        </View>
      ) : (
        <View style={{paddingHorizontal: 16, flex: 1}}>
          <View style={{marginBottom: 8}}>
            <SearchBar placeholder="Search your dishes" />
          </View>

          <View style={{flex: 1, gap: 4}}>
            <View style={{flexDirection: 'row', gap: 4}}>
              {TABS.map(tab => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setSelectedTab(tab)}
                  style={[
                    styles.tab,
                    {
                      borderBottomColor:
                        selectedTab === tab
                          ? COLORS.primary[300]
                          : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.tabText,
                      {
                        color:
                          selectedTab === tab
                            ? COLORS.primary[300]
                            : COLORS.neutral[400],
                        fontFamily:
                          selectedTab === tab
                            ? FONTS.poppins[500]
                            : FONTS.poppins[400],
                      },
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredData}
              keyExtractor={item => String(item.id)}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              renderItem={({item, index}) => (
                <RenderItem item={item} index={index} />
              )}
              contentContainerStyle={{gap: 16, paddingVertical: 20}}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[500],
  },
  text: {
    color: COLORS.neutral[900],
    fontSize: 16,
    fontFamily: FONTS.poppins[400],
  },
  tab: {
    borderBottomWidth: 2,
    flex: 1,
    minHeight: 32,
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    gap: 8,
  },
  cardImg: {
    borderRadius: 8,
    width: 100,
    height: 100,
    flexShrink: 0,
  },
  cardTtl: {
    color: COLORS.neutral[900],
    fontSize: 14,
    fontFamily: FONTS.poppins[500],
  },
  cardTxt: {
    color: COLORS.neutral[600],
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
  },
  cardTime: {
    color: COLORS.primary[100],
    fontSize: 12,
    fontFamily: FONTS.poppins[500],
    marginTop: 'auto',
  },
  inputFeild: {
    width: 62,
    height: 35,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
    borderRadius: 64,
    fontSize: 14,
    fontFamily: FONTS.poppins[400],
    color: COLORS.neutral[900],
    paddingHorizontal: 16,
  },
  btn: {
    alignItems: 'center',
    borderRadius: 32,
    backgroundColor: COLORS.primary[300],
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  btnIcon: {
    width: 16,
    height: 16,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.neutral[900],
    fontSize: 18,
    fontFamily: FONTS.poppins[600],
    textAlign: 'center',
  },
});
