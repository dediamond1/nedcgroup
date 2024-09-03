import React from 'react';
import { StyleSheet, Linking, Pressable, Platform } from 'react-native';
import { View } from 'react-native-animatable';
import { AppText } from '../../../components/appText';
import { TopHeader } from '../../../components/header/TopHeader';
import { colors } from '../../../constants/colors';
import { AppScreen } from '../../../helper/AppScreen';

// Tel: 0790 40 40 40
// emai: info@artinsgruppen.se
// Öppet:
// Måndag-Fredag 07.00 - 15.30
export const SupportScreen = ({ navigation, route }) => {
    const callSupport = async () => {
        try {
            if (Platform.OS === "android") {
                await Linking.openURL('tel:+46793394031')
            }

        } catch (error) {
            console.log(error)
        }

    }

    const callForinvoice = async () => {
        try {
            if (Platform.OS === "android") {
                await Linking.openURL('tel:+46790404040')
            }

        } catch (error) {
            console.log(error)
        }

    }


    return (
        <AppScreen style={{ flex: 1 }}>
            <TopHeader title={'Hjälp'} icon="chevron-left" onPress={() => navigation.goBack()} />
            <View style={{ padding: 5 }}>
                <AppText
                    text={
                        'Behöver ni hjälp med att komma igång med era terminaler eller har ni frågor gälande en faktura? Kontakta vår support via e-post och telefon.'
                    }
                    style={{
                        fontSize: 15.3,
                        color: '#222222',
                        textAlign: 'center',
                        lineHeight: 24,
                    }}
                />
            </View>
            <View style={styles.container}>
                <View style={styles.content}>
                    <AppText
                        text={'Telefonnummer för support'}
                        style={{ fontSize: 16, color: '#e2027b' }}
                    />
                    <Pressable onPress={callSupport}>
                        <AppText
                            text={'07 93 39 40 31'}
                            style={{ fontSize: 16, color: 'blue', marginBottom: 30 }}
                        />
                    </Pressable>
                    <AppText
                        text={'Telefonnummer för Faktoror'}
                        style={{ fontSize: 16, color: '#e2027b' }}
                    />
                    <Pressable onPress={callForinvoice}>
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
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        alignItems: 'center',

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
});
