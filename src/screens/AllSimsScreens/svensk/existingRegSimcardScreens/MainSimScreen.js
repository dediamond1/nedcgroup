import { DrawerActions } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '../../../../components/appText';
import { AppButton } from '../../../../components/button/AppButton';
import { TopHeader } from '../../../../components/header/TopHeader';
import { AppScreen } from '../../../../helper/AppScreen';


export const MainSimScreen = ({ navigation }) => {
  return (
    <AppScreen
      style={styles.screen}>
      <TopHeader title={'Registreringsval'} icon />
      <View style={styles.container}>
        <AppButton
          textStyle={styles.btnsText}
          style={styles.btns}
          text={'Befintligt SIM-kort'}
          onPress={() => navigation.navigate('REGISTER_SIM')}
        />
        <View>
          <AppText text={"Använd kundens befintliga Comviq-nummer"} style={{ color: "#222222", textAlign: "center" }} />
        </View>

        <AppButton
          textStyle={styles.btnsText}
          style={styles.btns}
          onPress={() => navigation.navigate('NONE_EXISTS_SIM')}
          text={'Nytt SIM-kort'}
        />
        <View>
          <AppText text={"Kunden vill ha ett nytt Comviq-nummer"} style={{ color: "#222222", textAlign: "center" }} />
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eee"
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    width: '100%',
  },
  btns: {
    padding: 20,
    width: '100%',
    backgroundColor: "#f9f9f9",

  },
  btnsText: {
    color: '#e2027b',
    fontWeight: '600',
    fontSize: 18,
  },
});