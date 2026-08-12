import React from 'react'
import { Linking, Platform, Pressable, StyleSheet, View } from 'react-native'
import { AppText } from '../components/appText'
import { AppButton } from '../components/button/AppButton'
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
          </View>
        </View>
        <AppButton
          text="Försök igen"
          onPress={onPress}
          style={styles.retryButton}
          color="#e2027b"
        />
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
  retryButton: {
    marginVertical: 10,
    width: '100%',
  },
  text: {
    color: colors.primary.main,
  },
})
