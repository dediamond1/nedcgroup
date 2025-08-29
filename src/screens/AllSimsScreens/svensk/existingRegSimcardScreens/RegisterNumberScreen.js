import React, { useContext, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
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
  const [err, setErr] = useState('');
  const { user } = useContext(AuthContext);

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Ange mobilnummer')
      .min(10, 'Ange mobilnummer 10 siffror'),
  });

 const triggerSms = async (phoneNumber) => {
  try {
    setErr('');
    setLoading(true);
    const clientIp = await DeviceInfo.getIpAddress();

    const response = await fetch(`${baseUrl}/api/simregistration/smschallenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${user}`,
      },
      body: JSON.stringify({
        msisdn: phoneNumber,
        clientIp,
      }),
    });

    const resData = await response.json();
    console.log('Response:', resData);

    // Check for backend-declared error
    if (resData?.error) {
      const message =
        resData?.detail ||
        resData?.message ||
        resData?.response?.userMessage ||
        'Ett fel uppstod vid SMS-utskick.';
      setErr(message);
      Alert.alert('Fel', message);
      return;
    }

    navigation.navigate('SMS', { number: phoneNumber });
  } catch (error) {
    console.error('triggerSms error:', error);
    setErr('Något gick fel. Försök igen senare.');
    Alert.alert('Fel', 'Något gick fel. Försök igen senare.');
  } finally {
    setLoading(false);
  }
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <AppScreen style={styles.screen}>
        <TopHeader
          loading={loading}
          icon
          onPress={() => navigation.goBack()}
          title="Mobilnummer"
        />

        <View style={styles.container}>
          <Formik
            initialValues={{ phoneNumber: '' }}
            validationSchema={validationSchema}
            onSubmit={({ phoneNumber }) => triggerSms(phoneNumber)}
          >
            {({
              handleChange,
              handleSubmit,
              touched,
              handleBlur,
              values,
              errors,
            }) => (
              <>
                <AppText text="Ange mobilnummer" style={styles.label} />

                <AppInput
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={handleBlur('phoneNumber')}
                  value={values.phoneNumber}
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="07XXXXXXXX"
                />

                {touched.phoneNumber && (err || errors.phoneNumber) && (
                  <AppText
                    text={err || errors.phoneNumber}
                    style={styles.errorText}
                  />
                )}

                <View style={styles.infoRow}>
                  <AppText text="Ex. 0701234567" style={styles.helperText} />
                  <AppText text="10 siffror" style={styles.helperText} />
                </View>

                {values.phoneNumber.length === 10 && !errors.phoneNumber && (
                  <AppButton
                    text={loading ? 'Skickar sms...' : 'Skicka kod via SMS'}
                    onPress={handleSubmit}
                    style={styles.button}
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
    padding: 20,
  },
  label: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 20,
  },
  helperText: {
    color: '#666',
    fontSize: 13,
  },
  button: {
    padding: 16,
    marginTop: 8,
  },
});
