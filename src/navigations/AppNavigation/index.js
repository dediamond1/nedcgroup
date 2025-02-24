import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../constants/colors';
import { StyleSheet } from 'react-native';
import { MainNavigation } from '../homeNavigations/MainNavigation';
import { AllSimCardsNavigations } from '../AllSimRegNavigations';
import LycaNavigation from '../lyckaNavigations/LycaNavigation';

const Stack = createStackNavigator();

const Fake = () => null;
export const AppNav = () => {

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}initialRouteName='HOME'>
      <Stack.Screen
        name="HOME"
        component={MainNavigation}
      />
      <Stack.Screen
        name="ALL_SIM_CARDS"
        component={AllSimCardsNavigations}

      />
      <Stack.Screen
        name="LYCA_NAVIGATION"
        component={LycaNavigation}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabStyles: {
    display: "none",
    backgroundColor: colors.primary.main,
    height: 70,
    marginHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 5,
  },
});
