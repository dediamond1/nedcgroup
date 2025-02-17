"use client"

import  React from "react"
import { useState } from "react"
import { Modal, View, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { AppText } from "../appText"
import Icon from "react-native-vector-icons/Ionicons"
import { format } from "date-fns"
import DateTimePicker from "@react-native-community/datetimepicker"



const { width: SCREEN_WIDTH } = Dimensions.get("window")

export const PrintModal = ({ visible, onClose, onPrint }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date()
    setShowDatePicker(false)
    setSelectedDate(currentDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} accessibilityLabel="Close modal">
            <Icon name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <AppText text="Skriv ut rapport" style={styles.modalTitle} />

            <View style={styles.dateSection}>
              <AppText text="Välj datum:" style={styles.sectionTitle} />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel={`Select date, current selection: ${format(selectedDate, "yyyy-MM-dd")}`}
              >
                <Icon name="calendar-outline" size={24} color="#fff" />
                <AppText text={format(selectedDate, "yyyy-MM-dd")} style={styles.dateText} />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
            )}

            <View style={styles.optionsSection}>
              <AppText text="Välj rapporttyp:" style={styles.sectionTitle} />
              <TouchableOpacity
                style={styles.printOption}
                onPress={() => onPrint("total", selectedDate)}
                accessibilityLabel="Print total amount report"
              >
                <Icon name="document-text-outline" size={24} color="#fff" />
                <View style={styles.optionTextContainer}>
                  <AppText text={`Endast totalsumma`} style={styles.optionText} />
                  <AppText text="Visar den totala försäljningssumman för vald dag" style={styles.optionDescription} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.printOption}
                onPress={() => onPrint("full", selectedDate)}
                accessibilityLabel="Print full report"
              >
                <Icon name="list-outline" size={24} color="#fff" />
                <View style={styles.optionTextContainer}>
                  <AppText text={`Fullständig rapport`} style={styles.optionText} />
                  <AppText
                    text="Visar detaljerad information om alla ordrar för vald dag"
                    style={styles.optionDescription}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#3b3687",
    borderRadius: 20,
    padding: 20,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: SCREEN_WIDTH * 0.9,
    maxHeight: "80%",
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    color: "#fff",
  },
  dateSection: {
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  optionsSection: {
    marginTop: 10,
  },
  printOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 5,
  },
})

