import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import PrimaryHeader from '../../../components/header/PrimaryHeader'
import { COLORS, FONTS } from '../../../constant'
import SwitchBox from '../../../components/switchbox'

const data = [
    {
        id: 1,
        title: 'Order Notifications',
        list: [
            {
                id: '1.1',
                label: 'New Order Request',
                text: 'Get notified when a buyer places an order.',
                status: false
            },
            {
                id: '1.2',
                label: 'Order Confirmed',
                text: 'Get a reminder when you accept an order.',
                status: false
            },
            {
                id: '1.3',
                label: 'Order Pickup Reminder',
                text: 'Receive a heads-up when it’s almost pickup time.',
                status: false
            },
            {
                id: '1.4',
                label: 'Order Refund Request',
                text: 'Be alerted when a buyer requests a refund.',
                status: false
            },
        ]
    },
    {
        id: 2,
        title: 'Message Notifications',
        list: [
            {
                id: '2.1',
                label: 'New Message from Buyer',
                text: 'Get notified when someone sends you a message.',
                status: false
            },
        ]
    },
    {
        id: 3,
        title: 'Account',
        list: [
            {
                id: '3.1',
                label: 'Account Updates',
                text: 'Security or settings changes on your account.',
                status: false
            },
        ]
    },
    {
        id: 4,
        title: 'Platform Updates',
        list: [
            {
                id: '4.1',
                label: 'New Features & Tips',
                text: 'Helpful updates to grow your kitchen.',
                status: false
            },
            {
                id: '4.2',
                label: 'Community Announcements',
                text: 'News about local events or platform changes.',
                status: false
            },
        ]
    },
]

const ChefNotificationScreen = () => {
    const [listData, setListData] = useState(data);
    const onSwitch = (childId, itemId) => {
        const updateList = listData.map(item => {
            if(item.id === itemId) {
                const updateChild = item.list.map(child => {
                    if(child.id === childId) {
                        return {...child, status: !child.status}
                    }
                    return child;
                })
                return {...item, list: updateChild}
            }
            return item;
        });
        setListData(updateList);
    }
  return (
    <View style={{ flex: 1 }}>
        <PrimaryHeader title="Notifications" />
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 16 }}>
                {listData.map((item) => (
                    <View style={styles.card} key={item.id}>
                        <Text style={styles.cardTtl}>{item.title}</Text>
                        {item.list.length ? (
                            <View style={styles.cardList}>
                                {item.list.map((child) => (
                                    <View style={styles.cardListItem} key={child.id}>
                                        <View style={{ flex: 1, gap: 4}}>
                                            <Text style={styles.cardListItemTxt}>{child.label}</Text>
                                            <Text style={styles.cardListItemDes}>{child.text}</Text>
                                        </View>
                                        <SwitchBox isIcon status={child.status} onToggle={()=> onSwitch(child.id, item.id)} />
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>
                ))}
            </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.neutral[200],
        padding: 16
    },
    cardTtl: {
        color: COLORS.neutral[900],
        fontSize: 16,
        fontFamily: FONTS.poppins[500],
    },
    cardTxt: {
        color: COLORS.neutral[400],
        fontSize: 14,
        fontFamily: FONTS.poppins[400],
    },
    cardList: {
        borderTopWidth: 1,
        borderTopColor: COLORS.neutral[200],
        gap: 16,
        marginTop: 16,
        paddingTop: 16,
    },
    cardListItem: {
        flexDirection: 'row'
    },
    cardListItemTxt: {
        color: COLORS.neutral[900],
        fontSize: 14,
        fontFamily: FONTS.poppins[500]
    },
    cardListItemDes: {
        color: COLORS.neutral[600],
        fontSize: 12,
        fontFamily: FONTS.poppins[400]
    }
})

export default ChefNotificationScreen