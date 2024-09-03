import React, { useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppText } from '../../components/appText';
import { AppButton } from '../../components/button/AppButton';
import { AppIconButton } from '../../components/button/AppIconButton';
import { TopHeader } from '../../components/header/TopHeader';
import { VoucherItems } from '../../components/vouchers/voucherItems/VoucherItems';
import { baseUrl } from '../../constants/api';
import { AuthContext } from '../../context/auth.context';
import { AppScreen } from '../../helper/AppScreen';
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { NormalLoader } from '../../../helper/Loader2';
import { removeToken } from '../../helper/storage';
import { api } from '../../api/api';

export const SeconDetails = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const { data, title } = route.params;
  const [showItem, setShowItem] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { user, setInActive, setUser } = useContext(AuthContext);

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  const getDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/category/artical/${data?.articalId}`,
        {},
        {
          headers: {
            authorization: `Bearer ${user}`,
          },

        },
      );

      console.log(response?.data);
      if (!response.ok) {
        setLoading(false)
        return setShowItem(false)
      }
      if (
        response?.data?.message === 'Company deativted because you have reached Credit Limit'
      ) {
        setInActive(true);
      }
      if (response?.data?.message === 'invalid token in the request.') {
        await removeToken()
        Alert.alert('OBS', "Du har blivit utloggad, vänligen logga in igen", [{
          text: "Logga in igen",
          onPress: () => setUser(null)
        }])
        setLoading(false);
      }

      if (response?.data?.data?.body?.data) {
        navigation.navigate('PINCODEOTP', {
          data: response?.data?.data?.body?.data,
          title: title,
          moreInfo: data,
        })
      } else {
        setShowItem(false);
        setLoading(false);
      }
      setLoading(false)
    } catch (error) {
      console.log(error.message);
      setShowItem(false)
      setLoading(false);
    }
  };



  if (!showItem) {
    return (
      <>
        {loading && <NormalLoader loading={loading} subTitle='hämtar voucher information...' />}
        <TopHeader
          title={!showItem ? 'OBS: något gick fel' : title}
          icon="chevron-left"
          onPress={() => navigation.goBack()}
        />

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
          }}>
          <View>
            <AppText
              style={{
                color: '#2bb2e0',
                fontSize: 18,
                textAlign: 'center',
                marginVertical: 10,
                fontFamily: "ComviqSansWebBold",

              }}
              text={'Något gick fel, vanligen kontaka support'}
            />
            <AppText
              style={{
                color: '#2bb2e0',
                fontSize: 18,
                textAlign: 'center',
                marginVertical: 10,
                fontFamily: "ComviqSansWebBold",
              }}
              text={'+46793394031'}
            />
            <AppButton
              icon={'arrow-left'}
              style={{ padding: 16, backgroundColor: "#2bb2e0" }}
              textStyle={{ fontSize: 18 }}

              text={'Tllbaka till submeyn'}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </>
    );
  }
  return (
    <AppScreen style={{ flex: 1 }}>
      {loading && <NormalLoader loading={loading} subTitle='vänligen vänta laddar voucher information...' />}
      <TopHeader
        title={title}
        loading={loading}
        icon={'chevron-left'}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.singleItemContainer}>
        <VoucherItems item={data} textColor="#f9f9f9" />

        <Animatable.View style={styles.btnsContainer}>
          <AppIconButton size={70} icon={'close'} onPress={() => navigation.goBack()} />
          <AppIconButton
            style={styles.btns}
            bgColor="green"
            icon={'check'}
            size={70}
            onPress={async () => {
              await getDetails();

            }
            }
          />
        </Animatable.View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  singleItemContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'space-around',
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  btns: {
    elevation: 4,
  },
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontSize: 20,
    fontFamily: "ComviqSansWebBold",
    marginVertical: 20,
    color: "#000"
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 20,
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    width: 250, // set the width of the input container to 200
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 19,
    marginLeft: 10,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 0,
    fontFamily: "ComviqSansWebBold",

  },
});
