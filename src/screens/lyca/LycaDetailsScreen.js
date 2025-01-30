import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TopHeader } from '../../components/header/TopHeader';
import { AuthContext } from '../../context/auth.context';
import { BluetoothEscposPrinter, BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import { format } from 'date-fns';
import deviceManager from 'react-native-device-info';
import { logo } from './logo';
import { getBluetooth, saveBluetooth } from '../../helper/storage';
import { api } from '../../api/api';
import { PincodeInput } from '../../../helper/PincodeInput';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';

export default function Component({ route, navigation }) {
  const { subcategory, categoryName } = route.params;
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { setInActive, user, setUser } = useContext(AuthContext);
  const [statusText, setStatusText] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const { getCompanyInfo, companyInfo, userToken } = useGetCompanyInfo();
  const [bought, setBought] = useState(false);
  const [voucherInfo, setVoucherInfo] = useState({});
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  useEffect(() => {
    getCompanyInfo();
  }, []);

  const handlePrintCode = () => {
    setShowOtpInput(true);
  };

  const handleOtpSubmit = async (pinCode) => {
    if (pinCode.length === 4) {
      await verifyPincode({ pinCode, data: subcategory });
    } else {
      Alert.alert('OBS', 'Pinkoden måste vara 4 siffror');
    }
  };

  const verifyPincode = async ({ pinCode, data }) => {
    try {
      setLoading(true);
      setStatusText('Verifierar pinkoden...');

      const response = await api.post('/api/manager/confirmpinCheck', {
        pincode: pinCode,
      }, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      switch (response?.data?.message) {
        case 'Company deactivated because you have reached Credit Limit':
          setInActive(true);
          break;
        case 'pin code is required':
        case 'invalid email or pin.':
          Alert.alert('OBS', 'Ange rätt pinkod');
          break;
        case 'invalid token in the request.':
          Alert.alert('OBS', 'Du har blivit utloggad, vänligen logga in igen', [{
            text: 'Logga in igen',
            onPress: () => setUser(null),
          }]);
          break;
        case 'Pin code is Correct':
          setShowOtpInput(false);
          await saveOrder();
          break;
        default:
          break;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error verifying pincode:', error);
      Alert.alert('Error', 'Ett fel uppstod. Försök igen.');
    }
  };

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
        setStatusText('');
      } catch (error) {
        console.error('Bluetooth-initialiseringsfel:', error);
        Alert.alert('Bluetooth-fel', 'Det gick inte att initiera Bluetooth. Försök igen.');
      }
    };

    initBluetooth();
  }, []);

  const printVoucher = async ({voucherNumber, serialNumber}) => {
    try {
        
      const isEmulator = await deviceManager.isEmulator();
      if (isEmulator) {
        Alert.alert('FEL', 'Detta ar INTE en riktig enhet!');
        return;
      }

      setLoading(true);
      setStatusText('Skriver ut voucher...')

      await BluetoothManager.connect(boundAddress);
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printPic(logo, { width: 350, left: 10 });

      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText(`${subcategory?.name}`, {fonttype: 1,});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('Vardebevis', { widthtimes: 1 });
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(`${voucherNumber}`, {
        widthtimes: 1,
        fonttype: 1,
      });
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(`${subcategory?.InfoPos}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(
        `Tanka registrerat kontantkort   genom att ringa *101*koden#`,
        { fonttype: 1 }
      );
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`koden ar giltig: 12 manader`, {});

      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(
        `Vid hjalp kontakta var kundtjanst pa telefon 3322 eler besok var webbplats www.lycamobile.se`,
        { fonttype: 1 }
      );

      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`Serienummer: ${serialNumber}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printQRCode(
        `*101*${voucherInfo?.voucherNumber}#`,
        170,
        BluetoothEscposPrinter.ERROR_CORRECTION.L
      );
      await BluetoothEscposPrinter.printText('skanna for att tanka', { fonttype: 1 });

      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('registrera sim-kort pa online    genom att skanna  ', { fonttype: 1 });

      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(` ${companyInfo?.manager?.name?.toUpperCase()}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`${companyInfo?.manager?.orgNumber?.toString()?.length > 6
        ? companyInfo?.orgNumber?.toString().slice(0, 6) + '-' + 'XXXX'
        : companyInfo?.manager?.orgNumber
      }`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(`Kopt datum och tid:`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText(` ${new Date().getFullYear()}, ${new Date().getHours()}:${new Date().getMinutes()}`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
      setLoading(false);
      setShowVoucherModal(true);
    } catch (error) {
      setLoading(false);
      Alert.alert('Fel', error.message || 'Det gick inte att skriva ut voucher');
    }
  };

  const saveOrder = async () => {
    try {
      setLoading(true);
      
      setStatusText('Hämtar voucher information...');
      const Voucherdata = await api.get(`/api/lycamobile/categories/${subcategory.articleId}/products`);
      
      console.log("voucher info", voucherInfo?.data)
      if (Voucherdata?.data?.error === `No vouchers available for category ${subcategory?.articleId}.`) {
        setShowOtpInput(false)
        setStatusText('Produkten är slutsåld eller något fick fel')
        setLoading(false)

        return Alert.alert('OBS', "Produkten är slutsåld eller något fick fel kontakta support +46793394031")
      }
      if (!Voucherdata?.data?.products[0]?.voucherNumber) {
        setShowOtpInput(false)
        setStatusText('Produkten är slutsåld eller något fick fel kontakta support +46793394031')
        setLoading(false)
        
        return Alert.alert('OBS', "Produkten är slutsåld eller något fick fel")
      }
      setVoucherInfo(Voucherdata?.data?.products[0]);
      
      setStatusText('Sparar order...');
      const { data } = await api.post('/api/lyca-order', {
        serialNumber: Voucherdata?.data?.products[0]?.serialNumber,
        voucherNumber: Voucherdata?.data?.products[0]?.voucherNumber,
        voucherDescription: subcategory?.name,
        articleId: subcategory?.articleId,
        voucherAmount: subcategory?.price,
        voucherCurrency: "SEK",
        employeeId: null,
      }, {headers: {
        "Authorization": `Bearer ${userToken}`
      }});

      if (data?.message === 'Company deativted because you have reached Credit Limit') {
        setInActive(true);
      } else if (data?.message === 'invalid token in the request.') {
        Alert.alert('OBS...', 'DU HAR BLIVIT UTLOGGAD');
      } else if (data?.message === 'not valid time to book order.') {
        Alert.alert('OBS', 'Inte giltig tid att boka order');
      } else {
        setBought(true);
        await printVoucher({voucherNumber: Voucherdata?.data?.products[0]?.voucherNumber, serialNumber: Voucherdata?.data?.products[0]?.serialNumber});
      }
    } catch (error) {
      console.error('Error saving order:', error);
      Alert.alert('Fel', 'Kunde inte spara ordern');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <View style={styles.container}>
      <TopHeader
        title={`${subcategory?.name} kr`}
        icon={'chevron-left'}
        onPress={() => navigation.goBack()}
        textStyle={{fontSize: 16, textTransform: "uppercase"}}
        iconBackground="#3b3687"
        style={{ backgroundColor: "#3b3687" }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 20 }}>
          <View style={styles.receipt}>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Pris:</Text>
              <Text style={styles.itemValue}>{subcategory?.price} kr</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Moms:</Text>
              <Text style={styles.itemValue}>{subcategory?.moms} kr</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Data:</Text>
              <Text style={styles.itemValue}>{subcategory?.data}</Text>
            </View>
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Giltighet:</Text>
              <Text style={styles.itemValue}>{subcategory?.validity}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{subcategory?.price} kr</Text>
            </View>
          </View>

          <View style={styles.warning}>
            <Icon name="alert-circle" size={24} color="#D32F2F" style={{ marginRight: 10 }} />
            <Text style={styles.warningText}>
              Observera: När Koden har skrivits ut kan den inte längre makuleras eller återbetalas.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={() => setShowOtpInput(true)}>
              <Text style={styles.checkoutButtonText}>Skriv ut koden</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={showOtpInput} onRequestClose={() => setShowOtpInput(false)} animationType="slide">
            <TopHeader
              title={'Skriv pinkoden'}
              style={{ backgroundColor: "#3b3687" }}
              iconBackground='#3b3687'
              icon={true}
              iconName='close'
              onPress={() => setShowOtpInput(false)}
            />
            <PincodeInput onPress={(pinCode) => handleOtpSubmit(pinCode)} backgroundColor='#3b3687' />
          </Modal>

          <Modal visible={showVoucherModal} onRequestClose={() => setShowVoucherModal(false)} animationType="slide">
            <View style={{ flex: 1, backgroundColor: '#ffffff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#333', fontFamily: "ComviqSansWebBold" }}>{subcategory?.name}</Text>
                <Icon name="information-outline" size={24} color="#e2027b" />
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View style={{ backgroundColor: '#f7f7f7', padding: 15, borderRadius: 5, marginBottom: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5, fontFamily: "ComviqSansWebBold" }}>Vouchernummer:</Text>
                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, fontFamily: "ComviqSansWeb" }}>{voucherInfo?.voucherNumber}</Text>
                  </View>
                  <View style={{ backgroundColor: '#f7f7f7', padding: 15, borderRadius: 5, marginBottom: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5, fontFamily: "ComviqSansWebBold" }}>Pris:</Text>
                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, fontFamily: "ComviqSansWeb" }}>{subcategory?.price} kr</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ backgroundColor: '#f7f7f7', padding: 15, borderRadius: 5, marginBottom: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5, fontFamily: "ComviqSansWebBold" }}>Serienummer:</Text>
                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, fontFamily: "ComviqSansWeb" }}>{voucherInfo?.serialNumber}</Text>
                  </View>
                  <View style={{ backgroundColor: '#f7f7f7', padding: 15, borderRadius: 5, marginBottom: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5, fontFamily: "ComviqSansWebBold" }}>Datamängd:</Text>
                    <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, fontFamily: "ComviqSansWeb" }}>{subcategory?.data}</Text>
                  </View>
                </View>
              </View>
              <View style={{ backgroundColor: '#f7f7f7', padding: 15, borderRadius: 5, marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5, fontFamily: "ComviqSansWebBold" }}>Giltighetstid:</Text>
                <Text style={{ fontSize: 12, color: '#666', lineHeight: 18, fontFamily: "ComviqSansWeb" }}>{subcategory?.validity}</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: '#3b3687', padding: 20, borderRadius: 5, marginTop: 20 }} onPress={() => navigation.navigate('INTRO')}>
                <Text style={{ fontSize: 16, color: '#ffffff', textAlign: 'center', fontFamily: "ComviqSansWebBold" }}>Tillbaka till huvudmeny</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b3687" />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  receipt: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
    fontFamily: "ComviqSansWebBold",
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    lineHeight: 24,
    fontFamily: "ComviqSansWebBold",
  },
  itemValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    fontFamily: "ComviqSansWebBold",
  },
  totalValue: {
    fontSize: 18,
    color: '#333',
    lineHeight: 28,
    fontFamily: "ComviqSansWebBold",
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderColor: '#D32F2F',
    borderWidth: 1,
  },
  warningText: {
    flex: 1,
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  checkoutButton: {
    backgroundColor: '#3b3687',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    letterSpacing: 0.5,
    fontFamily: "ComviqSansWebBold",
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3b3687',
    fontFamily: "ComviqSansWebBold",
  },
  voucherModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  voucherBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  voucherDetails: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  voucherText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: "ComviqSansWebBold",
  },
});