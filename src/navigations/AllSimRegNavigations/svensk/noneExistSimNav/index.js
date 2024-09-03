import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomerInfoScreen } from '../../../../screens/AllSimsScreens/svensk/newRegSimcardScreens/CustomerInfoScreen';
import { NoneExistSimScreen } from '../../../../screens/AllSimsScreens/svensk/newRegSimcardScreens/NoneExistSimScreen';
import { ConfirmNoneExistingScreen } from '../../../../screens/AllSimsScreens/svensk/newRegSimcardScreens/ConfirmNoneExising';

const Stack = createStackNavigator();
export const SvenskNewSimNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NONE_EXIST_SIM" component={NoneExistSimScreen} />
      <Stack.Screen name="CUSTOMER_INFO" component={CustomerInfoScreen} />
      <Stack.Screen name="COMFIRM_NONE_EXIT" component={ConfirmNoneExistingScreen} />
    </Stack.Navigator>
  );
};
