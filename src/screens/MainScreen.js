import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'

import { Vouchers } from '../components/vouchers/Vouchers'

export const MainScreen = () => {
    return (
        <SafeAreaView style={styles.screen}>
            <Vouchers />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f8f8f8"
    },
})
