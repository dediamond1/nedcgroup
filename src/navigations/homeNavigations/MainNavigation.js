import React from 'react';

import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { MainScreen } from '../../screens/MainScreen';
import { DetailsScreen } from '../../screens/details/DetailsScreen';
import { QrCodeScreen } from '../../screens/qrCode/QrCodeScreen';
import { SeconDetails } from '../../screens/details/SeconDetails';
import { PincodeOtp } from '../../screens/pincode/PinOtp';


import { AllSimCardsNavigations } from '../AllSimRegNavigations';

const Stack = createStackNavigator();

export const MainNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
      <Stack.Screen name="MAIN" component={MainScreen} />
      <Stack.Screen
        name="DETAILS"
        component={DetailsScreen}
        options={{ ...TransitionPresets.SlideFromRightIOS }}
      />
      <Stack.Screen
        name="SECOND_DETAILS"
        component={SeconDetails}
        options={{ ...TransitionPresets.SlideFromRightIOS }}
      />
      <Stack.Screen
        name="PINCODEOTP"
        component={PincodeOtp}
        options={{ ...TransitionPresets.FadeFromBottomAndroid }}
      />
      <Stack.Screen
        name="CHECKOUT"
        component={QrCodeScreen}
        options={{ ...TransitionPresets.FadeFromBottomAndroid }}
      />
      <Stack.Screen name='ALL_SIM_CARDS' component={AllSimCardsNavigations} />
    </Stack.Navigator>
  );
};
