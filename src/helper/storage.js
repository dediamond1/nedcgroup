import AsyncStorage from '@react-native-async-storage/async-storage';

const itemKey = 'authToken';
const bluetoothKey = 'bl-';
const terminalKey = 'terminal';

export const storeToken = async (authtoken: any): Promise<void> => {
  try {
    const jsonData = JSON.stringify(authtoken);
    console.log('jsonData', jsonData);
    await AsyncStorage.setItem(itemKey, jsonData);
  } catch (error) {
    console.log('Error storing the token', error);
  }
};

export const saveBluetooth = async (authtoken: any): Promise<void> => {
  try {
    const jsonData = JSON.stringify(authtoken);
    console.log('jsonData', jsonData);
    await AsyncStorage.setItem(bluetoothKey, jsonData);
  } catch (error) {
    console.log('Error storing Bluetooth data', error);
  }
};

export const removeBluetooth = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(bluetoothKey);
  } catch (error) {
    console.log('Error removing Bluetooth data', error);
  }
};

export const getBluetooth = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(bluetoothKey);
  } catch (error) {
    console.log('Error getting Bluetooth data', error);
    return null;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(itemKey);
  } catch (error) {
    console.log('Error getting auth token', error);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(itemKey);
  } catch (error) {
    console.log('Error removing auth token', error);
  }
};

export const storeTerminalId = async (termId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(terminalKey, termId);
  } catch (error) {
    console.log('Error storing terminal ID', error);
  }
};

export const getTerminalId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(terminalKey);
  } catch (error) {
    console.log('Error getting terminal ID', error);
    return null;
  }
};
