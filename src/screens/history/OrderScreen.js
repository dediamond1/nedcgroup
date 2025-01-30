import React, { useState, useLayoutEffect, useContext } from 'react';
import { FlatList, View, Alert, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../components/appText';
import { AppButton } from '../../components/button/AppButton';
import { TopHeader } from '../../components/header/TopHeader';
import { OrderItems } from '../../components/orderItems/OrderItems';
import { baseUrl } from '../../constants/api';
import { AuthContext } from '../../context/auth.context';
import { AppScreen } from '../../helper/AppScreen';
import { getToken, removeToken } from '../../helper/storage';
import { NormalLoader } from '../../../helper/Loader2';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';
import Icon from 'react-native-vector-icons/Ionicons';

export const OrderHistory = ({route}) => {

  const {operator} = route?.params
  const [orderHistory, setOrderHistory] = useState([]);
  const [filteredOrderHistory, setFilteredOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const { setInActive } = useContext(AuthContext);
  const { companyInfo, getCompanyInfo } = useGetCompanyInfo();

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const jsontoken = await getToken();
      const token = JSON.parse(jsontoken);
      await getCompanyInfo();

      let url = `${baseUrl}/api/order`;
      if (operator === 'LYCA') {
        url = `${baseUrl}/api/lyca-order`;
      }

      const response = await fetch(url, {
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
        setFilteredOrderHistory(data?.orderlist || []);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching orders:', error);
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

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = orderHistory.filter(
      (item) =>
        item.voucherNumber.toLowerCase().includes(text.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOrderHistory(filtered);
  };

  const resetSearch = () => {
    setSearchQuery('');
    setFilteredOrderHistory(orderHistory);
  };

  if (loading) {
    return <NormalLoader loading={loading} subTitle='laddar oder historiken...'/>;
  }

  return (
    <AppScreen
      style={styles.screen}
      iconAction={() => navigation.navigate('INTRO')}
      showIcon={true}>
      <TopHeader title={'Orderhistoriken'} icon onPress={() => navigation.goBack()} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={handleSearch}
          keyboardType='number-pad'
          value={searchQuery}
          placeholder="Sök vouchernummer/serienummer"
        />
       
          <TouchableOpacity onPress={resetSearch} style={styles.resetButton}>
            <Icon name="close-circle" size={24} color="#fff" />
            <AppText text="Återställ" style={styles.resetText} />
          </TouchableOpacity>
       
      </View>
      {filteredOrderHistory.length ? (
        <FlatList
          refreshing={loading}
          onRefresh={getAllOrders}
          contentContainerStyle={styles.flatListContent}
          data={filteredOrderHistory}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={<View style={styles.flatListFooter} />}
          renderItem={({ item }) => (
            <OrderItems
              item={item}
              onPress={() => navigation.navigate('ORDER_DETAILS', { data: item, companyInfo: companyInfo, operator })}
            />
          )}
        />
      ) : (
        <View style={styles.noHistoryContainer}>
          <AppText
            text={'Ingen orderhistorik hittades'}
            style={styles.noHistoryText}
          />
          <AppButton
            text={'Hämta orderhistoriken '}
            icon="reload"
            iconColor="#222222"
            textStyle={styles.buttonText}
            style={styles.button}
            onPress={getAllOrders}
          />
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: { 
    flex: 1 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: '#3b3687',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  filterIcon: {
    paddingLeft: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: 'ComviqSansWebBold',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b3687',
    padding: 8,
  },
  resetText: {
    marginLeft: 5,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
    textTransform: 'uppercase',
    fontSize: 14,
  },
  flatListContent: { 
    padding: 10 
  },
  flatListFooter: { 
    height: 60 
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 16,
    alignItems: 'center',
  },
  noHistoryText: { 
    color: '#222222', 
    fontSize: 17.4 
  },
  buttonText: { 
    flex: 1, 
    color: '#222222' 
  },
  button: {
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#222222',
    borderWidth: 1,
  },
});
