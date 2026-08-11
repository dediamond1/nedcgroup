/**
 * Telia/Halebop voucher print screen — now a thin screen over the shared
 * printer (operatorPrint.js) + the per-operator print config.
 *
 * Behaviour preserved from the legacy screen: auto-print when bluetooth +
 * company info are ready, manual retry button, done → INTRO.
 */
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { TopHeader } from '../../components/header/TopHeader';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';
import { fetchVoucherConfig } from '../../utils/voucherConfig';
import { BluetoothManager } from '@brooons/react-native-bluetooth-escpos-printer';
import { initBluetoothPrinter, printVoucher } from '../../components/operator/operatorPrint';
import { getOperatorConfig } from '../../components/operator/operatorConfigs';
import { selectTeliaHalebop } from '../../redux/features/auth/authSlice';

const TeliaHalebopPrintScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { voucherInfo, product, companyInfo: routeCompanyInfo } = route.params || {};
  const teliaHalebop = useSelector(selectTeliaHalebop);

  const config = getOperatorConfig(teliaHalebop);
  const COLOR = config.colors.primary;

  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [voucherConfigData, setVoucherConfigData] = useState(null);
  const [hasPrinted, setHasPrinted] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  const { companyInfo: hookCompanyInfo, getCompanyInfo, loading: companyInfoLoading } = useGetCompanyInfo();
  const companyInfo = routeCompanyInfo || hookCompanyInfo;

  useEffect(() => {
    if (!routeCompanyInfo) getCompanyInfo();
  }, []);

  useEffect(() => {
    const loadVoucherConfig = async () => {
      if (isLoadingConfig || voucherConfigData) return;
      setIsLoadingConfig(true);
      try {
        const configData = await fetchVoucherConfig();
        if (configData) setVoucherConfigData(configData);
      } finally {
        setIsLoadingConfig(false);
      }
    };
    loadVoucherConfig();
  }, []);

  useEffect(() => {
    const init = async () => {
      const printer = await initBluetoothPrinter({ onStatus: setStatusText });
      if (printer) {
        setBoundAddress(printer.boundAddress);
        setStatusText('Bluetooth redo.');
      } else {
        setStatusText('Ingen sparad skrivare hittades. Vänligen para en skrivare i enhetens inställningar.');
      }
    };
    init();
    return () => {
      if (boundAddress) {
        BluetoothManager?.disconnect(boundAddress).catch(() => {});
      }
    };
  }, []);

  // Auto-print when bluetooth is bound and company info is available.
  useEffect(() => {
    const companyInfoReady = routeCompanyInfo || (!companyInfoLoading && companyInfo);
    if (boundAddress && !hasPrinted && !loading && companyInfoReady) {
      doPrint();
    }
  }, [boundAddress, hasPrinted, loading, companyInfoLoading, companyInfo, routeCompanyInfo]);

  const handleDone = () => navigation.navigate('INTRO');

  const doPrint = async () => {
    if (loading) return;
    if (!routeCompanyInfo && (companyInfoLoading || !companyInfo)) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!companyInfo) await getCompanyInfo();
    }
    try {
      setLoading(true);
      setHasPrinted(true);
      await printVoucher({
        config: config.print,
        item: product,
        voucherInfo: {
          voucherNumber: voucherInfo?.voucherNumber,
          serialNumber: voucherInfo?.serialNumber,
          expireDate: voucherInfo?.expireDate,
        },
        companyInfo,
        voucherConfigData,
        boundAddress,
        onStatus: setStatusText,
      });
      setStatusText('Voucher utskriven!');
    } catch (error) {
      console.error('Print error:', error);
      setHasPrinted(false); // allow retry
      Alert.alert('Fel', error.message || 'Det gick inte att skriva ut voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLOR }]}>
      <TopHeader
        title="Voucher Details"
        style={{ backgroundColor: COLOR }}
        iconBackground={COLOR}
        icon
        iconName="close"
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

          <TouchableOpacity
            style={[styles.printButton, { backgroundColor: loading ? '#cccccc' : COLOR, opacity: loading ? 0.7 : 1 }]}
            onPress={doPrint}
            disabled={loading}
          >
            <Text style={styles.printButtonText}>{loading ? 'Skriver ut...' : 'Skriv ut Voucher'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: COLOR }]}
          onPress={handleDone}
          disabled={loading}
        >
          <Text style={styles.doneButtonText}>Tillbaka till huvudmeny</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLOR} />
            {!!statusText && <Text style={styles.statusText}>{statusText}</Text>}
          </View>
        )}
        {!loading && !!statusText && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20, justifyContent: 'space-between' },
  content: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  doneButton: { padding: 20, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  doneButtonText: { fontSize: 16, color: '#ffffff', fontFamily: 'azo_sans-700' },
  printButton: { padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  printButtonText: { fontSize: 16, color: '#ffffff', fontFamily: 'azo_sans-700' },
  loaderContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center' },
  statusContainer: { marginTop: 10, alignItems: 'center' },
  statusText: { fontSize: 16, color: '#333', fontFamily: 'azo_sans-700', textAlign: 'center' },
});

export default TeliaHalebopPrintScreen;
