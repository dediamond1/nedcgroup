import { StyleSheet, View, TouchableOpacity } from "react-native"
import { AppText } from "../appText"
import { format } from "date-fns"
import Icon from "react-native-vector-icons/Ionicons"

export const OrderItems = ({ item, onPress, operator }) => {
  const { voucherNumber, OrderDate, voucherDescription } = item || {}

  const dateObj = new Date(OrderDate)
  const dateFormat = "dd-MM-yyyy"
  const timeFormat = "HH:mm"

  const formattedDate = dateObj ? format(dateObj, dateFormat) : ""
  const formattedTime = dateObj ? format(dateObj, timeFormat) : ""

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.voucherSection}>
          <AppText style={styles.voucherTitle} text={voucherDescription} />
          <View style={styles.voucherNumberContainer}>
            <Icon name="barcode-outline" size={16} color="#fff" style={styles.icon} />
            <AppText style={styles.voucherNumber} text={voucherNumber} />
          </View>
        </View>
        <View style={styles.dateSection}>
          <View style={styles.dateContainer}>
            <Icon name="calendar-outline" size={16} color="#fff" style={styles.icon} />
            <AppText style={styles.dateValue} text={formattedDate} />
          </View>
          <View style={styles.timeContainer}>
            <Icon name="time-outline" size={16} color="#fff" style={styles.icon} />
            <AppText style={styles.timeValue} text={formattedTime} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#3b3687",
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  voucherSection: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "ComviqSansWebBold",
    marginBottom: 5,
  },
  voucherNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  voucherNumber: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "ComviqSansWebBold",
  },
  dateSection: {
    alignItems: "flex-end",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateValue: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "ComviqSansWebBold",
  },
  timeValue: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "ComviqSansWebBold",
  },
  icon: {
    marginRight: 5,
  },
})

