import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RegisterNumberScreen } from '../../../../screens/AllSimsScreens/svensk/existingRegSimcardScreens/RegisterNumberScreen'
import { SmsCodeScreen } from '../../../../screens/AllSimsScreens/svensk/existingRegSimcardScreens/SmsCodeScreen'
import { NewSimcardScreen } from '../../../../screens/AllSimsScreens/svensk/existingRegSimcardScreens/ExistingSimCardReg'
import { ConfirmScreen } from '../../../../screens/AllSimsScreens/svensk/existingRegSimcardScreens/ConfirmScreen'


const Stack = createStackNavigator();

export const SvenskExistSimNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="REGISTER_SIM" component={RegisterNumberScreen} />
      <Stack.Screen name="SMS" component={SmsCodeScreen} />
      <Stack.Screen name="NEW_SIMCARD" component={NewSimcardScreen} />
      <Stack.Screen name="COMFIRM_EXITS" component={ConfirmScreen} />
    </Stack.Navigator>
  );
};
