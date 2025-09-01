import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
  Alert,
  Modal
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/auth.context';
import { PincodeInput } from '../../../helper/PincodeInput';
import { api } from '../../api/api';
import { TopHeader } from '../../components/header/TopHeader';
import { useGetCompanyInfo } from '../../hooks/useGetCompanyInfo';

const TeliaHalebopSingleProductScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {product} = route.params || {};
  const buttonScale = new Animated.Value(1);
  const { teliaHalebop, user, setUser } = useContext(AuthContext);
  const { setInActive } = useGetCompanyInfo(); // Use setInActive from hook

  
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [statusText, setStatusText] = useState('');
  // Removed voucherInfo state as it's passed directly to the new screen
  // Removed showVoucherModal state
  
  console.log(product)
  const animateButton = (scaleValue) => {
    Animated.spring(buttonScale, {
      toValue: scaleValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCheckout = () => {
    setShowOtpInput(true);
  };

  const handleOtpSubmit = async (pinCode) => {
    if (pinCode.length === 4) {
      await verifyPincode(pinCode);
    } else {
      Alert.alert('OBS', 'Pinkoden måste vara 4 siffror');
    }
  };

  const verifyPincode = async (pinCode) => {
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
          await processTransaction(); // Call the new function
          break;
        default:
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Ett fel uppstod. Försök igen.');
    } finally {
      setLoading(false);
    }
  };

  const processTransaction = async () => {
    try {
      setLoading(true);
      

      // Call the voucher API first
      const voucherResponse = await api.post('/api/telia/vouchers', {
        id: product.id,
        value: product.price,
      }, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      if (!voucherResponse?.data?.success) {
         // Handle potential errors from the voucher API
         Alert.alert('Fel', voucherResponse?.data?.message || 'Kunde inte hämta voucher.');
         setLoading(false); // Ensure loading is set to false on error
         return; // Stop the process if voucher fetching fails
      }

      const voucherInfo = voucherResponse.data; // Get the voucher details
      const prebookId = voucherInfo.prebookId;

      // setStatusText('Bekräftar voucher...');
      // Call the acknowledge voucher API
      // const acknowledgeResponse = await api.patch(`/vouchers/${prebookId}`, {}, {
      //    headers: {
      //       Authorization: `Bearer ${user}`,
      //    },
      // });

      // Assuming acknowledgeResponse indicates success if no error is thrown
      // Add specific success check if the API returns a success field
      // if (!acknowledgeResponse?.data?.success) {
      //    Alert.alert('Fel', acknowledgeResponse?.data?.message || 'Kunde inte bekräfta voucher.');
      //    setLoading(false);
      //    return;
      // }


      setStatusText('Sparar order...');
      // Make the actual API call to save the Telia order
      const orderResponse = await api.post('/api/teliaOrder/create', {
        serialNumber: voucherInfo.serialNumber,
        voucherNumber: voucherInfo.voucherNumber,
        voucherDescription: product.name,
        articleId: product.articleId,
        voucherAmount: product.price,
        voucherCurrency: "SEK",
        prebookId: prebookId,
        expireDate: null,
        employeeId: null,
        operator: product?.operator
      }, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      });

      console.log("orderResponseTelia", orderResponse.data)

      if (orderResponse?.data?.message === 'Company deactivated because you have reached Credit Limit') {
        setInActive(true);
      } else if (orderResponse?.data?.message === 'invalid token in the request.') {
        Alert.alert('OBS', 'Du har blivit utloggad, vänligen logga in igen', [{
          text: 'Logga in igen',
          onPress: () => setUser(null),
        }]);
      } else {
        // On successful order save, navigate to the print screen with complete voucher data
        navigation.navigate('TeliaHalebopPrintScreen', {
          voucherInfo: {
            voucherNumber: voucherInfo.voucherNumber,
            serialNumber: voucherInfo.serialNumber,
            expireDate: voucherInfo.expireDate // Add expireDate from voucher response
          },
          product: product
        });
      }

    } catch (error) {
      console.error('Transaction Error:', error); // Log the error for debugging
      Alert.alert('Fel', 'Ett fel uppstod under transaktionen.');
    } finally {
      setLoading(false);
    }
  };

  // Parse the description to extract relevant information
  const parseDescription = (desc) => {
    if (!desc) return { details: [] };
    
    // Extract all numeric values with units from description
    const matches = desc.match(/(\d+)\s*(GB|kr|minuter|SMS)|(Obegränsad|Fria)/gi) || [];
    const details = [];
    
    // Add the full description as first item
    details.push({
      icon: 'information-circle-outline',
      text: desc
    });

    // Add specific features
    if (desc.includes('GB') || desc.includes('Obegränsad')) {
      details.push({
        icon: 'wifi-outline',
        text: desc.includes('Obegränsad') ? 'Obegränsad surf' : desc.match(/(\d+ GB)|(Obegränsad)/)[0]
      });
    }
    
    if (desc.includes('minuter') || desc.includes('Fria samtal')) {
      details.push({
        icon: 'call-outline',
        text: desc.includes('Fria samtal') ? 'Fria samtal' : desc.match(/(\d+ minuter)|(Fria samtal)/)[0]
      });
    }
    
    if (desc.includes('SMS') || desc.includes('Fria SMS')) {
      details.push({
        icon: 'chatbubble-outline',
        text: desc.includes('Fria SMS') ? 'Fria SMS' : desc.match(/(\d+ SMS)|(Fria SMS)/)[0]
      });
    }

    return { details };
  };

  const productDetails = parseDescription(product.description);

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>
      <StatusBar barStyle="light-content" backgroundColor={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} />
      <View style={styles.container}>
      <TopHeader icon={true} onPress={()=> navigation.goBack()} iconBackground={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} title={product.id} style={{ backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687" }} />


        <ScrollView style={styles.content}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, {color: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]}>{product.price} kr</Text>
            <Text style={styles.duration}>
              {product.description.includes('Vecka') ? '/ vecka' : '/ månad'}
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {productDetails.details.map((detail, index) => (
              <View 
                key={index} 
                style={[
                  styles.featureItem,
                  index === 0 && styles.mainFeatureItem
                ]}
              >
                <Icon 
                  name={detail.icon} 
                  size={index === 0 ? 20 : 24} 
                  color={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} 
                  style={styles.featureIcon}
                />
                <Text style={[
                  styles.featureText,
                  index === 0 && styles.mainFeatureText
                ]}>
                  {detail.text}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {showOtpInput && (
          <Modal visible={showOtpInput} onRequestClose={() => setShowOtpInput(false)} animationType="slide">
            <TopHeader
              title={'Skriv pinkoden'}
              style={{ backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687" }}
              iconBackground={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}
              icon={true}
              iconName='close'
              onPress={() => setShowOtpInput(false)}
            />
            <PincodeInput onPress={(pinCode) => handleOtpSubmit(pinCode)} backgroundColor={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} />
          </Modal>
        )}

        {loading && (
          <View style={[StyleSheet.absoluteFill, {
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center'
          }]}>
            <ActivityIndicator size="large" color={teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"} />
            {statusText && <Text style={{ marginTop: 10, color: '#fff' }}>{statusText}</Text>}
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCancel}
          >
            <Icon name="close-circle-outline" size={24} color="#FF3B30" />
            <Text style={[styles.buttonText, { color: '#FF3B30' }]}>Avbryt</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.buyButton, {backgroundColor: teliaHalebop === "Telia" ? "#990AE3" : "#3b3687"}]} 
            onPress={handleCheckout}
          >
            <Icon name="checkmark-circle-outline" size={24} color="#FFFFFF" />
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Köp</Text>
          </TouchableOpacity>
        </View>
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
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'azo_sans-700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subHeaderTitle: {
    fontSize: 16,
    fontFamily: 'azo_sans-500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
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
  price: {
    fontSize: 36,
    fontFamily: 'azo_sans-700',
  },
  duration: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'azo_sans-400',
    marginLeft: 4,
  },
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mainFeatureItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
    marginBottom: 12,
    paddingTop: 0,
  },
  featureIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'azo_sans-400',
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  mainFeatureText: {
    fontSize: 15,
    fontFamily: 'azo_sans-500',
    color: '#444',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buyButton: {
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'azo_sans-700',
    marginLeft: 8,
  },
});

export default TeliaHalebopSingleProductScreen;
