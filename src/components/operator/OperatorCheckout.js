/**
 * Shared operator checkout — the telia / halebop / lyca flows are ~95%
 * identical (product info -> PIN confirm -> order create -> voucher print),
 * so one config-driven component drives all three. The only differences live
 * in src/components/operator/operatorConfigs.js (per-operator colors, routes,
 * layouts, print sections, message strings).
 *
 * Behavior is preserved exactly from the two legacy screens:
 *   - lyca (LycaDetailsScreen): receipt layout, inline bluetooth print,
 *     voucher modal, order-create header uses the storage token (userToken).
 *   - telia/halebop (Telia-hale-singleProduct): features layout, navigates to
 *     the standalone print screen, order-create header uses the context token.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';
import { logout } from '../../redux/features/auth/authSlice';
import { confirmPin } from '../../redux/features/auth/authActions';
import {
  useTeliaVouchersMutation,
  useLazyLycaReserveQuery,
  useTeliaOrderCreateMutation,
  useLycaOrderCreateMutation,
} from '../../redux/api/checkoutApi';
import { useVoucherConfigQuery } from '../../redux/api/catalogApi';
import { resolveVoucherConfig } from '../../utils/voucherConfig';
import { TopHeader } from '../header/TopHeader';
import { PincodeInput } from '../../../helper/PincodeInput';
import { initBluetoothPrinter, printVoucher } from './operatorPrint';

const OperatorCheckout = ({ config, item }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { setInActive, companyInfo, getCompanyInfo } = useGetCompanyInfo();

  const checkout = config.checkout;
  const print = config.print;

  const isTelia = config.key === 'telia' || config.key === 'halebop';
  const [teliaVouchers] = useTeliaVouchersMutation();
  const [lycaReserve] = useLazyLycaReserveQuery();
  const [teliaOrderCreate] = useTeliaOrderCreateMutation();
  const [lycaOrderCreate] = useLycaOrderCreateMutation();
  const { data: voucherConfigData } = useVoucherConfigQuery(undefined, {
    skip: !checkout.loadVoucherConfig,
  });
  // Normalize the voucher-config response (data.data | direct object | fallback).
  const resolvedVoucherConfig = resolveVoucherConfig(voucherConfigData);
  const color = checkout.layout === 'receipt' ? config.colors.secondary : config.colors.primary;

  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [boundAddress, setBoundAddress] = useState('');
  const [voucherInfo, setVoucherInfo] = useState({});
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  useEffect(() => {
    getCompanyInfo();
  }, []);

  // Lyca: inline printing needs bluetooth + voucher config ready on mount.
  useEffect(() => {
    if (!checkout.initBluetooth) return;
    (async () => {
      try {
        const printer = await initBluetoothPrinter({ onStatus: setStatusText });
        if (printer) setBoundAddress(printer.boundAddress);
        setStatusText('');
      } catch (error) {
        console.error('Bluetooth-initialiseringsfel:', error);
        Alert.alert('Bluetooth-fel', 'Det gick inte att initiera Bluetooth. Försök igen.');
      }
    })();
  }, []);

  useEffect(() => {
    if (!checkout.loadVoucherConfig) return;
    // voucher config flows through the RTK Query cache (useVoucherConfigQuery)
    // — resolved in the render below via resolveVoucherConfig.
  }, []);

  const handleOtpSubmit = (pinCode) => {
    if (pinCode.length === 4) {
      verifyPincode(pinCode);
    } else {
      Alert.alert('OBS', 'Pinkoden måste vara 4 siffror');
    }
  };

  const verifyPincode = async (pinCode) => {
    try {
      setLoading(true);
      setStatusText('Verifierar pinkoden...');

      const resultAction = await dispatch(confirmPin({ pinCode }));
      if (resultAction.type.endsWith('/rejected')) {
        Alert.alert('Error', 'Ett fel uppstod. Försök igen.');
        return;
      }
      const response = resultAction.payload;

      switch (response?.data?.message) {
        case checkout.deactivationMessage:
          setInActive(true);
          break;
        case 'pin code is required':
        case 'invalid email or pin.':
          Alert.alert('OBS', 'Ange rätt pinkod');
          break;
        case 'invalid token in the request.':
          Alert.alert(checkout.invalidTokenAlert.title, checkout.invalidTokenAlert.message, checkout.invalidTokenAlert.withRelogin
            ? [{ text: 'Logga in igen', onPress: () => dispatch(logout()) }]
            : undefined);
          break;
        case 'Pin code is Correct':
          setShowOtpInput(false);
          await processTransaction();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error verifying pincode:', error);
      Alert.alert('Error', 'Ett fel uppstod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const processTransaction = async () => {
    try {
      setLoading(true);

      // Fetch the voucher through the RTK Query checkout API (auth header is
      // injected automatically from the store — no per-call token plumbing).
      // On failure surface the server's real message instead of a silent null
      // (a 401/5xx/network error previously collapsed into the generic
      // "Kunde inte hämta voucher." fallback and hid the actual cause).
      const prebookError = (e) => ({
        data: {
          success: false,
          message: e?.data?.message || e?.error || 'Kunde inte hämta voucher.',
        },
      });
      const voucherResult = isTelia
        ? checkout.voucherFromResponse(
            (await teliaVouchers(checkout.voucherRequest(item)).unwrap().catch(prebookError))?.data
          )
        : checkout.voucherFromResponse(
            (await lycaReserve(checkout.voucherRequest(item)).unwrap().catch(prebookError))?.data,
            item,
          );

      if (!voucherResult.ok) {
        if (voucherResult.closeOtp) setShowOtpInput(false);
        if (voucherResult.statusText) setStatusText(voucherResult.statusText);
        if (voucherResult.alert) Alert.alert(voucherResult.alertTitle || 'Fel', voucherResult.alert);
        setLoading(false);
        return;
      }
      const voucher = voucherResult.voucher;

      setStatusText('Sparar order...');
      const orderBody = checkout.orderCreate.body(item, voucher);
      const orderRes = isTelia
        ? await teliaOrderCreate(orderBody)
        : await lycaOrderCreate(orderBody);
      const data = orderRes?.data;

      // Order-create failure must be visible, not silently passed through to print.
      if (!data) {
        Alert.alert(
          'Fel',
          orderRes?.error?.data?.message || orderRes?.error?.error || 'Kunde inte spara ordern. Försök igen.'
        );
        setLoading(false);
        return;
      }

      if (data?.message === checkout.deactivationMessage) {
        setInActive(true);
      } else if (data?.message === 'invalid token in the request.') {
        Alert.alert(checkout.invalidTokenAlert.title, checkout.invalidTokenAlert.message, checkout.invalidTokenAlert.withRelogin
          ? [{ text: 'Logga in igen', onPress: () => dispatch(logout()) }]
          : undefined);
      } else if (data?.message === checkout.invalidTimeMessage) {
        Alert.alert('OBS', checkout.invalidTimeAlert);
      } else if (checkout.printMode === 'navigate') {
        navigation.navigate(checkout.printRoute, checkout.buildPrintParams(voucher, item, companyInfo));
      } else {
        // inline print (lyca)
        await printVoucher({
          config: print,
          item,
          voucherInfo: { voucherNumber: voucher.voucherNumber, serialNumber: voucher.serialNumber },
          companyInfo,
          voucherConfigData: resolvedVoucherConfig,
          boundAddress,
          onStatus: setStatusText,
        });
        setVoucherInfo(voucher);
        setShowVoucherModal(true);
      }
    } catch (error) {
      console.error('Transaction Error:', error);
      Alert.alert('Fel', error?.message || 'Ett fel uppstod under transaktionen.');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  const renderBody = () => {
    if (checkout.layout === 'receipt') {
      return (
        <View style={styles.receipt}>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Pris:</Text>
            <Text style={styles.itemValue}>{item?.price} kr</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Moms:</Text>
            <Text style={styles.itemValue}>{item?.moms} kr</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Data:</Text>
            <Text style={styles.itemValue}>{item?.data}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Giltighet:</Text>
            <Text style={styles.itemValue}>{item?.validity}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{item?.price} kr</Text>
          </View>
        </View>
      );
    }

    // features layout (telia/halebop)
    const details = parseDescription(item?.description);
    return (
      <>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color }]}>{item?.price} kr</Text>
          <Text style={styles.duration}>
            {item?.description?.includes('Vecka') ? '/ vecka' : '/ månad'}
          </Text>
        </View>
        <View style={styles.featuresContainer}>
          {details.map((detail, index) => (
            <View key={index} style={[styles.featureItem, index === 0 && styles.mainFeatureItem]}>
              <Icon
                name={detail.icon}
                size={index === 0 ? 20 : 24}
                color={color}
                style={styles.featureIcon}
              />
              <Text style={[styles.featureText, index === 0 && styles.mainFeatureText]}>
                {detail.text}
              </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TopHeader
        title={checkout.headerTitle(item)}
        icon
        onPress={() => navigation.goBack()}
        textStyle={checkout.headerTextStyle}
        iconBackground={color}
        style={{ backgroundColor: color }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 20 }}>
          {renderBody()}

          {checkout.layout === 'receipt' && (
            <View style={styles.warning}>
              <MaterialIcon name="alert-circle" size={24} color="#D32F2F" style={{ marginRight: 10 }} />
              <Text style={styles.warningText}>
                Observera: När Koden har skrivits ut kan den inte längre makuleras eller återbetalas.
              </Text>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.checkoutButton, { backgroundColor: color }]}
              onPress={() => setShowOtpInput(true)}
            >
              <Text style={styles.checkoutButtonText}>
                {checkout.layout === 'receipt' ? 'Skriv ut koden' : 'Köp'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showOtpInput} onRequestClose={() => setShowOtpInput(false)} animationType="slide">
        <TopHeader
          title="Skriv pinkoden"
          style={{ backgroundColor: color }}
          iconBackground={color}
          icon
          iconName="close"
          onPress={() => setShowOtpInput(false)}
        />
        <PincodeInput onPress={handleOtpSubmit} backgroundColor={color} />
      </Modal>

      {showVoucherModal && (
        <Modal visible={showVoucherModal} onRequestClose={() => setShowVoucherModal(false)} animationType="slide">
          <View style={styles.voucherModal}>
            <View style={styles.voucherModalHeader}>
              <Text style={styles.voucherModalTitle}>{item?.name}</Text>
              <MaterialIcon name="information-outline" size={24} color={config.colors.primary} />
            </View>
            <View style={styles.voucherModalColumns}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <View style={styles.voucherBox}>
                  <Text style={styles.voucherBoxLabel}>Vouchernummer:</Text>
                  <Text style={styles.voucherBoxValue}>{voucherInfo?.voucherNumber}</Text>
                </View>
                <View style={styles.voucherBox}>
                  <Text style={styles.voucherBoxLabel}>Pris:</Text>
                  <Text style={styles.voucherBoxValue}>{item?.price} kr</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.voucherBox}>
                  <Text style={styles.voucherBoxLabel}>Serienummer:</Text>
                  <Text style={styles.voucherBoxValue}>{voucherInfo?.serialNumber}</Text>
                </View>
                <View style={styles.voucherBox}>
                  <Text style={styles.voucherBoxLabel}>Datamängd:</Text>
                  <Text style={styles.voucherBoxValue}>{item?.data}</Text>
                </View>
              </View>
            </View>
            <View style={styles.voucherBox}>
              <Text style={styles.voucherBoxLabel}>Giltighetstid:</Text>
              <Text style={styles.voucherBoxValue}>{item?.validity}</Text>
            </View>
            <TouchableOpacity
              style={[styles.voucherHomeButton, { backgroundColor: config.colors.secondary }]}
              onPress={() => navigation.navigate(config.homeRoute)}
            >
              <Text style={styles.voucherHomeButtonText}>Tillbaka till huvudmeny</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={color} />
          {!!statusText && <Text style={styles.statusText}>{statusText}</Text>}
        </View>
      )}
    </View>
  );
};

/** Parse a telia-style description into feature rows (features layout only). */
const parseDescription = (desc) => {
  if (!desc) return [];
  const details = [{ icon: 'information-circle-outline', text: desc }];
  if (desc.includes('GB') || desc.includes('Obegränsad')) {
    details.push({
      icon: 'wifi-outline',
      text: desc.includes('Obegränsad') ? 'Obegränsad surf' : desc.match(/(\d+ GB)|(Obegränsad)/)[0],
    });
  }
  if (desc.includes('minuter') || desc.includes('Fria samtal')) {
    details.push({
      icon: 'call-outline',
      text: desc.includes('Fria samtal') ? 'Fria samtal' : desc.match(/(\d+ minuter)|(Fria samtal)/)[0],
    });
  }
  if (desc.includes('SMS') || desc.includes('Fria SMS')) {
    details.push({
      icon: 'chatbubble-outline',
      text: desc.includes('Fria SMS') ? 'Fria SMS' : desc.match(/(\d+ SMS)|(Fria SMS)/)[0],
    });
  }
  return details;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContainer: { paddingBottom: 40 },
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
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  itemLabel: { fontSize: 16, fontWeight: '500', color: '#555', lineHeight: 24, fontFamily: 'ComviqSansWebBold' },
  itemValue: { fontSize: 16, color: '#333', lineHeight: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#ddd' },
  totalLabel: { fontSize: 18, color: '#333', lineHeight: 28, fontFamily: 'ComviqSansWebBold' },
  totalValue: { fontSize: 18, color: '#333', lineHeight: 28, fontFamily: 'ComviqSansWebBold' },
  warning: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', padding: 15, borderRadius: 10, marginTop: 20 },
  warningText: { flex: 1, color: '#C62828', fontSize: 13, lineHeight: 18, fontFamily: 'ComviqSansWeb' },
  footer: { marginTop: 24 },
  checkoutButton: { padding: 18, borderRadius: 8, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontFamily: 'ComviqSansWebBold' },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  price: { fontSize: 36, fontFamily: 'azo_sans-700' },
  duration: { fontSize: 16, color: '#666', fontFamily: 'azo_sans-400', marginLeft: 4 },
  featuresContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  featureItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  mainFeatureItem: { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 12, paddingTop: 0 },
  featureIcon: { marginRight: 12, width: 24, textAlign: 'center' },
  featureText: { fontSize: 14, fontFamily: 'azo_sans-400', color: '#333', flex: 1, lineHeight: 20 },
  mainFeatureText: { fontSize: 15, fontFamily: 'azo_sans-500', color: '#444', lineHeight: 22 },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: { marginTop: 10, color: '#fff' },
  voucherModal: { flex: 1, backgroundColor: '#ffffff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  voucherModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  voucherModalTitle: { fontSize: 18, fontWeight: '700', color: '#333', fontFamily: 'ComviqSansWebBold' },
  voucherModalColumns: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  voucherBox: { backgroundColor: '#f7f7f7', padding: 15, borderRadius: 5, marginBottom: 10 },
  voucherBoxLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 5, fontFamily: 'ComviqSansWebBold' },
  voucherBoxValue: { fontSize: 12, color: '#666', lineHeight: 18, fontFamily: 'ComviqSansWeb' },
  voucherHomeButton: { padding: 20, borderRadius: 5, marginTop: 20 },
  voucherHomeButtonText: { fontSize: 16, color: '#ffffff', textAlign: 'center', fontFamily: 'ComviqSansWebBold' },
});

export default OperatorCheckout;
