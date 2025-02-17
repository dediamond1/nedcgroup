"use client"

import { useState } from "react"
import { FlatList, StyleSheet, TouchableOpacity, View, Linking, Alert } from "react-native"
import { AppText } from "../../components/appText"
import { TopHeader } from "../../components/header/TopHeader"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import { AppScreen } from "../../helper/AppScreen"
import { useNavigation } from "@react-navigation/native"
import { Status } from "../../../helper/Status"
import DeviceInfo from "react-native-device-info"
import { IconButton } from "../../components/button/IconButton"
import { settingsData } from "../../utils/settingsData"

export const SetttingsScreen = () => {
  const [noUpdateAvailabe, setNoUpdateAvailable] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showProgress, setShowProgress] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [updateText, setUpdateText] = useState("Söker efter uppdatering...")
  const navigation = useNavigation()
  const AppVersion = DeviceInfo.getVersion()
  const appkey = "os-L0ZkZopJi-DC2favaMuQpdPwpCY0QxDls8"

  const handleOpenBrowser = async () => {
    try {
      const url = "https://t.ly/hpc6-"
      const supported = await Linking.canOpenURL(url)

      if (supported) {
        await Linking.openURL(url)
      } else {
        Alert.alert("Error", "Cannot open the browser")
      }
    } catch (error) {
      console.error(error)
      Alert.alert("Error", "Something went wrong while opening the browser")
    }
  }

  const getUpdate = async () => {
    try {
      setLoadingStatus(true)
      setUpdateText("Checking for updates...")
      // Simulate update check
      setTimeout(() => {
        setLoadingStatus(false)
        handleOpenBrowser()
      }, 1500)
    } catch (error) {
      console.log(error)
      setLoadingStatus(false)
      Alert.alert("Error", "Failed to check for updates")
    }
  }

  return (
    <AppScreen style={styles.screen}>
      <TopHeader title={"INSTÄLLNINGAR"} loading={loadingStatus} icon={true} onPress={() => navigation.goBack()} />

      {loadingStatus && (
        <Status
          status={showProgress}
          progress={progress}
          loading={loadingStatus}
          error={noUpdateAvailabe}
          text={updateText}
          onPressCancel={() => setNoUpdateAvailable(false)}
        />
      )}

      {noUpdateAvailabe && (
        <Status error={noUpdateAvailabe} text={updateText} onPressCancel={() => setNoUpdateAvailable(false)} />
      )}

      <View style={styles.container}>
        <View style={styles.supportContainer}>
          <FlatList
            data={settingsData}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item: { title, color, nav, icon, iconColor } }) => (
              <IconButton
                backgroundColor={color}
                title={title}
                MIcon={icon}
                color={iconColor}
                size={42}
                onPress={() => navigation.navigate(nav)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}

          />
        </View>

        <View style={styles.footer}>
          <AppText text={`NEDC Group AB v${AppVersion}`} style={styles.versionText} />
          <View style={styles.updateSection}>
                <TouchableOpacity style={styles.updateButton} onPress={getUpdate} disabled={loadingStatus}>
                  <MaterialIcon name="update" size={24} color="#fff" />
                  <AppText text="Sök efter uppdateringar" style={styles.updateButtonText} />
                </TouchableOpacity>
              </View>
        </View>
      </View>
    </AppScreen>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  supportContainer: {
    flex: 1,
    width: "100%",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(159, 159, 159, 0.2)",
    marginVertical: 8,
  },
  updateSection: {
    marginTop: 20,
    paddingHorizontal: 4,
  },
  updateButton: {
    backgroundColor: "#e2027b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 8,
    width: "100%"
  },
  updateButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "ComviqSansWebBold",
  },
  footer: {
    paddingVertical: 8,
    alignItems: "center",
  },
  versionText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "ComviqSansWebRegular",
  },
})

