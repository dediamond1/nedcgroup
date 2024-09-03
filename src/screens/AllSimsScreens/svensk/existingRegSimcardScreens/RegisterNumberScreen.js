import React, { useContext, useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';



import { Formik } from 'formik';
import * as Yup from 'yup';

import { TouchableWithoutFeedback } from 'react-native';

import { DrawerActions } from '@react-navigation/native';

import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../../../../context/auth.context';
import { baseUrl } from '../../../../constants/api';
import { AppScreen } from '../../../../helper/AppScreen';
import { AppText } from '../../../../components/appText';
import { AppInput } from '../../../../components/input/AppInput';
import { AppButton } from '../../../../components/button/AppButton';
import { TopHeader } from '../../../../components/header/TopHeader';


export const RegisterNumberScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Ange mobilnummer')
      .min(10, 'Ange mobilnummer 10 siffror'),
  });

  const [err, setErr] = useState('');

  const { user } = useContext(AuthContext);
  const triggerSms = async phoneNumber => {
    try {
      setLoading(true);
      const clientIp = await DeviceInfo.getIpAddress();
      const response = await fetch(
        `${baseUrl}/api/simregistration/smschallenge`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({
            msisdn: phoneNumber,
            clientIp: clientIp,
          }),
        },
      );

      const resData = await response.json();
      console.log(resData?.response?.userMessage)
      if (resData?.response?.userMessage?.length > 0) {
        setLoading(false);
        Alert.alert("OBSS!", resData?.response?.userMessage);
      }
      else {
        setLoading(false);
        navigation.navigate('SMS', { number: phoneNumber })
        console.log(resData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableWithoutFeedback style={styles.screen} onPress={Keyboard.dismiss}>
      <AppScreen
        style={styles.screen}>
        <TopHeader
          loading={loading}
          icon
          onPress={() => navigation.goBack()}
          title={'Mobilnummer'}
        />
        <View style={styles.container}>
          <Formik
            initialValues={{ phoneNumber: '' }}
            validationSchema={validationSchema}
            onSubmit={({ phoneNumber }) => triggerSms(phoneNumber)}>
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
                  text={'Ange mobilnummer'}
                  style={{ color: '#000', fontSize: 16, marginVertical: 2 }}
                />
                <AppInput
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  value={values.phoneNumber}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="07XXXXXXXX"
                />
                {err.length === 0 ||
                  (touched.phoneNumber && errors.phoneNumber && (
                    <AppText
                      text={err ? err : errors.phoneNumber}
                      style={[styles.text, { color: 'red' }]}
                    />
                  ))}
                <View style={styles.textContainer}>
                  <AppText
                    text={'Ex. 0701234567'}
                    style={[styles.text, { fontSize: 13 }]}
                  />
                  <AppText text={'10 siffror'} style={styles.text} />
                </View>
                {!errors.phoneNumber && values.phoneNumber.length === 10 && (
                  <AppButton
                    text={!loading ? 'Skicka kod vi SMS' : 'Skickar sms...'}
                    onPress={() => {
                      handleSubmit();
                      // navigation.navigate('REGISTER_DETAILS', {
                      //   number: values.phoneNumber,
                      // });
                    }}
                    style={{ padding: 16 }}
                  />
                )}
              </>
            )}
          </Formik>
        </View>
      </AppScreen>
    </TouchableWithoutFeedback>
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
