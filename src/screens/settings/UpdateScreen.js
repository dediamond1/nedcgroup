import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { AppText } from '../../components/appText'
// import LottieView from 'lottie-react-native'
import { TopHeader } from '../../components/header/TopHeader'
import CodePush from 'react-native-code-push'
import { deploymentKey } from '../../utils/updateKeys'
import { useNavigation } from '@react-navigation/native'
export const UpdateScreen = () => {
    const [updateText, setUpdateText] = useState('Söker efter uppdatering...')
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()



    if (!loading) return null
    else {
        return (
            <>
                <TopHeader title={"Söker efter uppdatering..."} onPress={() => navigation.goBack()} />
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={28} />
                    <AppText text={updateText} style={{ color: "#e2027b", fontSize: 17 }} />
                </View>
            </>
        )
    }
}