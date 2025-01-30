import React, {useContext, useState} from 'react';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {Alert, ScrollView, StyleSheet, View, Image} from 'react-native';

import {AuthContext} from '../../../../context/auth.context';

import {TopHeader} from '../../../../components/header/TopHeader';
import {AppText} from '../../../../components/appText';
import {AppInput} from '../../../../components/input/AppInput';
import {AppButton} from '../../../../components/button/AppButton';
import {AppScreen} from '../../../../helper/AppScreen';

export const NoneExistSimScreen = ({navigation}) => {
  const [scannedDate, setScannedDate] = useState('');

  const validationSchema = Yup.object().shape({
    ICCIDNUMBER: Yup.string()
      .required('Ange IccID')
      .length(20, 'Ange IccID numret, 20 siffror'),
  });

  const {user} = useContext(AuthContext);

  return (
    <AppScreen style={styles.screen}>
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
            }}
            validationSchema={validationSchema}
            onSubmit={() => {}}>
            {({
              handleChange,
              handleSubmit,
              touched,
              handleBlur,
              values: {ICCIDNUMBER},
              errors,
            }) => (
              <>
                {ICCIDNUMBER.length !== 20 && (
                  <View style={styles.imageContainer}>
                    <Image
                      resizeMode="contain"
                      source={require('../../../../../assets/images/sim2.png')}
                      style={{
                        height: 520,
                        width: 350,
                        marginTop: -160,
                        borderRadius: 10,
                        transform: [
                          {
                            rotate: '-90deg',
                          },
                        ],
                      }}
                    />
                  </View>
                )}

                <AppText
                  text={'Skriv ICCID numret!*'}
                  style={{color: '#000', fontSize: 16, marginVertical: 2}}
                />
                <AppInput
                  value={ICCIDNUMBER}
                  maxLength={20}
                  placeholder="Skriv ICCID numret"
                  onChangeText={handleChange('ICCIDNUMBER')}
                  onBlur={handleBlur('ICCIDNUMBER')}
                  keyboardType="numeric"
                />
                {touched.ICCIDNUMBER && errors.ICCIDNUMBER && (
                  <AppText
                    text={errors.ICCIDNUMBER}
                    style={[styles.text, {color: 'red'}]}
                  />
                )}

                <AppButton
                  text={'Nästa'}
                  onPress={() => {
                    if (ICCIDNUMBER.length === 20) {
                      handleSubmit();
                      navigation.navigate('CUSTOMER_INFO', {
                        simInfo: {
                          iccID: ICCIDNUMBER,
                        },
                      });
                    } else {
                      Alert.alert('OBS', 'Ange rätt ICCID nummer 20 siffror!');
                    }
                  }}
                  style={{
                    padding: 16,
                    backgroundColor: ICCIDNUMBER.length === 20 ? '#e2027b' : 'grey',
                  }}
                />
              </>
            )}
          </Formik>
        </View>
        <View style={{height: 60}} />
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
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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