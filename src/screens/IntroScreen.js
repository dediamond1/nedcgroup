import React, { useContext } from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { AppText } from '../components/appText';
import { AppScreen } from '../helper/AppScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { TopHeader } from '../components/header/TopHeader';
import { removeToken } from '../helper/storage';
import { AuthContext } from '../context/auth.context';
import Icon from 'react-native-vector-icons/FontAwesome';

const iconSize = 20;
const screenWidth = Dimensions.get('screen').width;
const itemWidth = (screenWidth - 30) / 2; // Space for two items side by side with some margin

const introContent = [
  { title: 'COMVIQ', link: 'HOME' },
  { title: 'Lycka', link: 'HOME' },
  { title: 'Registrera kontankort', icon: <MaterialCommunityIcons name="sim" size={iconSize} color="#e2027b" />, link: 'ALL_SIM_CARDS' },
  { title: 'Orderhistoriken', icon: <AntDesign name="reload1" size={iconSize} color="#e2027b" />, link: 'ORDER_HISTORY_NAV' },
  { title: 'Techdev Cyber', link: 'TECHDEV', subTitle: 'Få 15% provision' },
  { title: 'Nyheter', icon: <Icon name="newspaper-o" size={iconSize} color="#e2027b" />, link: 'NEW_NAVIGATIONS' },
  { title: 'App Inställningar', icon: <AntDesign name="setting" size={iconSize} color="#e2027b" />, link: 'APP_SETTINGS' },
  { title: 'Logga ut', icon: <AntDesign name="logout" size={iconSize} color="#e2027b" />, link: 'LOGOUT' },
];

export default function IntroScreen({ navigation }) {
  const { setUser } = useContext(AuthContext);

  const handlePress = (route) => navigation.navigate(route);

  const handleLogout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AppScreen style={styles.screen}>
      <TopHeader 
        title='NEDC GROUP AB' 
        textStyle={styles.headerText} 
        style={styles.topHeader} 
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContent}>
          {/* Side-by-side sections for "COMVIQ" and "Lycka" */}
          <View style={styles.topRow}>
            {introContent.slice(0, 2).map((intro, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(intro.link)}
                style={styles.sideBySideItem}
              >
                <AppText text={intro.title} style={styles.topItemText} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Full-width for "Techdev Cyber" */}
          <TouchableOpacity
            onPress={() => handlePress('TECHDEV')}
            style={[styles.fullWidthItem, { backgroundColor: '#011527' }]}
          >
            <AppText text="Techdev Cyber" style={styles.topItemText} />
            <View style={styles.discountContainer}>
              <Feather name='dollar-sign' size={16} color="#fff" />
              <AppText text="Få 15% provision" style={styles.discountText} />
            </View>
          </TouchableOpacity>

          {/* List items with icons on the left and text on the right */}
          {introContent.slice(2, -1).map((intro, index) => intro.title !== "Techdev Cyber" &&(
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(intro.link)}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>
                {intro.icon}
              </View>
              <AppText text={intro.title} style={styles.listItemText} />
            </TouchableOpacity>
          ))}

          {/* Logout button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.listItem, styles.logoutButton]}
          >
            <View style={styles.iconContainer}>
              <AntDesign name="logout" size={iconSize} color="#fff" />
            </View>
            <AppText text="Logga ut" style={[styles.listItemText, {color: '#fff'}]} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  topHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 25,
    color: "#fff",
    fontFamily: "ComviqSansWebBold",
  },
  scrollViewContent: {
    padding: 10,
  },
  mainContent: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sideBySideItem: {
    width: itemWidth,
    padding: 15,
    backgroundColor: '#e2027b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthItem: {
    width: '100%',
    padding: 15,
    backgroundColor: '#e2027b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  topItemText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'ComviqSansWebBold',
    textTransform: "uppercase",
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  discountText: {
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "ComviqSansWebBold",
    color: '#fff',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'ComviqSansWebBold',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  logoutButton: {
    backgroundColor: '#e2027b',
    marginTop: 20,
  },
});
