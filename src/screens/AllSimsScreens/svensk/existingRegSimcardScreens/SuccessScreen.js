import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../../components/appText';
import { AppButton } from '../../../../components/button/AppButton';
import { TopHeader } from '../../../../components/header/TopHeader';


export const SuccessScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            <TopHeader title={'Registrering bekräftelse'} />
            <View
                style={{
                    flex: 1,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: 16,
                }}>
                <AppText
                    text={'SIM-kortet är nu registrerat'}
                    style={{ color: '#e2027b', fontSize: 16 }}
                />
                <AppButton
                    icon={'home'}
                    iconColor="#014f67"
                    text={'start Sida'}
                    style={styles.btn}
                    textStyle={styles.btnText}
                    onPress={() => navigation.navigate('HOME')}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#fff',
        borderColor: '#014f67',
        borderWidth: 2,
        width: '100%',
    },
    btnText: {
        color: '#014f67',
        textTransform: 'uppercase',
    },
});