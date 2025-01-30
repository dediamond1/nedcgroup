import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { AppText } from '../appText';
import { format } from 'date-fns';

export const OrderItems = ({ item, onPress, operator }) => {
  const {
    voucherNumber,
    OrderDate,
    voucherDescription,
  } = item || {};

  // Ensure OrderDate is not null or undefined
  const dateObj = new Date(OrderDate)

  // Define the format for date and time
  const dateFormat = 'dd-MM-yyyy'; // Change this format as needed
  const timeFormat = 'HH:mm'; // Change this format as needed

  // Format the date and time
  const formattedDate = dateObj ? format(dateObj, dateFormat) : '';
  const formattedTime = dateObj ? format(dateObj, timeFormat) : '';

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.voucherSection}>
          <AppText style={styles.voucherTitle} text={voucherDescription} />
          <AppText style={styles.voucherNumber} text={voucherNumber} />
        </View>
        <View style={styles.dateSection}>
          <AppText style={styles.dateValue} text={formattedDate} />
          <AppText style={styles.timeValue} text={`Tid: ${formattedTime}`} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#3b3687',
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voucherSection: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
  voucherNumber: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
  dateSection: {
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
  dateValue: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
    marginBottom: 2,
  },
  timeValue: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
});
