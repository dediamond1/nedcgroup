import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TopHeader } from '../../../components/header/TopHeader';
import { AuthContext } from '../../../context/auth.context';
import { useGetCompanyInfo } from '../../../hooks/useGetCompanyInfo';

export const AccountScreen = ({ navigation }) => {

  const { getCompanyInfo, companyInfo } = useGetCompanyInfo()
  const { manager } = companyInfo || {}
  const { IsActive, address, managerEmail, name, orgNumber } = manager || {}
  useEffect(() => {
    getCompanyInfo()
  }, [])

  const companyName = name ? name : '';
  const email = managerEmail ? managerEmail : ''
  const isActive = IsActive ? IsActive : false;
  const postalCode = address?.postNumber;
  const city = address?.city
  const orgnumber = orgNumber ? orgNumber : ''

  if (!manager) {
    return <>
      <Text>HÄMTAR KONTO INFORMATION...</Text>
    </>
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopHeader title={'KONTO INFOMATION'} icon onPress={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.label}>Company Name</Text>
                <Text style={styles.value}>{companyName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Organization number</Text>
                <Text style={styles.value}>{orgnumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{email}</Text>
              </View>
              <View style={styles.row}>
                <View style={[styles.statusIndicator, isActive ? styles.activeIndicator : styles.inactiveIndicator]} />
                <Text style={[styles.status, isActive ? styles.activeText : styles.inactiveText]}>
                  {isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>City</Text>
                <Text style={styles.value}>{city}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Postal Code</Text>
                <Text style={styles.value}>{postalCode}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  infoContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  column: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 8,
    fontFamily: 'ComviqSansWebBold',
  },
  value: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'ComviqSansWebRegular',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activeIndicator: {
    backgroundColor: '#00C851',
  },
  inactiveIndicator: {
    backgroundColor: '#FF4444',
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#00C851',
  },
  inactiveText: {
    color: '#FF4444',
  },
});

