import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { OrderHistory } from '../../screens/history/OrderScreen';
import { OrderDetails } from '../../screens/history/OrderDetails';
import OrderHistoryMainScreen from '../../screens/history/OrderHistoryMainScreen';

const Stack = createStackNavigator();

export const HistoryNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ORDER_HISTORY_MAIN" component={OrderHistoryMainScreen} />
      <Stack.Screen name="ORDER_HISTORY" component={OrderHistory} />
      <Stack.Screen name="ORDER_DETAILS" component={OrderDetails} />
    </Stack.Navigator>
  );
};
