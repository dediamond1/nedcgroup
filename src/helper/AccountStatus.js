import React from 'react'
import { Linking, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AppText } from '../components/appText'
import { TopHeader } from '../components/header/TopHeader'
import { colors } from '../constants/colors'

export const SUPPORT_PHONE_DISPLAY = '+46 793 394 031'
export const SUPPORT_PHONE_TEL = '+46793394031'
export const SUPPORT_EMAIL = 'info@artinsgruppen.se'

export const AccountStatus = ({ onPress }) => {
  const callSupport = async () => {
    try {
      if (Platform.OS === 'android') {
        await Linking.openURL(`tel:${SUPPORT_PHONE_TEL}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <TopHeader title="Ditt konto är avaktiverat!" />
      <View style={styles.container}>
        <View style={styles.container}>
          <AppText
            text="Ditt konto har nått kreditgränsen och är avaktiverat. Kontakta supporten för att få hjälp."
            style={{ color: '#e2027b', fontSize: 19, textAlign: 'center' }}
          />
          <View style={styles.content}>
            <AppText text="Telefonnummer" style={{ fontSize: 16, color: '#e2027b' }} />
            <Pressable onPress={callSupport}>
              <AppText text={SUPPORT_PHONE_DISPLAY} style={{ fontSize: 16, color: 'blue' }} />
            </Pressable>
            <AppText text="E-post" style={{ fontSize: 16, color: '#e2027b' }} />
            <AppText text={SUPPORT_EMAIL} style={{ fontSize: 16, color: '#000' }} />
            <AppText text="Öppettider" style={{ fontSize: 16, color: '#e2027b' }} />
            <AppText text="Måndag–Fredag 07.00 – 15.30" style={{ fontSize: 16, color: '#000' }} />
          </View>
        </View>
        <TouchableOpacity
          onPress={onPress}
          style={{
            padding: 8,
            borderRadius: 5,
            backgroundColor: '#e2027b',
            alignItems: 'center',
            width: '100%',
            marginVertical: 10,
          }}
        >
          <AppText text="Försök igen" style={{ fontSize: 18 }} />
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
    justifyContent: 'center',
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
