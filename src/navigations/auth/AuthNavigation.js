import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../../screens/auth/LoginScreen';
import { PinCodeScreen } from '../../screens/pincode/PinCodeScreen';
import { AppNav } from '../AppNavigation';
import { AppSideNavigation } from '../Home/HomeNavigation';
import { SettingsNavigation } from '../settingsNavigation/SettingsNavigation';
import { SupportScreen } from '../../screens/settings/support/SupportScreen';

const Stack = createStackNavigator();
export const AuthNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LOGIN" component={LoginScreen} />
      <Stack.Screen name="PINSCREEN" component={PinCodeScreen} />
      <Stack.Screen name="HOME_MAIN" component={AppSideNavigation} />
      <Stack.Screen name="HELP" component={SupportScreen} />
    </Stack.Navigator>
  );
};
