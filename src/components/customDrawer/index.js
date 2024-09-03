import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { removeToken } from '../../helper/storage';
import { AuthContext } from '../../context/auth.context';
import { AppText } from '../appText';
import MaterialIcon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native';
export const CustomDrawer = props => {
  const [token, setToken] = useState(false);
  const { setUser } = useContext(AuthContext);

  const logout = async () => {
    await removeToken();
    setUser(null);
  };


  return (
    <React.Fragment>
      <DrawerContentScrollView {...props} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.container}>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
          <AppText style={styles.logoutBtnText} text="Logga ut" />
          <MaterialCommunityIcons size={24} color="#000" name="logout" />
        </TouchableOpacity>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoutBtn: {
    backgroundColor: 'rgba(0, 0, 0, .2)',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  logoutBtnText: { fontSize: 18, color: '#000', fontFamily: 'ComviqSansWeb-Regular.eot' },
});
