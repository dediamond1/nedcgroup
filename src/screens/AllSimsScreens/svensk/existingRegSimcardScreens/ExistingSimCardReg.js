import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AppScreen } from '../../../../helper/AppScreen';
import { TopHeader } from '../../../../components/header/TopHeader';
import { AppText } from '../../../../components/appText';
import { AppInput } from '../../../../components/input/AppInput';
import { AppButton } from '../../../../components/button/AppButton';

export const NewSimcardScreen = ({ route }) => {
  const { number, smsCode } = route.params || {};
  const navigation = useNavigation();
  const validationSchema = Yup.object().shape({
    PhoneNumber: Yup.string()
      .required('Ange personnummer ååååmmddxxxx')
      .min(12, 'Ange personnummer 10 siffror ååmmddNNNN'),

  });


  return (
    <>
      <AppScreen
        style={styles.screen}>
        <TopHeader
          title={'Nytt SIM-kort'}
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />

        <ScrollView>
          <View style={styles.container}>
            <Formik
              initialValues={{
                PhoneNumber: '',
                email: '',
                street: '',
                postalCode: '',
                city: '',
              }}
              validationSchema={validationSchema}
              onSubmit={({ email, postalCode, PhoneNumber, city, street }) => {
                navigation.navigate('COMFIRM_EXITS', {
                  userInfo: {
                    PhoneNumber: PhoneNumber,
                    number,
                    smsCode
                  }
                })
              }}>
              {({
                handleChange,
                handleSubmit,
                touched,
                handleBlur,
                values,
                errors,
              }) => (
                <>
                  <AppText
                    text={'Ange Personnummer*'}
                    style={{ color: '#000', fontSize: 16, marginVertical: 2 }}
                  />
                  <View style={styles.textContainer}>
                    <AppText text={'Ex. 199411240102'} style={styles.text} />
                    <AppText text={'12 siffror'} style={styles.text} />
                  </View>
                  <AppInput
                    onChangeText={handleChange('PhoneNumber')}
                    onBlur={handleBlur('PhoneNumber')}
                    value={values.PhoneNumber}
                    keyboardType="numeric"
                    maxLength={12}
                    placeholder="ååååmmddNNNN"
                  />
                  {touched.PhoneNumber && errors.PhoneNumber && (
                    <AppText
                      text={errors.PhoneNumber}
                      style={[styles.text, { color: 'red' }]}
                    />
                  )}
                  {values.PhoneNumber.length === 12 && smsCode.length === 4 && <AppButton text={"Bekrafäta"} onPress={handleSubmit} />}

                </>
              )}
            </Formik>
          </View>
          <View style={{ height: 60 }} />
        </ScrollView>
      </AppScreen>
    </>
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
  modalStyle: {
    flex: 1,
  },
  scannerContainer: {
    width: '100%',
    height: 200,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 2,
    backgroundColor: 'red',
  },
  barCodeScanner: {
    width: 600,
    height: 600,
    borderRadius: 10,
  },
  imageContainer: {
    width: '100%',
    marginTop: 10,
    height: 200,
  },
});
