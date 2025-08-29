"use client"

import React, { useContext, useEffect, useRef, useState } from "react"
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Alert,
  Animated,
  Platform,
  StatusBar,
} from "react-native"
import { AppText } from "../components/appText"
import { AppScreen } from "../helper/AppScreen"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import { TopHeader } from "../components/header/TopHeader"
import { removeToken } from "../helper/storage"
import { AuthContext } from "../context/auth.context"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import { useNavigation } from "@react-navigation/native"

// Haptic feedback configuration
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
}

const triggerHaptic = (type = "impactMedium") => {
  ReactNativeHapticFeedback.trigger(type, hapticOptions)
}

const screenWidth = Dimensions.get("screen").width
const CARD_SPACING = 16
const cardWidth = (screenWidth - (CARD_SPACING * 3)) / 2

// Data structure for better organization and flexibility
const appContent = {
  companies: [
    {
      id: 'comviq',
      title: "COMVIQ",
      link: "HOME_START",
      backgroundColor: "#e2027b",
      textColor: "#ffffff",
      isFeatured: true,
    },
    {
      id: 'lyca',
      title: "LycaMobil",
      link: "LYCA_NAVIGATION",
      img: require("../../assets/images/Lycamobile.png"),
      isFeatured: true,
    },
    {
      id: 'telia',
      title: "Telia",
      link: "TELIA_NAVIGATION",
      img: require("../../assets/images/telia.png"),
      isFeatured: true,
    },
    {
      id: 'halebop',
      title: "Halebop",
      link: "TELIA_NAVIGATION",
      backgroundColor: "#9fdcdd",
      customFont: "azo_sans-700",
      img: require("../../assets/images/Haleboplogo.png"),
      isFeatured: true,
    },
  ],
  utilities: [
    {
      id: 'register-sim',
      title: "Registrera SIM-kort",
      icon: <MaterialCommunityIcons name="sim" size={22} color="#4a90e2" />,
      link: "ALL_SIM_CARDS",
    },
    {
      id: 'order-history',
      title: "Orderhistorik",
      icon: <AntDesign name="reload1" size={22} color="#4a90e2" />,
      link: "ORDER_HISTORY_NAV",
    },
    {
      id: 'news',
      title: "Nyheter",
      icon: <FontAwesome name="newspaper-o" size={22} color="#4a90e2" />,
      link: "NEW_NAVIGATIONS",
    },
    {
      id: 'settings',
      title: "Inställningar",
      icon: <AntDesign name="setting" size={22} color="#4a90e2" />,
      link: "APP_SETTINGS",
    },
    {
      id: 'logout',
      title: "Logga ut",
      icon: <AntDesign name="logout" size={22} color="#ff3b30" />,
      link: "LOGOUT",
      isDestructive: true,
    },
  ]
}

// Memoized components for better performance
const CompanyCard = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item.link, item)}
      style={[
        styles.cardTouchable, 
        item.backgroundColor ? { backgroundColor: item.backgroundColor } : {},
      ]}
    >
      {item.img ? (
        <Image source={item.img} style={styles.companyImage} resizeMode="contain" />
      ) : (
        <AppText
          text={item.title}
          style={[
            styles.companyText,
            item.customFont ? { fontFamily: item.customFont } : {},
            item.textColor ? { color: item.textColor } : {},
          ]}
        />
      )}
    </TouchableOpacity>
  )
})

const MenuItem = React.memo(({ item, onPress, onLogout }) => {
  const handlePress = () => {
    if (item.link === "LOGOUT") {
      onLogout()
    } else {
      onPress(item.link)
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.menuItemTouchable,
        item.isDestructive && styles.destructiveButton
      ]}
    >
      <View style={styles.iconContainer}>
        {item.icon}
      </View>
      <AppText 
        text={item.title} 
        style={[
          styles.menuItemText,
          item.isDestructive && styles.destructiveText
        ]} 
      />
      {item.link !== "LOGOUT" && (
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      )}
    </TouchableOpacity>
  )
})

export default function IntroScreen() {

  const navigation = useNavigation()
  const { setUser, setTeliaHalebop } = useContext(AuthContext)
  const [featuredCompanies, setFeaturedCompanies] = useState([])
  const [otherCompanies, setOtherCompanies] = useState([])
  
  // Fix: Use useRef for the Animated.Value to prevent recreation on each render
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    // Separate featured and other companies
    const featured = appContent.companies.filter(company => company.isFeatured)
    const others = appContent.companies.filter(company => !company.isFeatured)
    
    setFeaturedCompanies(featured)
    setOtherCompanies(others)
    
    // Animate on mount with sequence for better visual effect
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start()
  }, [fadeAnim, translateY]) // Include the animated values in dependencies

  const handlePress = (route, item) => {

    console.log(item)
  triggerHaptic("impactMedium")
  if (item?.title === "Telia" || item?.title === "Halebop") {
    setTeliaHalebop(item?.title)
  }

  navigation.navigate(`${route}`, { title: "Telia"})
}


  const handleLogout = async () => {
    triggerHaptic("notificationWarning")

    Alert.alert(
      "Logga ut",
      "Är du säker på att du vill logga ut?",
      [
        {
          text: "Avbryt",
          style: "cancel",
          onPress: () => triggerHaptic("impactLight"),
        },
        {
          text: "Logga ut",
          onPress: async () => {
            triggerHaptic("impactHeavy")
            await removeToken()
            setUser(null)
          },
        },
      ],
      { cancelable: false },
    )
  }

  return (
    <AppScreen style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <TopHeader 
        title="NEDC GROUP AB" 
        textStyle={styles.headerText} 
        style={styles.topHeader} 
      />

      <Animated.ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim, transform: [{ translateY }] }}
      >
        {/* Featured Operators Section */}
        <View style={styles.section}>
          <AppText text="UTVALDA OPERATÖRER" style={styles.sectionTitle} />
          <View style={styles.companiesGrid}>
            {featuredCompanies.map(item => (
              <CompanyCard 
                key={item.id} 
                item={item} 
                onPress={()=> handlePress(item.link, item)} 
              />
            ))}
          </View>
        </View>

        {/* Other Operators Section (if any) */}
        {otherCompanies.length > 0 && (
          <View style={styles.section}>
            <AppText text="ANDRA OPERATÖRER" style={styles.sectionTitle} />
            <View style={styles.companiesGrid}>
              {otherCompanies.map(item => (
                <CompanyCard 
                  key={item.id} 
                  item={item} 
                  onPress={()=> handlePress(item.link, item)} 
                />
              ))}
            </View>
          </View>
        )}

        {/* Utilities Section */}
        <View style={styles.section}>
          <AppText text="VERKTYG" style={styles.sectionTitle} />
          <View style={styles.menuList}>
            {appContent.utilities.map(item => (
              <MenuItem 
                key={item.id} 
                item={item} 
                onPress={handlePress}
                onLogout={handleLogout}
              />
            ))}
          </View>
        </View>
      </Animated.ScrollView>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  topHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  headerText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#6c757d",
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 16,
    marginLeft: 4,
  },
  companiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardTouchable: {
    width: cardWidth,
    height: cardWidth * 0.7, // Maintain aspect ratio
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: CARD_SPACING,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  companyImage: {
    width: "80%",
    height: "80%",
  },
  companyText: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
  },
  menuList: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  destructiveButton: {
    backgroundColor: "#fff8f8",
  },
  destructiveText: {
    color: "#ff3b30",
    fontWeight: "600",
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
})