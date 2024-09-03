import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { AppText } from '../appText';
import { format } from 'date-fns';

export const OrderItems = ({ item, onPress }) => {
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
        {voucherNumber && (
          <View>
            <View>
              <AppText style={styles.title} text={voucherDescription} />
            </View>
            <View>
              <AppText style={styles.voucherName} text={'Voucher nummer'} />
              <AppText style={styles.description} text={voucherNumber} />
            </View>
          </View>
        )}
        {OrderDate && (
          <View style={styles.dateContainer}>
            <View style={{ alignItems: 'center', fontSize: 14 }}>
              <AppText
                style={{ fontFamily: 'ComviqSansWebBold', fontSize: 16 }}
                text={'Datum'}
              />
              <AppText
                style={{ fontFamily: 'ComviqSansWebBold', fontSize: 16 }}
                text={formattedDate}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <AppText
                text={'Tid: '}
                style={{ fontFamily: 'ComviqSansWebBold', fontSize: 16 }}
              />
              <AppText
                text={formattedTime}
                style={{
                  fontFamily: 'ComviqSansWebBold',
                  fontSize: 16,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#2bb2e0',
    marginVertical: 8,
    borderRadius: 10,
  },

  voucherName: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'ComviqSansWebBold',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'column',
  },
});
