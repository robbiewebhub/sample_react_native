import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PrimaryHeader from '../../../components/header/PrimaryHeader'
import { COLORS, FONTS, ICONS } from '../../../constant'
import SearchBar from '../../../components/searchbar'
import ButtonBox from '../../../components/button'
import { goBack } from '../../../utils/navigations'
import SwitchBox from '../../../components/switchbox'

const data = [
    {
        image: 'https://picsum.photos/300/150',
        title: 'Egg Fried Rice',
        price: '$6.20',
        serving: '5',
        status: true
    },
    {
        image: 'https://picsum.photos/300/150',
        title: 'Braised Beef Brisket',
        price: '$6.20',
        serving: '3',
        status: true
    },
    {
        image: 'https://picsum.photos/300/150',
        title: 'Dan Dan Noodles',
        price: '$6.20',
        serving: '0',
        status: false
    },
    {
        image: 'https://picsum.photos/300/150',
        title: 'Handmade Pork Dumplings',
        price: '$6.20',
        serving: '21',
        status: true,
        startTime: '9:00 AM',
        endTime: '4:00 PM'
    },
]

const TABS = ['All', 'Active', 'Hide'];

const TodayMenuScreen = () => {
    const [isData, setIsData] = useState(data);
    const [isUpdateServe, setIsUpdateServe] = useState('');
    const [selectedTab, setSelectedTab] = useState('All');
    const filteredData = isData.filter((item) => {
        if (selectedTab === 'All') return true;
        if (selectedTab === 'Active') return item.status === true;
        if (selectedTab === 'Hide') return item.status === false;
        return true;
    });

    const onToggleStatus = (index) => {
        const newData = [...isData];
        newData[index].status = !newData[index].status;
        setIsData(newData);
    };
    
    const RenderItem = ({ item, index }) => {
        const [editToday, setEditToday] = useState();
        const handleServingChange = (index) => {
            const updated = [...isData];
            updated[index].serving = isUpdateServe;
            setIsData(updated);
            setTimeout(()=> {
                setIsUpdateServe('');
            }, 100)
        };
        return (
            <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.cardImg} />
                <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.cardTtl}>{item.title}</Text>
                    <Text style={styles.cardTxt}>{item.price} {editToday ? 'active' : null}</Text>
                    {item.status ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        {editToday ? (
                            <>
                                <TextInput defaultValue={item.serving} style={styles.inputFeild} onChangeText={(text) => {
                                    setIsUpdateServe(text);
                                    // setEditToday(true);
                                }} keyboardType="numeric" />
                                <TouchableOpacity style={[styles.btn, {
                                    backgroundColor: COLORS.primary[50]
                                }]} onPress={()=> setEditToday(false)}>
                                    <Image source={ICONS.closeIcon} style={styles.btnIcon} tintColor={COLORS.primary[300]} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.btn} onPress={()=> handleServingChange(index)}>
                                    <Image source={ICONS.tickIcon} style={styles.btnIcon} tintColor={COLORS.common.white} />
                                </TouchableOpacity>
                            </>
                        ) : (<>
                            <Text style={styles.cardTxt}>Servings today:</Text>
                            <Text style={[styles.cardTxt, { fontFamily: FONTS.poppins[500], color: COLORS.neutral[900]}]}>{item.serving}</Text>
                            <TouchableOpacity onPress={()=> setEditToday(true)}>
                                <Image source={ICONS.editIcon} style={{ width: 20, height: 20 }} tintColor={COLORS.primary[300]} />
                            </TouchableOpacity>
                        </>)}
                    </View> : null}
                    {item.startTime ? (
                        <Text style={styles.cardTime}>
                            {item.startTime} - {item.endTime}
                        </Text>
                    ) : null}
                </View>
                {!editToday ? <SwitchBox isIcon status={item.status} onToggle={()=> onToggleStatus(index)} /> : null}
            </View>
        )
    };
    return (
        <View style={{ flex: 1 }}>
            <PrimaryHeader icon={ICONS.closeIcon} title="Today’s Menu" />
            <View style={{ paddingHorizontal: 16, flex: 1 }}>
                <View style={{ marginBottom: 16, gap: 4 }}>
                    <Text style={styles.title}>Open for orders?</Text>
                    <Text style={styles.text}>Let eaters know what’s cooking today! Choose your available dishes and set how many servings you can make.</Text>
                </View>
                <View style={{ marginBottom: 8 }}>
                    <SearchBar placeholder="Search your dishes" />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: "row", gap: 4 }}>
                        {TABS.map((tab) => (
                            <TouchableOpacity
                                key={tab}
                                onPress={() => setSelectedTab(tab)}
                                style={[
                                    styles.tab,
                                    {
                                        borderBottomColor: selectedTab === tab ? COLORS.primary[300] : 'transparent'
                                    }
                                ]}
                            >
                                <Text style={[styles.tabText, {
                                    color: selectedTab === tab ? COLORS.primary[300] : COLORS.neutral[400],
                                    fontFamily: selectedTab === tab ? FONTS.poppins[500] : FONTS.poppins[400]
                                }]}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) => item.title + index}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, index})=> <RenderItem item={item} index={index} />}
                        contentContainerStyle={{ gap: 16, paddingVertical: 20 }}
                    />
                </View>
                <ButtonBox label="Open" onPress={() => goBack()} />
            </View>
        </View>
    )
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
        gap: 8
    },
    cardImg: {
        borderRadius: 8,
        width: 100,
        height: 100,
        flexShrink: 0
    },
    cardTtl: {
        color: COLORS.neutral[900],
        fontSize: 14,
        fontFamily: FONTS.poppins[500]
    },
    cardTxt: {
        color: COLORS.neutral[600],
        fontSize: 14,
        fontFamily: FONTS.poppins[400]
    },
    cardTime: {
        color: COLORS.primary[100],
        fontSize: 12,
        fontFamily: FONTS.poppins[500],
        marginTop: 'auto'
    },
    inputFeild: {
        width: 62,
        height: 32,
        borderWidth: 1,
        borderColor: COLORS.neutral[200],
        borderRadius: 64,
        fontSize: 14,
        fontFamily: FONTS.poppins[400],
        color: COLORS.neutral[900],
        paddingHorizontal: 16
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
    }
})

export default TodayMenuScreen