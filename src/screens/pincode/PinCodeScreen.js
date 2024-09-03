import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';


import { TopHeader } from '../../components/header/TopHeader';
import { useAuthPincode } from '../../hooks/useAuthPincode';
import { PincodeInput } from '../../../helper/PincodeInput';
import { NormalLoader } from '../../../helper/Loader2';

export const PinCodeScreen = ({ navigation, route }) => {
  const { loginInfo, login } = route.params || {};
  const { email, password } = loginInfo || {};
  const { verifyPincode, loading } = useAuthPincode()

  return (
    <>
      <TopHeader
        icon={'chevron-left'}
        title={'Skriv in din pinkod'}
        onPress={() => navigation.goBack()}
      />
      {loading && <NormalLoader subTitle={login ? "Loggar in" : "vänligen vänta printer ut voucher"} loading={loading} />}

      <PincodeInput onPress={async (pincode) => await verifyPincode({ pinCode: pincode, email: email, password: password })} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0,.5)',
  },
});


