import AsyncStorage from '@react-native-async-storage/async-storage';

const itemKey = 'authToken';
const bluetoothKey = 'bl-';
const terminalKey = 'terminal';

export const storeToken = async (authtoken) => {
  try {
    const jsonData = JSON.stringify(authtoken);
    console.log('jsonData', jsonData);
    await AsyncStorage.setItem(itemKey, jsonData);
  } catch (error) {
    console.log('Error storing the token', error);
  }
};

export const saveBluetooth = async (authtoken) => {
  try {
    const jsonData = JSON.stringify(authtoken);
    console.log('jsonData', jsonData);
    await AsyncStorage.setItem(bluetoothKey, jsonData);
  } catch (error) {
    console.log('Error storing Bluetooth data', error);
  }
};

export const removeBluetooth = async ()=> {
  try {
    await AsyncStorage.removeItem(bluetoothKey);
  } catch (error) {
    console.log('Error removing Bluetooth data', error);
  }
};

export const getBluetooth = async () => {
  try {
    return await AsyncStorage.getItem(bluetoothKey);
  } catch (error) {
    console.log('Error getting Bluetooth data', error);
    return null;
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(itemKey);
  } catch (error) {
    console.log('Error getting auth token', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(itemKey);
  } catch (error) {
    console.log('Error removing auth token', error);
  }
};

export const storeTerminalId = async (termId) => {
  try {
    await AsyncStorage.setItem(terminalKey, termId);
  } catch (error) {
    console.log('Error storing terminal ID', error);
  }
};

export const getTerminalId = async () => {
  try {
    return await AsyncStorage.getItem(terminalKey);
  } catch (error) {
    console.log('Error getting terminal ID', error);
    return null;
  }
};
