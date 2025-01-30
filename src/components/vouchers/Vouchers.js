import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { AppScreen } from '../../helper/AppScreen';
import { FloatingActionButton } from '../button/FloatingActionButton';
import { TopHeader } from '../header/TopHeader';
import { VoucherItems } from './voucherItems/VoucherItems';
import { AppButton } from '../button/AppButton';
import { baseUrl } from '../../constants/api';
import { AuthContext } from '../../context/auth.context';

export const Vouchers = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // State to track errors
  const { user } = useContext(AuthContext);

  const getCategories = async () => {
    try {
      setIsLoading(true);
      setError(""); // Reset error before fetching

      const response = await fetch(`${baseUrl}/api/comviq-data`);

      if (!response.ok) {
        throw new Error("Ett fel uppstod. Vänligen kontakta support: +46 793 394 031");
      }

      const data = await response.json();

      if (!data?.comviqData) {
        throw new Error("Ett fel uppstod. Vänligen kontakta support: +46 793 394 031");
      }

      setCategories(data.comviqData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    getCategories();
  }, [navigation]);

  return (
    <AppScreen style={styles.screen}>
      <TopHeader 
        textStyle={styles.headerTitle} 
        iconName="arrow-left" 
        icon 
        title={'COMVIQ'} 
        onPress={() => navigation.navigate('INTRO')} 
      />

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.contextContainer}
          showsVerticalScrollIndicator={false}
          data={categories?.category}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <VoucherItems
              info={true}
              item={item}
              onPress={() =>
                navigation.navigate('DETAILS', {
                  data: item.subcategory,
                  title: item.name,
                })
              }
            />
          )}
          ListHeaderComponent={() => (
            <View style={styles.buttonContainer}>
              <AppButton 
                textStyle={styles.buttonText} 
                text={"Registrera kontantkort"} 
                onPress={() => navigation.navigate('ALL_SIM_CARDS')} 
                style={styles.button} 
              />
            </View>
          )}
          ListFooterComponent={() => <View style={{ height: 70 }} />}
        />
      )}

      <FloatingActionButton
        icon={'arrow-left'}
        bgColor="#3b3687"
        size={70}
        onPress={() => navigation.navigate('INTRO')}
      />

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b3687" />
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  contextContainer: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'ComviqSansWebBold',
  },
  buttonContainer: {},
  button: {
    textTransform: "uppercase",
    padding: 16,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "ComviqSansWebRegular",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
