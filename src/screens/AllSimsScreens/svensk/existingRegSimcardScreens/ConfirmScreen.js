import React, {useContext, useEffect, useState} from 'react';
import {BankIdScreen} from '../newRegSimcardScreens/BankIdScreen';
import {RadioButton} from 'react-native-paper';

import DeviceInfo from 'react-native-device-info';
import axios from 'axios';
import {
  View,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {AuthContext} from '../../../../context/auth.context';
import {Status} from '../../../../../helper/Status';
import {AppScreen} from '../../../../helper/AppScreen';
import {AppText} from '../../../../components/appText';
import {AppButton} from '../../../../components/button/AppButton';
import {TopHeader} from '../../../../components/header/TopHeader';
import {baseUrl} from '../../../../constants/api';
// import { TopHeader } from "../../../../components/header/TopHeader";

const axiosConfig = axios.create({
  baseURL: baseUrl,
});

export const ConfirmScreen = ({route, navigation}) => {
  const [success, setSuccess] = useState(false);
  const [clientToken, setClientToken] = useState(null);
  const [bankIdText, setBankIdText] = useState('STARTA BANKID');
  const [startBankIdAuth, setStartBankIdAuth] = useState(false);
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState();
  const [orderRef, setOrderRef] = useState();
  const [loading, setLoading] = useState(false);

  const {user} = useContext(AuthContext);

  const {userInfo} = route.params || {};
  const {email, street, postalCode, PhoneNumber, city, number, smsCode} =
    userInfo || {};

  const idTypes = ['pass', 'BankId'];
  const consents = [
    {
      id: '0525dcca-89cb-416b-acf2-faea4a82430e',
      accept: true,
    },
    {
      id: '991ec072-b10d-439e-9e23-df6e5f1b42f8',
      accept: true,
    },
  ];
  //trigger bankId auth
  const startBankId = async () => {
    try {
      setOrderRef(null);
      setBankIdText('START BANKID');

      const userIp = await DeviceInfo.getIpAddress();
      const {data} = await axiosConfig.post(
        '/api/simregistration/authenticate',
        {
          personalNumber: PhoneNumber,
          endUserIp: userIp,
        },
        {
          headers: {
            authorization: `Bearer ${user}`,
          },
        },
      );
      if (data?.autoStartToken && data?.clientToken) {
        setClientToken(data?.clientToken);
        setStartBankIdAuth(true);
      }

      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  //bankId auth status
  const getbankidStatus = async () => {
    try {
      const {data} = await axiosConfig.post(
        '/api/simregistration/collect',
        {
          clientToken: clientToken,
        },
        {
          headers: {
            authorization: `Bearer ${user}`,
          },
        },
      );
      if (data?.message?.text) {
        setBankIdText(data?.message?.text);
      }
      if (data?.status === 'complete') {
        setOrderRef(data?.completionData?.orderRef);
        setClientToken(null);
        setStartBankIdAuth(false);
        await bankIdTwoFactor(data?.completionData?.orderRef);
      } else if (data?.response?.errorCode) {
        setClientToken(null);
        setError(true);
        setLoading(false);
        setStartBankIdAuth(false);
        setBankIdText('STARTA BANKID');
      }

      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  // bankId two factor saving data
  const bankIdTwoFactor = async orderRefr => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(
        `${baseUrl}/api/simregistration/bankid/twofactor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({
            ssn: PhoneNumber,
            msisdn: number,
            smsCode: smsCode,
            bankIdOrderReference: orderRefr ? orderRefr : orderRef,
            usedByMinor: false,
            consents,
          }),
        },
      );
      const resData = await response.json();

      if (resData?.response?.userMessage === 'Felaktig SMS-kod') {
        alert('Felaktig SMS-kod');
        setLoading(false);

        navigation.navigate('SMS', {number: number});
      }
      if (resData?.response?.userMessage?.length > 0) {
        setLoading(false);
        Alert.alert('OBS', resData?.response?.userMessage);
        setSuccess(false);
      }

      if (resData?.status === true) {
        setSuccess(true);
        setError(false);
        setLoading(false);

        // setStartRegister(false)
      }
      setLoading(false);
      // setStartRegister(false)
      console.log(resData);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const saveInformation = async () => {
    try {
      setLoading(true);
      const {data} = await axiosConfig.post(
        '/api/simregistration/physicalid/twofactor',
        {
          ssn: PhoneNumber,
          msisdn: number,
          smsCode: smsCode,
          idType: 'IdCard',
          consents,
        },
        {
          headers: {
            authorization: `Bearer ${user}`,
          },
        },
      );

      if (data?.response?.userMessage === 'Felaktig SMS-kod') {
        Alert.alert('OBS', 'Felaktig SMS-kod');
        setLoading(false);
        navigation.navigate('SMS', {number: number});
      }

      if (data?.response?.userMessage?.length > 0) {
        setLoading(false);
        Alert.alert('OBS', data?.response?.userMessage);
        setSuccess(false);
      }

      // const resDate = await response.json();
      if (data?.status === true) {
        setLoading(false);
        setSuccess(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const cancel = () => {
    navigation.navigate('ALLSIM_MAIN');
    setError(false);
    setSuccess(false);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (clientToken && startBankIdAuth) {
        getbankidStatus();
      } else {
        return;
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [clientToken, startBankIdAuth]);

  if (startBankIdAuth) return <BankIdScreen text={bankIdText} />;

  return (
    <>
      {loading || error || success ? (
        <Status
          success={success}
          loading={loading}
          error={error}
          text={
            error
              ? 'OBS! något gick fel!'
              : success
              ? 'SIM-kortet är nu registrerat'
              : 'Registrerar...'
          }
          onPressTryAgain={() => startBankId()}
          onPressCancel={cancel}
        />
      ) : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppScreen style={{flex: 1}}>
          <TopHeader title={'Bekräfta'} icon />
          <View style={styles.container}>
            <AppText
              style={styles.warningText}
              text={
                'Om registrering av SIM-kort inte fungerar, kan du använda Comviqs webbplats för att registrera ditt SIM-kort:'
              }
            />
            <AppText
              style={styles.urlText}
              text={'https://www.comviq.se/registrera-kontantkort'}
            />
            <View>
              <AppText
                text={'Personnummer'}
                style={{fontSize: 16, color: '#e2027b'}}
              />
              <AppText
                text={PhoneNumber}
                style={{fontSize: 16, color: '#000'}}
              />
              <AppText
                text={'MobilNummer'}
                style={{fontSize: 16, color: '#e2027b'}}
              />
              <AppText text={number} style={{fontSize: 16, color: '#000'}} />
              <AppText
                text={'SMS koden'}
                style={{fontSize: 16, color: '#e2027b'}}
              />
              <AppText text={smsCode} style={{fontSize: 16, color: '#000'}} />
            </View>
            <AppText
              style={{
                color: '#e2027b',
                fontSize: 18,
                textAlign: 'center',
                marginVertical: 8,
              }}
              text={'Välj identifieringsmetod'}
            />
            <View>
              {userId === 'BankId' && PhoneNumber?.length === 12 ? (
                <AppButton
                  image={require('../../../../../assets/images/bankid.png')}
                  text={'Starta BankID'}
                  style={{
                    backgroundColor: 'white',
                    borderWidth: 2,
                    borderColor: '#014f67',
                    padding: 10,
                  }}
                  textStyle={{color: '#014f67'}}
                  onPress={() => {
                    startBankId();
                  }}
                />
              ) : (
                userId === 'pass' &&
                PhoneNumber?.length === 12 && (
                  <AppButton
                    text={'Registrera med Körkort / ID-kort / Passport '}
                    icon="smart-card"
                    onPress={saveInformation}
                    style={{padding: 16}}
                  />
                )
              )}
            </View>
            {idTypes.map((id, index) => (
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  setUserId(id);
                }}
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 8,
                  width: '100%',
                  padding: 8,
                }}>
                <RadioButton
                  onPress={() => setUserId(id)}
                  uncheckedColor="#666"
                  status={id === userId ? 'checked' : 'unchecked'}
                />
                <AppText
                  text={id === 'pass' ? 'Körkort / ID-kort / Passport' : id}
                  style={{color: '#000', fontSize: 18}}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={{height: 60}} />
        </AppScreen>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  warningText: {
    color: '#e2027b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  urlText: {
    color: '#014f67',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
});
