import React, {useState, useEffect} from 'react';
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
import {addYears, format} from 'date-fns';
import {logo} from '../qrCode/logo';
import {logo as logoLyca} from '../lyca/logo';
import deviceManager from 'react-native-device-info';
import {getBluetooth, saveBluetooth} from '../../helper/storage';
import {useGetCompanyInfo} from '../../hooks/useGetCompanyInfo';
import categories from '../../utils/category-subcategory.json';
import {AppText} from '../../components/appText';
const {width} = Dimensions.get('window');
import {resolveVoucherConfig, getOperatorConfig} from '../../utils/voucherConfig';
import { halebopLogo, teliaLogo } from '../telia-halebop/teliaHalebopLogos';
import { useDeleteOrderMutation, useDeleteTeliaOrderMutation } from '../../redux/api/ordersApi';
import { useVoucherConfigQuery } from '../../redux/api/catalogApi';

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
  const [operatorConfig, setOperatorConfig] = useState(null);
  const {data, companyInfo, operator} = route.params || {};
  const [deleteTeliaOrder] = useDeleteTeliaOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const {data: voucherConfigData} = useVoucherConfigQuery();

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
    // Resolve voucher config from the RTK Query cache
    if (voucherConfigData) {
      setOperatorConfig(resolveVoucherConfig(voucherConfigData));
    }
  }, [voucherConfigData]);

  useEffect(() => {
    const orderDate = new Date(OrderDate);
    setTime(format(orderDate, 'HH:mm')); // Fixed: 'HH:mm' instead of 'HH:MM'
    setDate(format(orderDate, 'yyyy-MM-dd'));
  }, [OrderDate]);

  const retunOrderTeliaHalebop = async () => {
    try {
      setShowWarning(true);
      setLoading(true);

      

      const resData = await deleteTeliaOrder(id).unwrap();

      console.log(resData);

      const supplierMsg =
        resData?.data?.response?.errorInformation?.errors?.[0]?.statusDescription ||
        resData?.data?.errorInformation?.errors?.[0]?.statusDescription ||
        resData?.data?.statusDescription ||
        resData?.message ||
        '';
      const alreadyUsed = /already (used|barred|cancelled)|redan anv|already returned/i.test(supplierMsg);

      if (resData.message === 'Order Returned.') {
        setLoading(false);
        setStatus('success');
        setMessage('RETUR GODKÄND');
      } else if (alreadyUsed) {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage('VOUCHER REDAN ANVÄND!');
      } else {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage(supplierMsg || 'Returnen kunde inte genomföras. Kontakta support.');
      }
    } catch (error) {
      setShowWarning(false);
      setLoading(false);
      console.log(error);
      Alert.alert(
        'Fel',
        error?.data?.message || error?.message || 'Det gick inte att returnera ordern'
      );
    }
  };

  const retunOrder = async () => {
    try {
      setShowWarning(true);
      setLoading(true);

      const resData = await deleteOrder(id).unwrap();

      console.log(resData);

      const supplierMsg =
        resData?.data?.response?.errorInformation?.errors?.[0]?.statusDescription ||
        resData?.data?.errorInformation?.errors?.[0]?.statusDescription ||
        resData?.data?.statusDescription ||
        resData?.message ||
        '';
      const alreadyUsed = /already (used|barred|cancelled)|redan anv|already returned/i.test(supplierMsg);

      if (resData.message === 'Order Returned.') {
        setLoading(false);
        setStatus('success');
        setMessage('RETUR GODKÄND');
      } else if (alreadyUsed) {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage('VOUCHER REDAN ANVÄND!');
      } else {
        setShowWarning(false);
        setLoading(false);
        setStatus('failed');
        setMessage(supplierMsg || 'Returnen kunde inte genomföras. Kontakta support.');
      }
    } catch (error) {
      setShowWarning(false);
      setLoading(false);
      console.log(error);
      Alert.alert(
        'Fel',
        error?.data?.message || error?.message || 'Det gick inte att returnera ordern'
      );
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

      // Get operator-specific config (formatted with voucher number)
      // If config not loaded yet, resolve fallback synchronously
      let configToUse = operatorConfig;
      if (!configToUse) {
        console.warn('Operator config not loaded, using fallback');
        configToUse = resolveVoucherConfig(voucherConfigData);
      }
      
      const config = getOperatorConfig(configToUse, operator, voucherNumber) || 
                     getOperatorConfig(configToUse, 'COMVIQ', voucherNumber);
      
      if (!config) {
        Alert.alert('Fel', 'Voucher-konfiguration kunde inte laddas');
        setLoading(false);
        return;
      }

      // Recharge text
      if (config.rechargeText) {
        await BluetoothEscposPrinter.printText(
          config.rechargeText,
          {fonttype: 1},
        );
        await BluetoothEscposPrinter.printText('\r\n', {});
      }

      // QR Code
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );
      await BluetoothEscposPrinter.printQRCode(
        config.qrCode,
        170,
        BluetoothEscposPrinter.ERROR_CORRECTION.L,
      );
      await BluetoothEscposPrinter.printText('skanna for att tanka', {
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText('\r\n', {});

      // Expire date
const formatedDate = format(
  new Date(expireDate ? expireDate : addYears(new Date(), 1)),
  'yyyy-MM-dd'
);      await BluetoothEscposPrinter.printText(
        `\r\nkoden ar giltig: ${formatedDate}`,
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

      // Company info (only print if available)
      if (companyInfo?.manager?.name) {
        await BluetoothEscposPrinter.printText(
          ` ${companyInfo.manager.name.toUpperCase()}`,
          {},
        );
        await BluetoothEscposPrinter.printText('\r\n', {});
      }
      if (companyInfo?.manager?.orgNumber) {
        await BluetoothEscposPrinter.printText(
          `${
            companyInfo.manager.orgNumber.toString().length > 6
              ? companyInfo.manager.orgNumber.toString().slice(0, 6) + '-' + 'XXXX'
              : companyInfo.manager.orgNumber
          }`,
          {},
        );
        await BluetoothEscposPrinter.printText('\r\n', {});
      }
      await BluetoothEscposPrinter.printText(`Kopt datum och tid:`, {});
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
