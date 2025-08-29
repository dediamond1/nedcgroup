import React, {useContext, useState, useEffect} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import {AppButton} from '../../components/button/AppButton';
import {TopHeader} from '../../components/header/TopHeader';
import {OrderItems} from '../../components/orderItems/OrderItems';
import {CustomAlert} from '../../components/warningAlert/CustomAlert';
import {baseUrl} from '../../constants/api';
import {AuthContext} from '../../context/auth.context';
import {AppScreen} from '../../helper/AppScreen';
import {NormalLoader} from '../../../helper/Loader2';
import * as Animatable from 'react-native-animatable';
import {BottomSheet} from '../../components/BottomSheet';
import {AnimatedStatus} from '../../../helper/AnimatedStatus';
import {Receipt} from '../../../helper/Kvitto';
import {
  BluetoothEscposPrinter,
  BluetoothManager,
} from '@brooons/react-native-bluetooth-escpos-printer';
import {format} from 'date-fns';
import {logo} from '../qrCode/logo';
import {logo as logoLyca} from '../lyca/logo';
import axios from 'axios';
import deviceManager from 'react-native-device-info';
import {getBluetooth, saveBluetooth} from '../../helper/storage';
import {useGetCompanyInfo} from '../../hooks/useGetCompanyInfo';
import categories from '../../utils/category-subcategory.json';
import {AppText} from '../../components/appText';
const {width} = Dimensions.get('window');
import {operatorConfig} from './voucherUtils'; // your util file
import { halebopLogo, teliaLogo } from '../telia-halebop/teliaHalebopLogos';

