import React, { useContext, useState } from 'react';
import { KeycodeInput } from 'react-native-keycode';
import { TopHeader } from '../../components/header/TopHeader';
import { baseUrl } from '../../constants/api';
import axios from 'axios';
import { AuthContext } from '../../context/auth.context';
import { View, Alert, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';

import { AppText } from '../../components/appText';
import { AppScreen } from '../../helper/AppScreen';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useAuth2Pin } from '../../hooks/useAuth2Pin';
import { NormalLoader } from '../../../helper/Loader2';
import { PincodeInput } from '../../../helper/PincodeInput';

export const PincodeOtp = ({ navigation, route }) => {
  const { data, title, moreInfo } = route.params;

  const { loading, verifyPincode } = useAuth2Pin()
  const authPinCode = async (pinCode) => {
    await verifyPincode({ pinCode: pinCode, data: data, title: title, moreInfo: moreInfo })
  }

  return (
    <AppScreen style={{ flex: 1 }}>
      <TopHeader
        title={'Ange pinkod'}
        icon="chevron-left"
        onPress={() => navigation.goBack()}
        loading={loading}
      />

      {loading && <NormalLoader loading={loading} />}


      <PincodeInput onPress={(pinCode) => authPinCode(pinCode)} />

    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  pinCodeHeader: {
    padding: 10,
    marginVertical: 20
  },
  pinCodeText: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "ComviqSansWebBold"

  },
  pincodeContainer: {
    marginBottom: 20,
  },

  pincodeContainer: {
    marginBottom: 20,
  },
  pincodeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pincodeInput: {
    backgroundColor: '#F2F2F2',
    width: 45,
    height: 45,
    borderRadius: 55 / 2,
    marginHorizontal: 16,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: "ComviqSansWebBold",
    fontWeight: '600',
  },
  numberPad: {
    borderRadius: 8,
    padding: 24,
    width: '100%',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  numberButton: {
    backgroundColor: '#2bb2e0',
    borderRadius: 73 / 2,
    width: 75,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: "#fff",
    fontFamily: "ComviqSansWebBold"
  },
  deleteButtonText: {
    color: '#ff5c5c',
    marginVertical: 5,
    fontFamily: "ComviqSansWebBold"

  },
  submitButtonText: {
    color: '#4caf50',
    marginVertical: 5,
    fontFamily: "ComviqSansWebBold"
  },
});





