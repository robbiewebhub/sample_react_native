import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PrimaryHeader from '../../../components/header/PrimaryHeader'
import { COLORS, FONTS, ICONS, IMAGES } from '../../../constant'
import Avatar from '../../../components/avatar'

const recentList = [
    {
        id: '1',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Amelia Chu',
        date: 'May 04, 2025',
        time: '4:43PM',
        paymentType: 'venmo',
        price: '+24.32'
    },
    {
        id: '2',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Amelia Chu',
        date: 'May 04, 2025',
        time: '4:43PM',
        paymentType: 'venmo',
        price: '+24.32'
    },
    {
        id: '3',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Mike Watson',
        date: 'May 04, 2025',
        time: '10:11AM',
        paymentType: 'zelle',
        price: '+40.28'
    },
    {
        id: '4',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Mike Watson',
        date: 'May 04, 2025',
        time: '10:11AM',
        paymentType: 'zelle',
        price: '+40.28'
    },
    {
        id: '5',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Amelia Chu',
        date: 'May 04, 2025',
        time: '4:43PM',
        paymentType: 'venmo',
        price: '+24.32'
    },
    {
        id: '6',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Mike Watson',
        date: 'May 04, 2025',
        time: '10:11AM',
        paymentType: 'venmo',
        price: '+40.28'
    },
    {
        id: '7',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Amelia Chu',
        date: 'May 04, 2025',
        time: '4:43PM',
        paymentType: 'venmo',
        price: '+24.32'
    },
    {
        id: '8',
        pic: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1080',
        name: 'Mike Watson',
        date: 'May 04, 2025',
        time: '10:11AM',
        paymentType: 'venmo',
        price: '+40.28'
    },
]

const EarningCard = () => {
    return (
        <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={styles.priceBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={ICONS.zelleIcon} style={{ width: 24, height: 24 }} />
                    <Text style={styles.priceBoxTtl}>Zelle</Text>
                </View>
                <Text style={styles.priceBoxPrice}>$100.00</Text>
                <TouchableOpacity style={styles.shareLink}>
                    <Text style={styles.shareLinkTxt}>Open</Text>
                    <Image source={ICONS.shareIcon} style={{ width: 16, height: 16 }} />
                </TouchableOpacity>
            </View>
            <View style={styles.priceBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={ICONS.venmoIcon} style={{ width: 24, height: 24 }} />
                    <Text style={styles.priceBoxTtl}>Venmo</Text>
                </View>
                <Text style={styles.priceBoxPrice}>$85.00</Text>
                <TouchableOpacity style={styles.shareLink}>
                    <Text style={styles.shareLinkTxt}>Open</Text>
                    <Image source={ICONS.shareIcon} style={{ width: 16, height: 16 }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const TotalEarningScreen = () => {
  return (
    <View style={{ flex: 1 }}>
        <PrimaryHeader title="Total earnings" />
        <View style={{ gap: 16, flex: 1, paddingHorizontal: 16 }}>
            <EarningCard />
            <Text style={styles.title}>Recent activity</Text>
            <FlatList
                data={recentList}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
                style={{ flex: 1}}
                renderItem={({item}) => (
                    <View style={styles.recentCard}>
                        <Avatar path={item.pic} size={36} />
                        <View style={{ flex: 1}}>
                            <Text style={styles.recentCardName}>{item.name}</Text>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={styles.recentCardDateTime}>{item.date} ·</Text>
                                <Text style={styles.recentCardDateTime}>{' '}{item.time}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <Image source={item.paymentType === 'zelle' ? ICONS.zelleIcon : ICONS.venmoIcon} style={{ width: 16, height: 16 }} />
                            <Text style={styles.recentCardPrice}>{item.price}</Text>
                        </View>
                    </View>
                )}

            />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    priceBox: {
        borderRadius: 8,
        backgroundColor: COLORS.neutral[75],
        gap: 16,
        paddingHorizontal: 24,
        paddingVertical: 16,
        flex: 1,
    },
    priceBoxTtl: {
        color: COLORS.neutral[800],
        fontSize: 16,
        fontFamily: FONTS.poppins[500]
    },
    priceBoxPrice: {
        color: COLORS.neutral[900],
        fontSize: 24,
        fontFamily: FONTS.poppins[600]
    },
    shareLink: {
        alignSelf: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral['black'],
        gap: 4,
        flexDirection: 'row',
    },
    shareLinkTxt: {
        color: COLORS.neutral['black'],
        fontSize: 14,
        fontFamily: FONTS.poppins[500],
    },
    title: {
        color: COLORS.neutral[900],
        fontFamily: FONTS.poppins[500],
        fontSize: 18
    },
    recentCard: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4
    },
    recentCardName: {
        color: COLORS.neutral[900],
        fontSize: 14,
        fontFamily: FONTS.poppins[500],
    },
    recentCardDateTime: {
        color: COLORS.neutral[600],
        fontSize: 12,
        fontFamily: FONTS.poppins[400]
    },
    recentCardPrice: {
        color: COLORS.success[300],
        fontSize: 14,
        fontFamily: FONTS.poppins[500],
    }
})

export default TotalEarningScreen