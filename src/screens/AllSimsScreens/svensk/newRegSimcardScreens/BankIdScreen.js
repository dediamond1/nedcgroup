import React from 'react'
import { ActivityIndicator, View } from 'react-native'

// import LottieView from 'lottie-react-native'
import { TopHeader } from '../../../../components/header/TopHeader'
import { AppText } from '../../../../components/appText'


export const BankIdScreen = ({ text = "START BANKID" }) => {
    return (
        <View style={{ flex: 1 }}>
            <TopHeader title="START BANKID" />
            <View style={{ flex: 1, justifyContent: "space-evenly", alignItems: "center" }}>
                <ActivityIndicator size={38} color="#e2027b" />
                <AppText style={{ color: "#e2027b", fontSize: 16, textAlign: 'center' }} text={text} />
            </View>
        </View>
    )
}