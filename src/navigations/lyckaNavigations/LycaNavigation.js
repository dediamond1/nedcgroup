import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainLyca from '../../screens/lyca/MainLyca';
import LycaDetails from '../../screens/lyca/LycaDetailsScreen';

// Import your screens here



const Stack = createStackNavigator();

function LycaNavigation() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainLyca" component={MainLyca} />
      <Stack.Screen name="LYCADETAILS" component={LycaDetails} />

    </Stack.Navigator>
  );
}

export default LycaNavigation;

