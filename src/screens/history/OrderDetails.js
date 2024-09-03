import React, { useContext, useState, useRef } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { AppButton } from '../../components/button/AppButton';
import { TopHeader } from '../../components/header/TopHeader';
import { OrderItems } from '../../components/orderItems/OrderItems';
import { CustomAlert } from '../../components/warningAlert/CustomAlert';
import { baseUrl } from '../../constants/api';
import { AuthContext } from '../../context/auth.context';
import { AppScreen } from '../../helper/AppScreen';
import { NormalLoader } from '../../../helper/Loader2';
import * as Animatable from 'react-native-animatable';
import { BottomSheet } from '../../components/BottomSheet';
import { AnimatedStatus } from '../../../helper/AnimatedStatus';
import { Receipt } from '../../../helper/Kvitto';


export const OrderDetails = ({ route, navigation }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const { data } = route.params || {};
  const { user } = useContext(AuthContext);

  const { voucherNumber, OrderDate, serialNumber, voucherDescription, id, voucherAmount, ean } = data || {};




  const retunOrder = async () => {
    try {
      setShowWarning(true);
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/order`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${user}`,
        },
        body: JSON.stringify({
          voucherNumber: voucherNumber,
          OrderDate: OrderDate,
          reason: 'retur',
          serialNumber: serialNumber,
          id: id,
        }),
      });
      if (!response.ok) {
        setLoading(false)
        setShowWarning(false)
      }
      const resData = await response.json();
      console.log(resData);

      // console.log(
      //   resData?.data?.response?.errorInformation?.errors?.[0]
      //     ?.statusDescription,
      // );

      if (resData.message === 'Order Returned.') {
        // setShowWarning(false);
        setLoading(false);
        setStatus('success')
        setMessage('RETUR GODKÄND')

      } else if (
        resData?.data?.response?.errorInformation?.errors?.[0]
          ?.statusDescription ===
        'Cant cancel voucher because it was already barred'
      ) {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed')
        setMessage('VOUCHER REDAN ANVÄND!')
      } else {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed')
        setMessage('VOUCHER REDAN ANVÄND!')
      }
      setLoading(false)
      setShowWarning(false)
    } catch (error) {
      setShowWarning(false);
      setLoading(false);
      console.log(error);
    }
  };

  if (loading) {
    return <NormalLoader loading={loading} subTitle="Makulerar vouchern..." />
  }

  if (status === 'failed' || status === 'success') {
    return <AnimatedStatus ean={ean} voucherDescription={voucherDescription} amount={voucherAmount} OrderDate={OrderDate} voucherCode={voucherNumber} status={status} title={status === "failed" ? 'INTE GODKÄND' : 'GODKÄND'} message={message} onClose={() => {
      navigation.goBack()
    }} />
  }

  return (
    <AppScreen
      style={{ flex: 1 }}
    >
      <TopHeader
        title={'Köp retur'}
        icon="chevron-left"
        onPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        <OrderItems item={data} />
        <AppButton
          text={'Makulera köp'}
          style={styles.btn}
          icon="history"
          textStyle={styles.btnText}
          onPress={() => (setShowWarning(true))}
        />
      </View>

      {showWarning && (
        <BottomSheet
          title={"ÄR DU SÄKER ATT DU VILL MAKULERA VOUCHERN?"}
          onPressAccept={() => retunOrder()}
          onClose={() => {
            navigation.goBack()
            setShowWarning(false)
          }}
          visible={showWarning}
        />
      )}
      <View style={{ height: 40 }} />
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 10,
  },
  btn: {
    padding: 16,
    backgroundColor: "#2bb2e0"
  },
  btnText: {
    fontFamily: "ComviqSansWebBold",
    fontSize: 18
  }
});






