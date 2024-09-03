import React, { useState, useLayoutEffect, useContext } from 'react';
import { FlatList, Modal, View, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../components/appText';
import { AppButton } from '../../components/button/AppButton';
import { TopHeader } from '../../components/header/TopHeader';
import { OrderItems } from '../../components/orderItems/OrderItems';
import { baseUrl } from '../../constants/api';
import { AuthContext } from '../../context/auth.context';
import { AppScreen } from '../../helper/AppScreen';
import { getToken, removeToken } from '../../helper/storage';
import { generatePDF } from '../../helper/Share'; // Ensure this path is correct
import { WebView } from 'react-native-webview';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { NormalLoader } from '../../../helper/Loader2';
export const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
  const navigation = useNavigation();
  const { setInActive } = useContext(AuthContext);

  const checkAndRequestPermissions = async () => {
    const permission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY;

    try {
      const result = await check(permission);

      if (result === RESULTS.GRANTED) {
        console.log('Permission is granted');
        return true;
      } else if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          console.log('Permission granted after request');
          return true;
        } else {
          console.error('Permission request denied');
          Alert.alert(
            'Permission Required',
            'To generate and view the PDF, the app needs access to your storage. Please grant the permission in your settings.',
            [{ text: 'Open Settings', onPress: () => openSettings() }]
          );
          return false;
        }
      } else {
        console.error('Permission result is not granted or denied');
        return false;
      }
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const jsontoken = await getToken();
      const token = JSON.parse(jsontoken);

      const response = await fetch(`${baseUrl}/api/order`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data?.message === 'invalid token in the request.') {
        Alert.alert('OBS...', 'DU HAR BLIVIT UTLOGGAD');
        await removeToken();
      }
      if (
        data?.message ===
        'Company deativted because you have reached Credit Limit'
      ) {
        setInActive(true);
      } else {
        setOrderHistory(data?.orderlist || []);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching orders:', error);
    }
  };

  const generateAndShowPDF = async () => {
    const hasPermission = await checkAndRequestPermissions();
    if (!hasPermission) {
      return;
    }

    try {
      const { uri } = await generatePDF(orderHistory);
      setPdfUri(uri);
      setShowPdfModal(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getAllOrders();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation]);

  if (loading) {
    return <NormalLoader loading={loading} subTitle='laddar oder historiken...'/>;
  }

  return (
    <AppScreen
      style={{ flex: 1 }}
      iconAction={() => navigation.goBack()}
      showIcon={true}>
      <TopHeader title={'Orderhistoriken'} icon onPress={() => navigation.goBack()} />
      <AppButton
        text={"Generate PDF"}
        onPress={generateAndShowPDF}
      />
      {orderHistory.length ? (
        <FlatList
          refreshing={loading}
          onRefresh={getAllOrders}
          contentContainerStyle={{ padding: 10 }}
          data={orderHistory}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={<View style={{ height: 60 }} />}
          renderItem={({ item }) => (
            <OrderItems
              item={item}
              onPress={() => navigation.navigate('ORDER_DETAILS', { data: item })}
            />
          )}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'space-evenly',
            padding: 16,
            alignItems: 'center',
          }}>
          <AppText
            text={'Ingen orderhistorik hittades'}
            style={{ color: '#222222', fontSize: 17.4 }}
          />
          <AppButton
            text={'Hämta orderhistoriken '}
            icon="reload"
            iconColor="#222222"
            textStyle={{ flex: 1, color: '#222222' }}
            style={{
              width: '100%',
              backgroundColor: '#fff',
              borderColor: '#222222',
              borderWidth: 1,
            }}
            onPress={getAllOrders}
          />
        </View>
      )}
      {pdfUri && (
        <Modal
          visible={showPdfModal}
          onRequestClose={() => setShowPdfModal(false)}
          style={{ flex: 1 }}
        >
          <TopHeader
            title="PDF Preview"
            icon="close"
            onPress={() => setShowPdfModal(false)}
          />
          <View style={{ flex: 1 }}>
            <WebView
              source={{ uri: pdfUri }}
              style={{ flex: 1 }}
            />
          </View>
        </Modal>
      )}
    </AppScreen>
  );
};
