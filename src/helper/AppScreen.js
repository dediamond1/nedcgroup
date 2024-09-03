import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { FloatingActionButton } from '../components/button/FloatingActionButton'
import { AuthContext } from '../context/auth.context'

export const AppScreen = ({ style, children, showIcon = false, iconAction, FlatIIconStyle }) => {

    return (
        <SafeAreaView style={[styles.screen, style]}>
            {children}
            {showIcon && <FloatingActionButton style={FlatIIconStyle} icon={"menu"} onPress={iconAction} />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#f9f9f9"
    }
})
