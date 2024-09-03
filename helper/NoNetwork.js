import React from 'react';
import { View, Linking, Text } from 'react-native';
import { AppText } from '../src/components/appText';
import { TopHeader } from '../src/components/header/TopHeader';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';

export const NoNetwork = () => {
  const openSettings = async () => await Linking.openSettings()
  return (
    <>
      <TopHeader title={'Anslut till internet'} />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <MaterialIcon name="connection" size={90} color="#3dc5f5" />
        <View style={{ padding: 5, }}>

          <AppText
            text={
              'Ingen internet anslutning'
            }
            style={{ color: '#2bb2e0', textAlign: 'left', fontSize: 20, marginBottom: 20, textTransform: 'uppercase', fontFamily: "ComviqSansWebBold" }}
          />
          <AppText
            text={
              'Anslut till internet för att  kunna \n använda appen'
            }
            style={{ color: '#2bb2e0', textAlign: 'left', fontSize: 17, lineHeight: 28, fontFamily: "ComviqSansWebBold" }}
          />
        </View>
        <View style={{ padding: 10, width: "100%" }}>

          {/* <Button onPress={openSettings} color='#2bb2e0' mode="contained" style={{ width: "100%", padding: 8, }} >
            <Text style={{ color: "#fff", fontSize: 18 }}>Anslut till internet</Text>
          </Button> */}
        </View>
      </View>
    </>
  );
};

