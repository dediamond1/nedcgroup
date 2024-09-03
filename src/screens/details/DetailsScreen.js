import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet } from 'react-native';
import { TopHeader } from '../../components/header/TopHeader';
import { VoucherItems } from '../../components/vouchers/voucherItems/VoucherItems';
import { AppScreen } from '../../helper/AppScreen';
import { useNavigation } from '@react-navigation/native';
import { Status } from '../../../helper/Status';
import { View } from 'react-native';
import { IconButton } from '../../components/button/IconButton';
import { AppText } from '../../components/appText';

export const DetailsScreen = ({ route }) => {
  const [info, setInfo] = useState({})
  const { data, title } = route.params;
  const navigation = useNavigation();


  return (
    <AppScreen style={styles.screen}>
      <TopHeader
        title={title}
        icon={'chevron-left'}
        onPress={() => navigation.goBack()}
      />
      {/* <View style={{ position: "absolute", width: "100%", flex: 1, height: "100%" }}>
        <Status text={"Hej, vi ber om ursäkt för besväret, Comviq har problem med sitt system idag. systemet kommer att fungera så snart som möjligt. Vänligen starta om appen om en stund. Tack för ditt tålamod."} />
      </View> */}
      <FlatList
        contentContainerStyle={styles.contextContainer}
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={item => item.subid.toString()}
        renderItem={({ item }) => (
          <VoucherItems
            item={item}
            style={styles.items}
            textColor="#e2027b"
            onPressInfo={() => setInfo(item)}
            onPress={() => {
              if (data?.length > 0) {
                navigation.navigate('SECOND_DETAILS', {
                  data: item,
                  title: item.name,
                });
              }
            }}
          />
        )}
      />
      <Modal animationType='slide' visible={info?.name ? true : false} style={{ backgroundColor: "red", flex: 1 }}>
        <View style={styles.closeBtnContainer}>
          <AppText text={'Voucher information '} style={styles.closeBtnText} />

          <IconButton size={40} MIcon={"close"} backgroundColor="#2bb2e0" title="" onPress={() => setInfo({})} />
        </View>
        <View style={{ height: 80 }} />

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <AppText text={'Namn: '} style={styles.infoDataTitle} />
            <AppText text={info?.name} style={styles.infoData} />
          </View>
          <View style={styles.infoItem}>
            <AppText text={'Data: '} style={styles.infoDataTitle} />
            <AppText text={info?.data} style={styles.infoData} />
          </View>
          <View style={styles.infoItem}>
            <AppText text={'Beskrivning: '} style={styles.infoDataTitle} />
            <AppText text={info?.InfoPos} style={styles.infoData} />
          </View>
          <View style={styles.infoItem}>
            <AppText text={'Gäller i: '} style={styles.infoDataTitle} />
            <AppText text={info?.validity} style={styles.infoData} />
          </View>
          <View style={styles.infoItem}>
            <AppText text={'Moms: '} style={styles.infoDataTitle} />
            <AppText text={info?.vatCardValue} style={styles.infoData} />
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#eee',

  },
  contextContainer: {
    padding: 16,
  },
  items: {
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    width: "100%",
    position: "absolute",
    top: 0
  },
  closeBtnText: {
    fontFamily: "ComviqSansWebBold",
    fontSize: 26,
    color: "#2bb2e0"
  },
  infoContainer: {
    padding: 16
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap"
  },
  infoData: {
    color: "#000",
    fontSize: 18,
    fontFamily: "ComviqSansWebRegular",
    marginVertical: 8,
    lineHeight: 30
  },
  infoDataTitle: {
    color: "#000",
    fontWeight: "800",
    fontSize: 18,
    fontFamily: "ComviqSansWebRegular",

  }
});
