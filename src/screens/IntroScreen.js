"use client"

import { useContext } from "react"
import { Dimensions, StyleSheet, TouchableOpacity, View, ScrollView, Image, Alert } from "react-native"
import { AppText } from "../components/appText"
import { AppScreen } from "../helper/AppScreen"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { TopHeader } from "../components/header/TopHeader"
import { removeToken } from "../helper/storage"
import { AuthContext } from "../context/auth.context"
import Icon from "react-native-vector-icons/FontAwesome"

const iconSize = 20
const screenWidth = Dimensions.get("screen").width
const itemWidth = (screenWidth - 30) / 2 // Space for two items side by side with some margin

const introContent = [
  { title: "COMVIQ", link: "HOME_START" },
  {
    title: "LycaMobil",
    link: "LYCA_NAVIGATION",
    backgroundColor: "#fff",
    img: require("../../assets/images/Lycamobile.png"),
  },
  {
    title: "Registrera kontankort",
    icon: <MaterialCommunityIcons name="sim" size={iconSize} color="#e2027b" />,
    link: "ALL_SIM_CARDS",
  },
  {
    title: "Orderhistoriken",
    icon: <AntDesign name="reload1" size={iconSize} color="#e2027b" />,
    link: "ORDER_HISTORY_NAV",
  },
  { title: "Nyheter", icon: <Icon name="newspaper-o" size={iconSize} color="#e2027b" />, link: "NEW_NAVIGATIONS" },
  {
    title: "Inställningar",
    icon: <AntDesign name="setting" size={iconSize} color="#e2027b" />,
    link: "APP_SETTINGS",
  },
  { title: "Logga ut", icon: <AntDesign name="logout" size={iconSize} color="#e2027b" />, link: "LOGOUT" },
]

export default function IntroScreen({ navigation }) {
  const { setUser } = useContext(AuthContext)

  const handlePress = (route) => navigation.navigate(route)

  const handleLogout = async () => {
    Alert.alert(
      "Logga ut",
      "Är du säker på att du vill logga ut?",
      [
        {
          text: "Avbryt",
          style: "cancel",
        },
        {
          text: "Logga ut",
          onPress: async () => {
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
      <TopHeader title="NEDC GROUP AB" textStyle={styles.headerText} style={styles.topHeader} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.mainContent}>
          {/* Side-by-side sections for "COMVIQ" and "LycaMobil" */}
          <View style={styles.topRow}>
            {introContent.slice(0, 2).map((intro, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(intro.link)}
                style={[
                  styles.sideBySideItem,
                  {
                    backgroundColor: intro.backgroundColor || "#e2027b",
                    borderWidth: intro.img ? 2 : 0,
                    borderColor: "#666",
                  },
                ]}
              >
                {intro.img ? (
                  <Image source={intro.img} style={styles.introImage} resizeMode="contain" />
                ) : (
                  <AppText text={intro.title} style={[styles.topItemText, { fontSize: 32 }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* List items with icons on the left and text on the right */}
          {introContent.slice(2).map(
            (intro, index) =>
              intro.title !== "Techdev Cyber" && (
                <TouchableOpacity
                  key={index}
                  onPress={() => (intro.link === "LOGOUT" ? handleLogout() : handlePress(intro.link))}
                  style={[styles.listItem, intro.link === "LOGOUT" && styles.logoutButton]}
                >
                  <View style={styles.iconContainer}>{intro.icon}</View>
                  <AppText
                    text={intro.title}
                    style={[styles.listItemText, intro.link === "LOGOUT" && { color: "#fff" }]}
                  />
                </TouchableOpacity>
              ),
          )}
        </View>
      </ScrollView>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  topHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sideBySideItem: {
    width: itemWidth,
    height: 80, // Set a fixed height for both items
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensure the image doesn't overflow
  },
  introImage: {
    width: "100%",
    height: "100%",
  },
  fullWidthItem: {
    width: "100%",
    padding: 15,
    backgroundColor: "#e2027b",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  topItemText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    fontFamily: "ComviqSansWebBold",
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
    color: "#fff",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  iconContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemText: {
    fontSize: 15,
    color: "#000",
    fontFamily: "ComviqSansWebBold",
    marginLeft: 10,
    textTransform: "uppercase",
  },
  logoutButton: {
    backgroundColor: "#e2027b",
    marginTop: 20,
  },
})

