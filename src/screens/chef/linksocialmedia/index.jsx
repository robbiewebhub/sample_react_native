import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PrimaryHeader from '../../../components/header/PrimaryHeader'
import { COLORS, FONTS, ICONS } from '../../../constant'
import InputField from '../../../components/inputfield'

const SocialCard = ({icon, label, upi}) => {
    const [isSelected, setIsSelected] = useState();
    const [updateUpi, setUpdateUpi] = useState(upi);
    const onChangeUpi = (val) => {
        setUpdateUpi(val);
    }
    return (
        <TouchableOpacity onPress={()=> setIsSelected(prev => !prev)}>
            <View style={styles.socialCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Image source={isSelected ? ICONS.checkboxIcon:  ICONS.checkboxSelectedIcon} style={{ width: 24, height: 24 }} />
                    <Image source={icon} style={{ width: 24, height: 24 }} />
                    <Text style={styles.socialCardTtl}>{label}</Text>
                </View>
                {isSelected ? <InputField value={updateUpi} onChange={(e) => onChangeUpi(e)} /> : null}
            </View>
        </TouchableOpacity>
    )
}

const LinkSocialMediaScreen = () => {
  return (
    <View style={{ flex: 1 }}>
        <PrimaryHeader title="Link Social Media" />
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ gap: 16 }}>
                <Text style={styles.text}>Link your profiles so neighbors can follow and get to know you better.</Text>
                <Text style={styles.text}>Your social media will appear on your kitchen page. You can unlink anytime.</Text>
                <SocialCard icon={ICONS.tiktokIcon} label="TikTok" upi="@may-cooks" />
                <SocialCard icon={ICONS.instagramIcon} label="Instagram" upi="@may-cooks" />
            </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    text: {
        color: COLORS.neutral[900],
        fontSize: 14,
        fontFamily: FONTS.poppins[400]
    },
    socialCard: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.neutral[200],
        paddingHorizontal: 8,
        paddingVertical: 16,
        gap: 16,
    },
    socialCardTtl: {
        color: COLORS.neutral[800],
        fontSize: 16,
        fontFamily: FONTS.poppins[500],
    }
})

export default LinkSocialMediaScreen