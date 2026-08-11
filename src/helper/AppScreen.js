import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { FloatingActionButton } from '../components/button/FloatingActionButton'

export const AppScreen = ({ style, children, showIcon = false, iconAction, FlatIIconStyle }) => {

    return (
        <SafeAreaView style={[styles.screen, style]}>
            {children}
            {showIcon && <FloatingActionButton style={FlatIIconStyle} icon={"home"} onPress={iconAction} />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#f9f9f9"
    }
})
