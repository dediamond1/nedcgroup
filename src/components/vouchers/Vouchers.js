import React, { useContext, useEffect, useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { AppScreen } from '../../helper/AppScreen';
import Categories from '../../utils/category-subcategory.json';
import { FloatingActionButton } from '../button/FloatingActionButton';
import { TopHeader } from '../header/TopHeader';
import { VoucherItems } from './voucherItems/VoucherItems';
import { AppButton } from '../button/AppButton';
import { api } from '../../api/api';
import { AuthContext } from '../../context/auth.context';
import { ActivityIndicator } from 'react-native';

export const Vouchers = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false); // Added state for loading indicator
  const { user, setInActive, setUser } = useContext(AuthContext);
 

  
  return (
    <AppScreen style={styles.screen}>
      <TopHeader textStyle={styles.headerTitle} iconName="arrow-left" icon title={'COMVIQ'} onPress={() => navigation.navigate('INTRO')} />

      <FlatList
        contentContainerStyle={styles.contextContainer}
        showsVerticalScrollIndicator={false}
        data={Categories.category}
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
        ListHeaderComponent={() => <View style={styles.buttonContainer}>
          <AppButton textStyle={styles.buttonText} text={"Registrera kontantkort"} onPress={() => navigation.navigate('ALL_SIM_CARDS')} style={styles.button} />
        </View>}
        ListFooterComponent={() => <View style={{ height: 70 }} />}
      />
      <FloatingActionButton
        icon={'arrow-left'}
        bgColor="#3b3687"
        size={70}
        onPress={() => navigation.navigate('INTRO')}
      />
      {isLoading && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b3687" />
      </View>}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f4f4"
  },
  contextContainer: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'ComviqSansWebBold',
  },
  buttonContainer: {

  },
  button: {
    textTransform: "uppercase",
    padding: 16,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "ComviqSansWebRegular"
  }
});
