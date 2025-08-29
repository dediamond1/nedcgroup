"use client"

import React, { useState, useLayoutEffect, useContext, useCallback } from "react"
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native"
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
import AlertManager from "../../utils/AlertManager"
import { TextInput } from "react-native-gesture-handler"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false)
  const [bleOpend, setBleOpen] = useState(false)
  const [boundAddress, setBoundAddress] = useState("")
  const [name, setName] = useState("")
  const navigation = useNavigation()
  const { setInActive } = useContext(AuthContext)
  const { companyInfo, getCompanyInfo } = useGetCompanyInfo()

  const getAllOrders = useCallback(async () => {
    try {
      setLoading(true)
      const jsontoken = await getToken()
      const token = JSON.parse(jsontoken)
      await getCompanyInfo()

      let url = `${baseUrl}/api/order`
      if (operator === "LYCA") {
        url = `${baseUrl}/api/lyca-order`
      } else if (operator === "TELIA" || operator === "HALEBOP") {
        url = `${baseUrl}/api/teliaOrder`
      }

      const response = await fetch(url, {
        method: operator === "TELIA" || operator === "HALEBOP" ? "POST" : "GET",
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: operator === "TELIA" || operator === "HALEBOP" ? JSON.stringify({
          operator: operator === "TELIA" ? "Telia" : "Halebop"
        }) : undefined
      })

      const data = await response.json()
      if (data?.message === "invalid token in the request.") {
        AlertManager.show("OBS...", "DU HAR BLIVIT UTLOGGAD")
        await removeToken()
      } else if (data?.message === "Company deativted because you have reached Credit Limit") {
        setInActive(true)
      } else {
        setOrderHistory(data?.orderlist || [])
        setFilteredOrderHistory(data?.orderlist || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      AlertManager.show("Error", "Failed to fetch orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [operator, getCompanyInfo, setInActive])

  const handleSearch = useCallback((text) => {
    setSearchQuery(text)
    const filtered = orderHistory.filter(
      (item) =>
        item.voucherNumber.toLowerCase().includes(text.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(text.toLowerCase()),
    )
    setFilteredOrderHistory(filtered)
  }, [orderHistory])

  const debouncedSearch = useDebounce(handleSearch, 300)

  const resetSearch = useCallback(() => {
    setSearchQuery("")
    setFilteredOrderHistory(orderHistory)
  }, [orderHistory])

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllOrders()
    })
    return unsubscribe
  }, [navigation, getAllOrders])

  const initializeBluetooth = useCallback(async () => {
    try {
      const isAmu = await DeviceInfo.isEmulator()
      if (isAmu) {
        return Alert.alert('obs', "not real device")
      }

      let enabled = await BluetoothManager.checkBluetoothEnabled()
      if (!enabled) {
        enabled = await BluetoothManager.enableBluetooth()
      }
      setBleOpen(enabled)

      if (enabled) {
        const blStorage = await getBluetooth()
        const alreadyPaired = JSON.parse(blStorage)
        if (alreadyPaired?.length > 0) {
          await BluetoothManager.connect(alreadyPaired[0]?.address)
          setBoundAddress(alreadyPaired[0].address)
          setName(alreadyPaired[0].name || "UNKNOWN")
        } else {
          const devices = await BluetoothManager.scanDevices()
          const paired = typeof devices.paired === "object" ? devices.paired : JSON.parse(devices.paired)
          if (paired.length > 0 && paired[0].name === "IposPrinter") {
            await BluetoothManager.connect(paired[0]?.address)
            await saveBluetooth(JSON.stringify([paired[0]]))
            setBoundAddress(paired[0].address)
            setName(paired[0].name || "UNKNOWN")
          }
        }
      }
    } catch (error) {
      console.error("Error initializing Bluetooth:", error)
      AlertManager.show("Error", "Failed to initialize Bluetooth. Please try again.")
    }
  }, [])

  const openPrintModal = useCallback(() => {
    if (filteredOrderHistory.length > 0) {
      initializeBluetooth().then(() => {
        setIsPrintModalVisible(true)
      })
    } else {
      AlertManager.show("No data", "There is no order history to print.")
    }
  }, [filteredOrderHistory, initializeBluetooth])

  const closePrintModal = useCallback(() => {
    setIsPrintModalVisible(false)
  }, [])

  

  const handlePrint = useCallback(async (option, date) => {
    try {
      const isRealDevice = await DeviceInfo.isEmulator().then((emulator) => !emulator)

      if (!isRealDevice) {
        AlertManager.show("Error", "Printing is not available on emulators. Please use a real device.")
        return
      }

      if (!boundAddress) {
        AlertManager.show("Error", "No printer connected. Please wait while we connect to the printer.")
        return
      }

      const selectedDate = format(date, "yyyy-MM-dd")
      const filteredOrders = orderHistory.filter(
        (order) => format(new Date(order.OrderDate), "yyyy-MM-dd") === selectedDate,
      )

      if (filteredOrders.length === 0) {
        AlertManager.show("No data", "There are no orders for the selected date.")
        return
      }

      await BluetoothManager.connect(boundAddress)

      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);

      // Print operator information
      await BluetoothEscposPrinter.printText(`${operator === 'LYCA' ? 'LYCA' : 'COMVIQ'}\n`, {
        fonttype: 1,
        widthtimes: 2,
        heigthtimes: 2,
      });
      await BluetoothEscposPrinter.printText('\r\n', {});
      
      // Print report date
      await BluetoothEscposPrinter.printText(`Report for ${selectedDate}\n\n`, {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      
      let totalAmount = 0;
      
      if (option === 'total') {
        // Calculate total amount
        totalAmount = filteredOrders.reduce((sum, order) => sum + Number(order.totalvoucherAmount), 0);
      
        // Print total amount
        await BluetoothEscposPrinter.printText('Total:\n\n', {
          widthtimes: 1,
          heigthtimes: 1,
        });
        await BluetoothEscposPrinter.printText('\r\n', {});
        await BluetoothEscposPrinter.printText(`${totalAmount} Kr\n\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        });
        await BluetoothEscposPrinter.printText('\r\n', {});
        await BluetoothEscposPrinter.printText('\r\n', {});
      } else {
        // Print full report
        await BluetoothEscposPrinter.printText('Full report:\n\n', {
          widthtimes: 1,
          heigthtimes: 1,
        });
      
        for (const order of filteredOrders) {
          await BluetoothEscposPrinter.printText('\r\n', {});
          await BluetoothEscposPrinter.printText(`Article ID: ${order.articleId}\n`, {});
          await BluetoothEscposPrinter.printText(`Description: ${order.voucherDescription}\n`, {});
          await BluetoothEscposPrinter.printText(`Amount: ${order.totalvoucherAmount} SEK\n`, {});
          await BluetoothEscposPrinter.printText(
            `Date: ${format(new Date(order.OrderDate), 'yyyy-MM-dd HH:mm')}\n\n`,
            {}
          );
          await BluetoothEscposPrinter.printText('\r\n', {});
          totalAmount += Number(order.totalvoucherAmount);
        }
      
        await BluetoothEscposPrinter.printText('\r\n', {});
        await BluetoothEscposPrinter.printText('Total:\n', {
          widthtimes: 1,
          heigthtimes: 1,
        });
        await BluetoothEscposPrinter.printText('\r\n', {});
        await BluetoothEscposPrinter.printText(`${totalAmount} Kr\n\n`, {
          widthtimes: 1,
          heigthtimes: 1,
        });
      }
      
      await BluetoothEscposPrinter.printText('\r\n', {});
      await BluetoothEscposPrinter.printText('\r\n', {});
      
      // Print footer message
      await BluetoothEscposPrinter.printText(
        `Want a report for ${operator === 'LYCA' ? 'COMVIQ' : 'LYCA'}? Please    go to ${
          operator === 'LYCA' ? 'COMVIQ' : 'LYCA'
        } to generate it.\n`,
        {
          align: BluetoothEscposPrinter.ALIGN.CENTER,
        }
      );
      
      await BluetoothEscposPrinter.printText('\r\n\n', {});
      await BluetoothEscposPrinter.printText('\r\n\n', {});
      await BluetoothEscposPrinter.printText('\r\n\n', {});

      // AlertManager.show("Success", "The report was printed successfully")
    } catch (error) {
      console.error("Print error:", error)
      AlertManager.show("Error", "Failed to print the report. Please check the printer connection.")
    } finally {
      closePrintModal()
    }
  }, [operator, orderHistory, boundAddress, closePrintModal])

  if (loading) {
    return <NormalLoader loading={loading} subTitle="Loading order history..." />
  }

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
        {!bleOpend && (
          <View style={styles.bluetoothStatus}>
            <Icon
              name={bleOpend && boundAddress ? "bluetooth" : "bluetooth-outline"}
              size={24}
              color={bleOpend && boundAddress ? "#4CAF50" : "#FF9800"}
            />
            <AppText
              text={bleOpend && boundAddress ? `Connected to: ${name || "UNKNOWN"}` : "Connecting to printer..."}
              style={styles.bluetoothStatusText}
            />
          </View>
        )}

        {filteredOrderHistory.length ? (
          <View style={styles.orderList}>
            {filteredOrderHistory.map((item) => (
              <OrderItems
                key={item._id}
                item={item}
                onPress={() => navigation.navigate("ORDER_DETAILS", { data: item, companyInfo: companyInfo, operator })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.noHistoryContainer}>
            <AppText text={"No order history found"} style={styles.noHistoryText} />
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
  },
  noHistoryText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonText: {
    color: "#ffffff",
  },
  button: {
    backgroundColor: "#3b3687",
    width: "100%",
  },
})
