import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {SetttingsScreen} from '../../screens/settings/SettingsScreen';
import {SupportScreen} from '../../screens/settings/support/SupportScreen';
import {PrivacyScreen} from '../../helper/Privacy';
import {AccountScreen} from '../../screens/settings/account/AccountScreen';
const Stack = createStackNavigator();
export const SettingsNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="SETTINGS">
      <Stack.Screen name="SETTINGS" component={SetttingsScreen} />
      <Stack.Screen
        name="ACCOUNT_INFO"
        component={AccountScreen}
        options={{...TransitionPresets.SlideFromRightIOS}}
      />
      <Stack.Screen name="SUPPORT" component={SupportScreen} />
      <Stack.Screen name="PRIVACY" component={PrivacyScreen} />
    </Stack.Navigator>
  );
};
