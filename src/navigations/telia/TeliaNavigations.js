import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import TeliaCategoryScreen from '../../screens/telia-halebop/Telia-h-CategoryScreen';
import TeliaHalebopSingleProductScreen from '../../screens/telia-halebop/Telia-hale-singleProduct';
import TeliaHalebopPrintScreen from '../../screens/telia-halebop/telia-halebop-printScreen'; // Import the new screen
const Stack = createStackNavigator();
export const TeliaNavigations = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName='TELIA'
      >
      <Stack.Screen name="TELIA" component={TeliaCategoryScreen} />
      <Stack.Screen name="TELIA_DETAIL" component={TeliaHalebopSingleProductScreen} />
      <Stack.Screen name="TeliaHalebopPrintScreen" component={TeliaHalebopPrintScreen} />  
    </Stack.Navigator>
  );
};
