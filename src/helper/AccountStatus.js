import React from 'react'
import { Linking, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AppText } from '../components/appText'
import { AppButton } from '../components/button/AppButton'
import { TopHeader } from '../components/header/TopHeader'
import { colors } from '../constants/colors'

export const AccountStatus = ({onPress})=>{

    const callSupport = async () => {
        try {
            if (Platform.OS === "android") {
                await Linking.openURL('tel:+46790404040')
            }

        } catch (error) {
            console.log(error)
        }

    }
    return(
        <>
        <TopHeader title={"Ditt konto är avaktiverat!"} />
        <View style={styles.container}>

      <View style={styles.container}>
      <AppText text={"Obs.. ditt konto är avaktiverat, kontakta supporten!"} style={{color: "#e2027b", fontSize: 19, textAlign: "center"}} /> 
                <View style={styles.content}>
                    <AppText
                        text={'Telefonnummer'}
                        style={{ fontSize: 16, color: '#e2027b' }}
                    />
                    <Pressable onPress={callSupport}>
                        <AppText
                            text={'0790 40 40 40'}
                            style={{ fontSize: 16, color: 'blue' }}
                        />
                    </Pressable>
                    <AppText text={'E-post'} style={{ fontSize: 16, color: '#e2027b' }} />
                    <AppText
                        text={'info@artinsgruppen.se'}
                        style={{ fontSize: 16, color: '#000' }}
                    />
                    <AppText
                        text={'Öppettider'}
                        style={{ fontSize: 16, color: '#e2027b' }}
                    />
                    <AppText
                        text={'Måndag-Fredag 07.00 - 15.30'}
                        style={{ fontSize: 16, color: '#000' }}
                    />
                </View>
            </View>
                <TouchableOpacity onPress={onPress} style={{
                    padding: 8,
                    borderRadius: 5,
                    backgroundColor: "#e2027b",
                    alignItems: "center",
                    width: "100%",
                    marginVertical: 10
                }}>
                    <AppText text={"Försök igen"} style={{ fontSize: 18}} />
                </TouchableOpacity>
    </View>
    </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        alignItems: 'center',
        justifyContent: "center"
    },
    content: {
        borderRadius: 5,
        width: '100%',
        marginVertical: 20,
        alignItems: 'center',
    },
    text: {
        color: colors.primary.main,
    },
})