export const OrderDetails = ({route, navigation}) => {
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [foundDs, setFoundDs] = useState([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const {data, companyInfo, operator} = route.params || {};
  const {user} = useContext(AuthContext);

  const axiosConf = axios.create({
        baseURL: baseUrl,
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${user}`,
        },
      });

  const {
    voucherNumber,
    OrderDate,
    serialNumber,
    voucherDescription,
    id,
    voucherAmount,
    ean,
    expireDate,
    title,
    prebookId
  } = data || {};

  useEffect(() => {
    const initBluetooth = async () => {
      const isEmulator = await deviceManager.isEmulator();
      if (isEmulator) {
        Alert.alert('FEL', 'Detta är INTE en riktig enhet!');
        return;
      }

      try {
        const enabled = await BluetoothManager.checkBluetoothEnabled();
        if (!enabled) {
          await BluetoothManager.enableBluetooth();
        }

        const blStorage = await getBluetooth();
        const savedDevices = JSON.parse(blStorage);

        if (savedDevices && savedDevices.length > 0) {
          const device = savedDevices[0];
          await BluetoothManager.connect(device.address);
          setBoundAddress(device.address);
          setName(device.name || 'OKÄND');
        } else {
          const pairedDevices = await BluetoothManager.enableBluetooth();
          if (pairedDevices && pairedDevices.length > 0) {
            const paired = pairedDevices.map(device => JSON.parse(device));
            await saveBluetooth(paired);
            const device = paired[0];
            await BluetoothManager.connect(device.address);
            setBoundAddress(device.address);
            setName(device.name || 'OKÄND');
          }
        }
      } catch (error) {
        console.error('Bluetooth-initialiseringsfel:', error);
        Alert.alert(
          'Bluetooth-fel',
          'Det gick inte att initiera Bluetooth. Försök igen.',
        );
      }
    };

    initBluetooth();
  }, []);

  useEffect(() => {
    const orderDate = new Date(OrderDate);
    setTime(format(orderDate, 'HH:MM'));
    setDate(format(orderDate, 'yyyy-MM-dd'));
  }, [OrderDate]);

  const retunOrderTeliaHalebop = async () => {
    try {
      setShowWarning(true);
      setLoading(true);

      

      const {data: resData} = await axiosConf.delete('/api/teliaOrder', {
        data: {
          voucherNumber,
          OrderDate,
          reason: 'retur',
          serialNumber,
          id,
          prebookId,
           operator: operator === "TELIA" ? "Telia" : "Halebop", // <--- backend expects this for TELIA & HALEBOP
        },
      });

      console.log(resData);

      if (resData.message === 'Order Returned.') {
        setLoading(false);
        setStatus('success');
        setMessage('RETUR GODKÄND');
      } else if (
        resData?.data?.response?.errorInformation?.errors?.[0]
          ?.statusDescription ===
        'Cant cancel voucher because it was already barred'
      ) {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage('VOUCHER REDAN ANVÄND!');
      } else {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage('VOUCHER REDAN ANVÄND!');
      }
    } catch (error) {
      setShowWarning(false);
      setLoading(false);
      console.log(error);
      Alert.alert('Fel', 'Det gick inte att returnera ordern');
    }
  };

  const retunOrder = async () => {
    try {
      setShowWarning(true);
      setLoading(true);

      const {data: resData} = await axiosConf.delete('/api/order', {
        data: {
          voucherNumber: voucherNumber,
          OrderDate: OrderDate,
          reason: 'retur',
          serialNumber: serialNumber,
          id: id,
        },
      });

      console.log(resData);

      if (resData.message === 'Order Returned.') {
        setLoading(false);
        setStatus('success');
        setMessage('RETUR GODKÄND');
      } else if (
        resData?.data?.response?.errorInformation?.errors?.[0]
          ?.statusDescription ===
        'Cant cancel voucher because it was already barred'
      ) {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage('VOUCHER REDAN ANVÄND!');
      } else {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage('VOUCHER REDAN ANVÄND!');
      }
    } catch (error) {
      setShowWarning(false);
      setLoading(false);
      console.log(error);
      Alert.alert('Fel', 'Det gick inte att returnera ordern');
    }
  };

  const printVoucher = async () => {
    try {
      const isEmulator = await deviceManager.isEmulator();
      if (isEmulator) {
        Alert.alert('FEL', 'Detta är INTE en riktig enhet!');
        return;
      }

      setLoading(true);
      await BluetoothManager.connect(boundAddress);
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );

      // Logo handling
      let logoToPrint = logo; // default
      if (operator === 'LYCA') logoToPrint = logoLyca;
      if (operator === 'TELIA') logoToPrint = teliaLogo;
      if (operator === 'HALEBOP') logoToPrint = halebopLogo;
      await BluetoothEscposPrinter.printPic(logoToPrint, {
        width: 300,
        left: 45,
      });

      // Title & description
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printText(`${title}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`${voucherDescription}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('kod', {widthtimes: 1});
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Voucher number
      await BluetoothEscposPrinter.printText(`${voucherNumber}`, {
        widthtimes: 1,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Get operator-specific config
      const config =
        operatorConfig[operator] || operatorConfig['COMVIQ'];

      // Recharge text
      if (config.rechargeText) {
        await BluetoothEscposPrinter.printText(
          config.rechargeText(voucherNumber),
          {fonttype: 1},
        );
        await BluetoothEscposPrinter.printText('\r\n', {});
      }

      // QR Code
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printQRCode(
        config.qrCode(voucherNumber),
        170,
        BluetoothEscposPrinter.ERROR_CORRECTION.L,
      );
      await BluetoothEscposPrinter.printText('skanna för att tanka', {
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Expire date
      const formatedDate = format(new Date(expireDate), 'yyyy-MM-dd');
      await BluetoothEscposPrinter.printText(
        `\r\nkoden är giltig: ${formatedDate}`,
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Support info
      if (config.support) {
        await BluetoothEscposPrinter.printText(config.support, {fonttype: 1});
        await BluetoothEscposPrinter.printText('\r\n', {});
      }

      // Serial number
      await BluetoothEscposPrinter.printText(
        `Serienummer: ${serialNumber}`,
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Balance check (if applicable)
      if (config.balanceCheck) {
        await BluetoothEscposPrinter.printText(config.balanceCheck, {
          fonttype: 1,
        });
        await BluetoothEscposPrinter.printText('\r\n', {});
      }

      // Time & date
      await BluetoothEscposPrinter.printText(`${time}`, {});
      await BluetoothEscposPrinter.printText(` ${date}`, {});
      await BluetoothEscposPrinter.printText('\r\n\r\n', {});

      // Company info
      await BluetoothEscposPrinter.printText(
        ` ${companyInfo?.manager?.name?.toUpperCase()}`,
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(
        `${
          companyInfo?.manager?.orgNumber?.toString()?.length > 6
            ? companyInfo?.orgNumber?.toString().slice(0, 6) + '-' + 'XXXX'
            : companyInfo?.manager?.orgNumber
        }`,
        {},
      );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`Köpt datum och tid:`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`${time}`, {});
      await BluetoothEscposPrinter.printText(` ${date}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Find the EAN for the voucher
      // let voucherEan = '';
      // categories.category.forEach(category => {
      //   category.subcategory.forEach(subcategory => {
      //     if (subcategory.name === title) {
      //       voucherEan = subcategory.ean;
      //     }
      //   });
      // });

      // // Print the barcode if EAN is found
      // if (voucherEan) {
      //   await BluetoothEscposPrinter.printBarCode(
      //     voucherEan,
      //     BluetoothEscposPrinter.BARCODETYPE.EAN13,
      //     3,
      //     120,
      //     0,
      //     2,
      //   );
      // }

      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Fel',
        error.message || 'Det gick inte att skriva ut voucher',
      );
    }
  };

  if (loading) {
    return <NormalLoader loading={loading} subTitle="Makulerar..." />;
  }

  if (status === 'failed' || status === 'success') {
    return (
      <AnimatedStatus
        ean={ean}
        voucherDescription={voucherDescription}
        amount={voucherAmount}
        OrderDate={OrderDate}
        voucherCode={voucherNumber}
        status={status}
        title={status === 'failed' ? 'INTE GODKÄND' : 'GODKÄND'}
        // message={message}
        onClose={() => {
          navigation.goBack();
        }}
      />
    );
  }

  return (
    <AppScreen style={styles.screen}>
      <TopHeader
        title={'Köp retur'}
        icon="chevron-left"
        onPress={() => navigation.goBack()}
      />

      {operator === 'LYCA' && (
        <View
          style={{
            backgroundColor: 'orange',
            padding: 10,
            alignItems: 'center',
          }}>
          <AppText
            text={'Ett Lyca-kort kan inte makuleras efter köp.'}
            style={{color: '#000'}}
          />
        </View>
      )}

      <View style={styles.container}>
        <OrderItems item={data} />
        <View
          style={[
            styles.buttonContainer,
            {flexDirection: operator === 'LYCA' ? 'column' : 'row'},
          ]}>
          {operator !== 'LYCA' && (
            <AppButton
              text={'Makulera köp'}
              style={styles.btn}
              icon="history"
              textStyle={styles.btnText}
              onPress={() => setShowWarning(true)}
            />
          )}

          <AppButton
            text={'Skriv ut en kopia'}
            style={[
              styles.btn,
              styles.printBtn,
              {width: operator === 'LYCA' ? '100%' : 'auto'},
            ]}
            icon="printer"
            textStyle={styles.btnText}
            onPress={printVoucher}
          />
        </View>
      </View>

      {showWarning && (
        <BottomSheet
          title={'ÄR DU SÄKER ATT DU VILL MAKULERA VOUCHERN?'}
          onPressAccept={() => {
            if (operator === 'COMVIQ') {
              retunOrder();
            } else if (operator === 'TELIA' || operator === 'HALEBOP') {
              retunOrderTeliaHalebop();
            } else {
              Alert.alert(
                'Ej tillgängligt',
                `Retur stöds inte för ${operator}.`,
              );
            }
          }}
          onClose={() => setShowWarning(false)}
          visible={showWarning}
        />
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  btn: {
    padding: 14,
    backgroundColor: '#2bb2e0',
    flex: 1,
    marginHorizontal: 5,
  },
  printBtn: {
    backgroundColor: '#4CAF50',
  },
  btnText: {
    fontFamily: 'ComviqSansWebBold',
    fontSize: 15,
    color: 'white',
  },
});
