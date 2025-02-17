"use client"

import React, { useState, useLayoutEffect, useContext, useCallback, useEffect } from "react"
import { View, Alert, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { AppText } from "../../components/appText"
import { AppButton } from "../../components/button/AppButton"
import { TopHeader } from "../../components/header/TopHeader"
import { OrderItems } from "../../components/orderItems/OrderItems"
import { baseUrl } from "../../constants/api"
import { AuthContext } from "../../context/auth.context"
import { AppScreen } from "../../helper/AppScreen"
import { getToken, removeToken, getBluetooth, saveBluetooth } from "../../helper/storage"
import { NormalLoader } from "../../../helper/Loader2"
import { useGetCompanyInfo } from "../../hooks/useGetCompanyInfo"
import Icon from "react-native-vector-icons/Ionicons"
import { PrintModal } from "../../components/modals/PrintModal"
import { format } from "date-fns"
import { BluetoothEscposPrinter, BluetoothManager } from "@brooons/react-native-bluetooth-escpos-printer"
import DeviceInfo from "react-native-device-info"

// Custom debounce function
const useDebounce = (func, delay) => {
  const timeoutRef = React.useRef(null)

  return (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export const OrderHistory = ({ route }) => {
  const { operator } = route?.params
  const [orderHistory, setOrderHistory] = useState([])
  const [filteredOrderHistory, setFilteredOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false)
  const [bleOpend, setBleOpen] = useState(false)
  const [boundAddress, setBoundAddress] = useState("")
  const [name, setName] = useState("")
  const [pairedDs, setPairedDs] = useState([])
  const [foundDs, setFoundDs] = useState([])
  const navigation = useNavigation()
  const { setInActive } = useContext(AuthContext)
  const { companyInfo, getCompanyInfo } = useGetCompanyInfo()

  const getAllOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const jsontoken = await getToken()
      const token = JSON.parse(jsontoken)
      await getCompanyInfo()

      let url = `${baseUrl}/api/order`
      if (operator === "LYCA") {
        url = `${baseUrl}/api/lyca-order`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (data?.message === "invalid token in the request.") {
        Alert.alert("OBS...", "DU HAR BLIVIT UTLOGGAD")
        await removeToken()
      }
      if (data?.message === "Company deativted because you have reached Credit Limit") {
        setInActive(true)
      } else {
        setOrderHistory(data?.orderlist || [])
        setFilteredOrderHistory(data?.orderlist || [])
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error("Error fetching orders:", error)
    }
  }, [operator, getCompanyInfo, setInActive])

  const handleSearch = (text) => {
    setSearchQuery(text)
    const filtered = orderHistory.filter(
      (item) =>
        item.voucherNumber.toLowerCase().includes(text.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(text.toLowerCase()),
    )
    setFilteredOrderHistory(filtered)
  }

  const debouncedSearch = useDebounce(handleSearch, 300)

  const resetSearch = () => {
    setSearchQuery("")
    setFilteredOrderHistory(orderHistory)
  }

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllOrders()
    })
    return () => {
      unsubscribe()
    }
  }, [navigation, getAllOrders])

  const openPrintModal = () => {
    if (filteredOrderHistory.length > 0) {
      setIsPrintModalVisible(true)
    } else {
      Alert.alert("No data", "There is no order history to print.")
    }
  }

  const closePrintModal = () => {
    setIsPrintModalVisible(false)
  }

  const handlePrint = async (option, date) => {
    try {
      const isRealDevice = await DeviceInfo.isEmulator().then((emulator) => !emulator)

      if (!isRealDevice) {
        Alert.alert("Error", "Printing is not available on emulators. Please use a real device.")
        return
      }

      if (!boundAddress) {
        Alert.alert("Error", "No printer connected. Please wait while we connect to the printer.")
        return
      }

      const selectedDate = format(date, "yyyy-MM-dd")
      const filteredOrders = orderHistory.filter(
        (order) => format(new Date(order.OrderDate), "yyyy-MM-dd") === selectedDate,
      )

      if (filteredOrders.length === 0) {
        Alert.alert("No data", "There are no orders for the selected date.")
        return
      }

      await BluetoothManager.connect(boundAddress)

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      );

      // Print header with operator information
      await BluetoothEscposPrinter.printText(` ${operator === "LYCA" ? "LYCA" : "COMVIQ"}\n`, {
        fonttype: 1,
        widthtimes: 2,
        heigthtimes: 2,
      })
      await BluetoothEscposPrinter.printText('\r\n', {});

      await BluetoothEscposPrinter.printText(`Report for ${selectedDate}\n\n`, {})

      await BluetoothEscposPrinter.printText('\r\n', {});

      let totalAmount = 0

      if (option === "total") {
        totalAmount = filteredOrders.reduce((sum, order) => sum + Number(order.totalvoucherAmount), 0)
        
        await BluetoothEscposPrinter.printText(`Total:\n\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        })
        await BluetoothEscposPrinter.printText('\r\n', {});

        await BluetoothEscposPrinter.printText(`${totalAmount} Kr\n\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        })
        await BluetoothEscposPrinter.printText('\r\n', {});
        await BluetoothEscposPrinter.printText('\r\n', {});

      } else {
        await BluetoothEscposPrinter.printText(`Full report:\n\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        })

        for (const order of filteredOrders) {
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printText(`Article ID: ${order.articleId}\n`, {})
          await BluetoothEscposPrinter.printText(`Description: ${order.voucherDescription}\n`, {})
          await BluetoothEscposPrinter.printText(`Amount: ${order.totalvoucherAmount} SEK\n`, {})
          await BluetoothEscposPrinter.printText(
            `Date: ${format(new Date(order.OrderDate), "yyyy-MM-dd HH:mm")}\n\n`,
            {},
          )
          await BluetoothEscposPrinter.printText('\r\n', {});
          totalAmount += Number(order.totalvoucherAmount)
        }

        await BluetoothEscposPrinter.printText('\r\n', {});
        await BluetoothEscposPrinter.printText(`Total:\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        })
        await BluetoothEscposPrinter.printText('\r\n', {});

        await BluetoothEscposPrinter.printText(`${totalAmount} Kr\n\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        })
      }
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n', {});


      await BluetoothEscposPrinter.printText(`Want a report for ${operator === "LYCA" ? "COMVIQ" : "LYCA"}? please    go to ${operator === "LYCA" ? "COMVIQ" : "LYCA"} to generate it.\n`, {
        align: BluetoothEscposPrinter.ALIGN.CENTER
      });
      
      await BluetoothEscposPrinter.printText('\r\n\n', {});
      await BluetoothEscposPrinter.printText('\r\n\n', {});
      await BluetoothEscposPrinter.printText('\r\n\n', {});


    } catch (error) {
      console.error("Print error:", error)
      Alert.alert("Error", "Failed to print the report. Please check the printer connection.")
    } finally {
      closePrintModal()
    }
  }

  const aboutPrinter = async () => {
    try {
      let enabled = await BluetoothManager.checkBluetoothEnabled()
      if (!enabled) {
        await BluetoothManager.enableBluetooth()
        enabled = true
      }
      setBleOpen(enabled)
      setLoading(false)
    } catch (error) {
      console.error("Error checking/enabling Bluetooth:", error)
    }
  }

  const scanForDevices = async () => {
    try {
      const devices = await BluetoothManager.scanDevices()
      let paired = []
      let found = []

      if (typeof devices.paired === "object") {
        paired = devices.paired
      } else {
        try {
          paired = JSON.parse(devices.paired)
        } catch (e) {
          console.error("Error parsing paired devices:", e)
        }
      }

      if (typeof devices.found === "object") {
        found = devices.found
      } else {
        try {
          found = JSON.parse(devices.found)
        } catch (e) {
          console.error("Error parsing found devices:", e)
        }
      }

      setPairedDs(paired)
      setFoundDs(found)
    } catch (error) {
      console.error("Error scanning for devices:", error)
    }
  }

  useEffect(() => {
    const initializeBluetooth = async () => {
      const isAmu = DeviceInfo.isEmulatorSync()
      if (isAmu) {
        Alert.alert("ERROR", "This is NOT a real device!")
      } else {
        await aboutPrinter()
        const blStorage = await getBluetooth()
        const alreadyPaired = JSON.parse(blStorage)
        if (alreadyPaired?.length > 0) {
          BluetoothManager.connect(alreadyPaired[0]?.address)
            .then(() => {
              setLoading(false)
              setBoundAddress(alreadyPaired[0].address)
              setName(alreadyPaired[0].name || "UNKNOWN")
            })
            .catch((e) => {
              setLoading(false)
              console.error(e)
            })
        } else {
          await scanForDevices()
          if (pairedDs.length > 0 && pairedDs[0].name === "IposPrinter") {
            BluetoothManager.connect(pairedDs[0]?.address)
              .then(() => {
                saveBluetooth(JSON.stringify([pairedDs[0]]))
                  .then(() => {
                    setLoading(false)
                    setBoundAddress(pairedDs[0].address)
                    setName(pairedDs[0].name || "UNKNOWN")
                  })
                  .catch((err) => console.log("error saving bluetooth", err))
              })
              .catch((e) => {
                setLoading(false)
                console.error(e)
              })
          }
        }
      }
    }

    initializeBluetooth()

    return () => {
      setLoading(false)
      const isAmu = DeviceInfo.isEmulatorSync()
      if (isAmu) {
        Alert.alert("ERROR", "This is NOT a real device!")
      } else {
        aboutPrinter()
      }
    }
  }, [scanForDevices]) // Fixed useEffect dependencies

  if (isLoading) {
    return <NormalLoader loading={isLoading} subTitle="Loading order history..." />
  }
else{
  return (
    <AppScreen style={styles.screen}>
      <TopHeader title={"Order History"} icon onPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.actionContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              onChangeText={debouncedSearch}
              value={searchQuery}
              placeholder="Search voucher number/serial number"
              keyboardType="default"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={resetSearch} style={styles.resetButton}>
                <Icon name="close-circle" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={openPrintModal}
            style={[styles.printButton, filteredOrderHistory.length === 0 && styles.disabledPrintButton]}
            disabled={filteredOrderHistory.length === 0}
          >
            <Icon name="print-outline" size={24} color="#fff" />
            <AppText text="Print report" style={styles.printButtonText} />
          </TouchableOpacity>
        </View>
        {/* Bluetooth Status */}
        {!bleOpend && (
          <View style={styles.bluetoothStatus}>
            <Icon
              name={bleOpend && boundAddress ? "bluetooth" : "bluetooth-outline"}
              size={24}
              color={bleOpend && boundAddress ? "#4CAF50" : "#FF9800"}
            />
            <AppText
              text={bleOpend && boundAddress ? `Connected to: ${name || "UNKNOWN"}` : "Connecting to bluetooth..."}
              style={styles.bluetoothStatusText}
            />
          </View>
        )}

        {filteredOrderHistory.length ? (
          <View style={styles.orderList}>
            {filteredOrderHistory.map((item) => (
              <OrderItems
                key={item.id}
                item={item}
                onPress={() => navigation.navigate("ORDER_DETAILS", { data: item, companyInfo: companyInfo, operator })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noHistoryContainer}>
            <AppText text={"Ingen orderhistorik hittades."} style={styles.noHistoryText} />

            <AppButton
              text={"Fetch order history"}
              icon="reload"
              iconColor="#ffffff"
              textStyle={styles.buttonText}
              style={styles.button}
              onPress={getAllOrders}
            />
          </View>
        )}
      </ScrollView>
      <PrintModal visible={isPrintModalVisible} onClose={closePrintModal} onPrint={handlePrint} />
    </AppScreen>
  )
}
  
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  actionContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#3b3687",
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    fontSize: 14,
    fontFamily: "ComviqSansWebBold",
  },
  resetButton: {
    backgroundColor: "#3b3687",
    padding: 8,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  printButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b3687",
    padding: 10,
    borderRadius: 8,
  },
  printButtonText: {
    marginLeft: 5,
    color: "#fff",
    fontFamily: "ComviqSansWebBold",
    fontSize: 14,
  },
  disabledPrintButton: {
    opacity: 0.5,
  },
  bluetoothStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  bluetoothStatusText: {
    marginLeft: 10,
    color: "#000",
    fontSize: 14,
    fontFamily: "ComviqSansWebBold",
  },
  orderList: {
    padding: 10,
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%"
  },
  noHistoryText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#000"
  },
  buttonText: {
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#3b3687",
    width: "100%",
  },
})

