import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { format } from 'date-fns';
import { AuthContext } from '../../context/auth.context';
import { TopHeader } from '../../components/header/TopHeader';
import { BluetoothEscposPrinter, BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import deviceManager from 'react-native-device-info';
import { getBluetooth, saveBluetooth } from '../../helper/storage'; // Assuming these helpers exist
import { halebopLogo, teliaLogo } from './teliaHalebopLogos';
import { operatorConfig } from '../history/voucherUtils';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';

const TeliaHalebopPrintScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { voucherInfo, product } = route.params || {};
  const { teliaHalebop } = useContext(AuthContext);

  const COLOR = teliaHalebop === "Telia" ? "#990AE3" : "#3b3687";


  const operator = teliaHalebop === "Telia" ? "TELIA" : "HALEBOP"

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [printerName, setPrinterName] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Extract data from route params
  const title = product?.name || '';
  const voucherDescription = product?.description || '';
  const voucherNumber = voucherInfo?.voucherNumber || '';
  const serialNumber = voucherInfo?.serialNumber || '';
  const expireDate = voucherInfo?.expireDate || new Date(); // Use current date as fallback

  // Get company info
  const { companyInfo, getCompanyInfo } = useGetCompanyInfo();

  useEffect(() => {
    // Get company info on mount
    getCompanyInfo();
    
    // Get current date/time
    const now = new Date();
    setCurrentTime(format(now, 'HH:mm'));
    setCurrentDate(format(now, 'yyyy-MM-dd'));
  }, [getCompanyInfo]);

  useEffect(() => {
    const initBluetooth = async () => {
      const isEmulator = await deviceManager.isEmulator();
      if (isEmulator) {
        Alert.alert('FEL', 'Detta är INTE en riktig enhet!');
        return;
      }

      try {
        setStatusText('Initierar Bluetooth...');
        const enabled = await BluetoothManager.checkBluetoothEnabled();
        if (!enabled) {
          setStatusText('Aktiverar Bluetooth...');
          await BluetoothManager.enableBluetooth();
        }

        const blStorage = await getBluetooth();
        const savedDevices = blStorage ? JSON.parse(blStorage) : [];

        if (savedDevices && savedDevices.length > 0) {
          const device = savedDevices[0];
          setStatusText(`Ansluter till ${device.name || 'skrivare'}...`);
          await BluetoothManager.connect(device.address);
          setBoundAddress(device.address);
          setPrinterName(device.name || 'OKÄND');
          setStatusText('Bluetooth redo.');
        } else {
          setStatusText('Ingen sparad skrivare hittades. Vänligen para en skrivare i enhetens inställningar.');
          // Optionally, could add logic here to scan and list devices for user selection
        }
      } catch (error) {
        console.error('Bluetooth-initialiseringsfel:', error);
        Alert.alert('Bluetooth-fel', 'Det gick inte att initiera Bluetooth. Försök igen.');
        setStatusText('Bluetooth-initialisering misslyckades.');
      }
    };

    initBluetooth();

    // Cleanup function to disconnect Bluetooth when the screen is unmounted
    return () => {
      if (boundAddress) {
        BluetoothManager.disconnect(boundAddress)
          .then(() => console.log('Bluetooth disconnected on unmount'))
          .catch(err => console.error('Error disconnecting Bluetooth on unmount', err));
      }
    };

  }, []); // Remove boundAddress dependency to prevent infinite loops

  // Add this useEffect to trigger printing automatically when boundAddress is set
  // This follows the same pattern as QrCodeScreen
  useEffect(() => {
    if (boundAddress) {
      printVoucher();
    }
  }, [boundAddress]); // Trigger when boundAddress changes

  const handleDone = () => {
    // Navigate back to the main screen or appropriate screen
    navigation.navigate('INTRO'); // Example: Navigate back to IntroScreen
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
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

    // Logo handling
    let logoToPrint = teliaLogo; // default
    if (operator === "HALEBOP") logoToPrint = halebopLogo;
    await BluetoothEscposPrinter.printPic(logoToPrint, { width: 300, left: 45 });

    // Title & description
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printText(`${title}`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});
    await BluetoothEscposPrinter.printText(`${voucherDescription}`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});
    await BluetoothEscposPrinter.printText('kod', { widthtimes: 1 });
    await BluetoothEscposPrinter.printText('\r\n', {});

    // Voucher number
    await BluetoothEscposPrinter.printText(`${voucherNumber}`, {
      widthtimes: 1,
      fonttype: 1,
    });
    await BluetoothEscposPrinter.printText('\r\n', {});

    // Get operator-specific config
    const config = operatorConfig[operator] || operatorConfig["TELIA"];

    // Recharge text
    if (config.rechargeText) {
      await BluetoothEscposPrinter.printText(config.rechargeText(voucherNumber), { fonttype: 1 });
      await BluetoothEscposPrinter.printText('\r\n', {});
    }

    // QR Code
    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
    await BluetoothEscposPrinter.printQRCode(
      config.qrCode(voucherNumber),
      170,
      BluetoothEscposPrinter.ERROR_CORRECTION.L
    );
    await BluetoothEscposPrinter.printText('skanna för att tanka', { fonttype: 1 });
    await BluetoothEscposPrinter.printText('\r\n', {});

    // Expire date
    const formatedDate = format(new Date(expireDate), 'yyyy-MM-dd');
    await BluetoothEscposPrinter.printText(`\r\nkoden är giltig: ${formatedDate}`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});

    // Support info
    if (config.support) {
      await BluetoothEscposPrinter.printText(config.support, { fonttype: 1 });
      await BluetoothEscposPrinter.printText('\r\n', {});
    }

    // Serial number
    await BluetoothEscposPrinter.printText(`Serienummer: ${serialNumber}`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});

    // Balance check (if applicable)
    if (config.balanceCheck) {
      await BluetoothEscposPrinter.printText(config.balanceCheck, { fonttype: 1 });
      await BluetoothEscposPrinter.printText('\r\n', {});
    }

    // Time & date
    await BluetoothEscposPrinter.printText(`${currentTime}`, {});
    await BluetoothEscposPrinter.printText(` ${currentDate}`, {});
    await BluetoothEscposPrinter.printText('\r\n\r\n', {});

    // Company info
    await BluetoothEscposPrinter.printText(` ${companyInfo?.manager?.name?.toUpperCase()}`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});
    await BluetoothEscposPrinter.printText(`${companyInfo?.manager?.orgNumber?.toString()?.length > 6
      ? companyInfo?.manager?.orgNumber?.toString().slice(0, 6) + '-' + 'XXXX'
      : companyInfo?.manager?.orgNumber
      }`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});
    await BluetoothEscposPrinter.printText(`Köpt datum och tid:`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});
    await BluetoothEscposPrinter.printText(`${currentTime}`, {});
    await BluetoothEscposPrinter.printText(` ${currentDate}`, {});
    await BluetoothEscposPrinter.printText('\r\n', {});

    // Remove EAN lookup code since we're not using it
    // let voucherEan = '';
    // categories.category.forEach(category => {
    //   category.subcategory.forEach(subcategory => {
    //     if (subcategory.name === title) {
    //       voucherEan = subcategory.ean;
    //     }
    //   });
    // });

    // Print the barcode if EAN is found
    // if (voucherEan) {
    //   await BluetoothEscposPrinter.printBarCode(
    //     voucherEan,
    //     BluetoothEscposPrinter.BARCODETYPE.EAN13,
    //     3,
    //     120,
    //     0,
    //     2
    //   );
    // }

    await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
    setLoading(false);
  } catch (error) {
    setLoading(false);
    Alert.alert('Fel', error.message || 'Det gick inte att skriva ut voucher');
  }
};



  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLOR }]}>
      <TopHeader
        title={'Voucher Details'}
        style={{ backgroundColor: COLOR }}
        iconBackground={COLOR}
        icon={true}
        iconName='close'
        onPress={handleDone}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#333' }}>{product?.name || 'Product'}</Text>
            <Icon name="information-outline" size={24} color={COLOR} />
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5 }}>Vouchernummer:</Text>
            <Text style={{ fontSize: 16, color: '#666', fontFamily: 'azo_sans-400' }}>{voucherInfo?.voucherNumber}</Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5 }}>Serienummer:</Text>
            <Text style={{ fontSize: 16, color: '#666', fontFamily: 'azo_sans-400' }}>{voucherInfo?.serialNumber}</Text>
          </View>

          {/* Print Button */}
          <TouchableOpacity
              style={[styles.printButton, { 
                backgroundColor: loading ? '#cccccc' : COLOR,
                opacity: loading ? 0.7 : 1 
              }]}
              onPress={printVoucher}
              disabled={loading}
          >
              <Text style={styles.printButtonText}>{loading ? 'Skriver ut...' : 'Skriv ut Voucher'}</Text>
          </TouchableOpacity>

        </View>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: COLOR }]}
          onPress={handleDone}
          disabled={loading} // Disable done button while printing
        >
          <Text style={styles.doneButtonText}>Tillbaka till huvudmeny</Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLOR} />
            {statusText && <Text style={styles.statusText}>{statusText}</Text>}
          </View>
        )}
         {/* Status Text when not loading */}
        {!loading && statusText && (
           <View style={styles.statusContainer}>
             <Text style={styles.statusText}>{statusText}</Text>
           </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doneButton: {
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'azo_sans-700',
  },
  printButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  printButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'azo_sans-700',
  },
   loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
     marginTop: 10,
     alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#333', // Or a color that fits the theme
    fontFamily: 'azo_sans-700',
    textAlign: 'center',
  },
});

export default TeliaHalebopPrintScreen;
