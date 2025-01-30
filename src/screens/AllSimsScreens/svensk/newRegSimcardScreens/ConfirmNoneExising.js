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
  Alert,
} from 'react-native';

import {AuthContext} from '../../../../context/auth.context';
import {AppText} from '../../../../components/appText';
import {AppButton} from '../../../../components/button/AppButton';
import {TopHeader} from '../../../../components/header/TopHeader';
import {Status} from '../../../../../helper/Status';
import {AppScreen} from '../../../../helper/AppScreen';
import {baseUrl} from '../../../../constants/api';

const axiosConf = token => {
  return {
    axiosConfig: axios.create({
      baseURL: baseUrl,
      headers: {
        authorization: `Bearer ${token}`,
      },
    }),
  };
};

export const ConfirmNoneExistingScreen = ({route, navigation}) => {
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
  const {personalNumber, iccID} = userInfo || {};

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

  const isMinor = () => {
    const birthYear = parseInt(personalNumber?.slice(0, 4));
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear < 18;
  };

  const startBankId = async () => {
    try {
      setOrderRef(null);
      setBankIdText('START BANKID');
      const userIp = await DeviceInfo.getIpAddress();
      const {axiosConfig} = axiosConf(user);
      const {data} = await axiosConfig.post('/api/simregistration/authenticate', {
        personalNumber,
        endUserIp: userIp,
      });
      if (data?.autoStartToken && data?.clientToken) {
        setClientToken(data.clientToken);
        setStartBankIdAuth(true);
      }
    } catch (error) {
      console.error('Error starting BankID:', error.message);
    }
  };

  const getBankIdStatus = async () => {
    try {
      const {axiosConfig} = axiosConf(user);
      const {data} = await axiosConfig.post('/api/simregistration/collect', {
        clientToken,
      });
      if (data?.message?.text) {
        setBankIdText(data.message.text);
      }
      if (data?.status === 'complete') {
        setOrderRef(data.completionData.orderRef);
        setClientToken(null);
        setStartBankIdAuth(false);
        await bankIdTwoFactor(data.completionData.orderRef);
      } else if (data?.response?.errorCode) {
        setClientToken(null);
        setError(true);
        setLoading(false);
        setStartBankIdAuth(false);
        setBankIdText('STARTA BANKID');
      }
    } catch (error) {
      console.error('Error getting BankID status:', error.message);
    }
  };

  const bankIdTwoFactor = async orderRefr => {
    try {
      setLoading(true);
      setError(false);
      const {axiosConfig} = axiosConf(user);
      const {data} = await axiosConfig.post('/api/simregistration/bankid', {
        ssn: personalNumber,
        icc: iccID,
        bankIdOrderReference: orderRefr || orderRef,
        usedByMinor: isMinor(),
        consents,
      });
      if (data?.data?.isRegistered === true || data?.status === true) {
        setSuccess(true);
      } else if (data?.message === 'Request failed with status code 404') {
        Alert.alert('OJJ', 'Mobilnumret kunde inte hittas');
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in BankID two-factor:', error.message);
    }
  };

  useEffect(() => {
    let timer;
    if (clientToken && startBankIdAuth) {
      timer = setInterval(getBankIdStatus, 2000);
    }
    return () => clearInterval(timer);
  }, [clientToken, startBankIdAuth]);

  const idRegistration = async () => {
    try {
      setLoading(true);
      const {axiosConfig} = axiosConf(user);
      const response = await axiosConfig.post('/api/simregistration/physicalid', {
        ssn: personalNumber,
        icc: iccID,
        idType: 'IdCard',
        usedByMinor: isMinor(),
        consents,
      });
      if (response?.data?.data?.isRegistered === true || response?.data?.status === true) {
        setSuccess(true);
      } else if (response?.data?.response?.userMessage) {
        Alert.alert('OJJ!!', response.data.response.userMessage);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error in ID registration:', error.message);
    }
  };

  const cancel = () => {
    navigation.navigate('ALLSIM_MAIN');
    setError(false);
    setSuccess(false);
    setLoading(false);
  };

  if (startBankIdAuth) {
    return <BankIdScreen text={bankIdText} />;
  }

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
          onPressTryAgain={startBankId}
          onPressCancel={cancel}
        />
      ) : null}

      <AppScreen>
        <TopHeader
          title={'Bekräfta'}
          icon
          onPress={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <AppText
            style={styles.warningText}
            text={'Om registrering av SIM-kort inte fungerar, kan du använda Comviqs webbplats för att registrera ditt SIM-kort:'}
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
              text={personalNumber}
              style={{fontSize: 16, color: '#000'}}
            />
            <AppText
              text={'ICCID nummer'}
              style={{fontSize: 16, color: '#e2027b'}}
            />
            <AppText text={iccID} style={{fontSize: 16, color: '#000'}} />
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
            {userId === 'BankId' && personalNumber?.length === 12 && (
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
                onPress={startBankId}
              />
            )}
            {userId === 'pass' && personalNumber?.length === 12 && (
              <AppButton
                text={'Registrera med Körkort / ID-kort / Passport '}
                icon="smart-card"
                onPress={idRegistration}
                style={{padding: 16}}
              />
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
                style={{color: '#014f67', fontSize: 18}}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{height: 60}} />
      </AppScreen>
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