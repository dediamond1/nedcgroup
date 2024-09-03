import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { DrawerActions } from '@react-navigation/native';
import { AppScreen } from '../../../../helper/AppScreen';
import { AppText } from '../../../../components/appText';
import { AppInput } from '../../../../components/input/AppInput';
import { AppButton } from '../../../../components/button/AppButton';
import { TopHeader } from '../../../../components/header/TopHeader';
export const SmsCodeScreen = ({ route, navigation }) => {
  const { number } = route.params;
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Ange SMS-kod')
      .min(4, 'Ange SMS-kod 4 siffror'),
  });
  return (
    <AppScreen
      style={styles.screen}
      showIcon="true"
      iconAction={() => navigation.dispatch(DrawerActions.openDrawer())}>
      <TopHeader
        title={'SMS-kod'}
        icon="chevron-left"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <View>
          <AppText text={number} style={{ color: '#000' }} />
        </View>
        <Formik
          initialValues={{ phoneNumber: '' }}
          validationSchema={validationSchema}
          onSubmit={() => { }}>
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
                text={'Ange SMS-koden'}
                style={{ color: '#000', fontSize: 16, marginVertical: 2 }}
              />
              <AppInput
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                value={values.phoneNumber}
                keyboardType="default"
                maxLength={4}
                placeholder="xxxx"
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <AppText
                  text={errors.phoneNumber}
                  style={[styles.text, { color: 'red' }]}
                />
              )}
              <View style={styles.textContainer}>
                <AppText text={'SMS-kod'} style={styles.text} />
                <AppText text={'4 siffror*'} style={styles.text} />
              </View>
              {!errors.phoneNumber && (
                <AppButton
                  text={'Nästa'}
                  onPress={() => {
                    handleSubmit();
                    navigation.navigate('NEW_SIMCARD', {
                      number: number,
                      smsCode: values.phoneNumber,
                    });
                  }}
                  style={{ padding: 16 }}
                />
              )}
            </>
          )}
        </Formik>
        <View style={{ height: 60 }} />
      </View>
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
    fontSize: 15,
  },
});
