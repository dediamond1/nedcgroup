import React, { useContext, useState } from 'react';
import { AppText } from '../../../../components/appText';
import { AppButton } from '../../../../components/button/AppButton';
import { TopHeader } from '../../../../components/header/TopHeader';
import { AppInput } from '../../../../components/input/AppInput';
import { AppScreen } from '../../../../helper/AppScreen';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Alert, ScrollView, StyleSheet, View,Image } from 'react-native';
//import FastImage from 'react-native-fast-image';
import { DrawerActions } from '@react-navigation/native';
import { AuthContext } from '../../../../context/auth.context';

export const NoneExistSimScreen = ({ navigation }) => {
  const [scannedDate, setScannedDate] = useState('');
  const { user } = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    ICCIDNUMBER: Yup.string()
      .required('Ange IccID')
      .max(20, 'Ange ICCID numret, 20 siffror'),
    phoneNumber: Yup.string()
      .required('Ange telefonnummer')
      .min(10, 'Ange telefonnummer, 10 siffror'),
  });

  return (
    <AppScreen
      style={styles.screen}
      showIcon={true}
      iconAction={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <TopHeader
        title={'Nytt SIM-kort'}
        icon="chevron-left"
        onPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.container}>
          <Formik
            initialValues={{
              ICCIDNUMBER: scannedDate || '',
              phoneNumber: '',
            }}
            validationSchema={validationSchema}
            onSubmit={() => { }}>
            {({
              handleChange,
              handleSubmit,
              touched,
              handleBlur,
              values: { ICCIDNUMBER, phoneNumber },
              errors,
            }) => (
              <>
                {(ICCIDNUMBER.length === 20 || scannedDate?.length < 20) && (
                  <View style={styles.imageContainer}>
                    <Image
                      resizeMode="contain"
                      source={require('../../../../../assets/images/sim2.png')}
                      style={{
                        height: 520,
                        width: 350,
                        marginTop: -160,
                        borderRadius: 10,
                        transform: [{ rotate: '-90deg' }],
                      }}
                    />
                  </View>
                )}
                <AppText
                  text={'Skriv ICCID numret!*'}
                  style={{ color: '#000', fontSize: 16, marginVertical: 2 }}
                />
                <AppInput
                  value={ICCIDNUMBER}
                  maxLen={20}
                  placeholder="Skriv ICCID numret"
                  onChangeText={handleChange('ICCIDNUMBER')}
                  onBlur={handleBlur('ICCIDNUMBER')}
                  keyboardType="numeric"
                />
                {touched.ICCIDNUMBER && errors.ICCIDNUMBER && (
                  <AppText
                    text={errors.ICCIDNUMBER}
                    style={[styles.text, { color: 'red' }]}
                  />
                )}

                <AppButton
                  text={'Nästa'}
                  onPress={() => {
                    if (ICCIDNUMBER.length === 20) {
                      handleSubmit();
                      navigation.navigate('CUSTOMER_INFO', {
                        simInfo: { iccID: ICCIDNUMBER },
                      });
                    } else {
                      Alert.alert('OBS', 'Ange rätt ICCID nummer, 20 siffror!');
                    }
                  }}
                  style={{
                    padding: 16,
                    backgroundColor:
                      ICCIDNUMBER.length === 20 ? '#e2027b' : 'grey',
                  }}
                />
              </>
            )}
          </Formik>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  text: {
    color: 'rgba(0, 0, 0, .5)',
    fontSize: 14,
  },
  imageContainer: {
    width: '100%',
    marginTop: 10,
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default NoneExistSimScreen;
