import React from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import { FlatList, StyleSheet } from 'react-native';
import { AppScreen } from '../../helper/AppScreen';
import Categories from '../../utils/category-subcategory.json';
import { FloatingActionButton } from '../button/FloatingActionButton';
import { TopHeader } from '../header/TopHeader';
import { VoucherItems } from './voucherItems/VoucherItems';
import { AppButton } from '../button/AppButton';

export const Vouchers = () => {
  const navigation = useNavigation();

  return (
    <AppScreen style={styles.screen}>
      <TopHeader textStyle={styles.headerTitle} iconName="menu" icon title={'COMVIQ'} style={{ backgroundColor: "#2bb2e0" }} onPress={() => navigation.navigate('INTRO')} />

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
        icon={'menu'}
        bgColor="#2bb2e0"
        size={70}
        onPress={() => navigation.navigate('INTRO')}
      />
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
