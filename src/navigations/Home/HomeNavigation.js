import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AppNav } from '../AppNavigation';
import { HistoryNavigation } from '../historyNavigation/HistoryNavigation';
import { SettingsNavigation } from '../settingsNavigation/SettingsNavigation';
import IntroScreen from '../../screens/IntroScreen';
import { AllSimCardsNavigations } from '../AllSimRegNavigations';
import { MessagesScreen } from '../../screens/messages/MessagesScreen';
import MessageScreen from '../../screens/messages/message/MessageScreen';
import { TechDevAd } from '../../screens/ads/TechdevIntroScreen';
import { TestingPrinter } from '../../helper/Printer';
import { TopNavigationHistory } from '../historyNavigation/TopNavigationHistory';
import NewsNavigations from '../newsNAvigations/NewsNavigations';
import LycaNavigation from '../lyckaNavigations/LycaNavigation';
import { TeliaNavigations } from '../telia/TeliaNavigations';

const Stack = createStackNavigator();

const Fake = () => null;

export const AppSideNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="INTRO">
      <Stack.Screen
        name="HOME_START"
        component={AppNav}
      />
      <Stack.Screen
        name="LYCA_NAVIGATION"
        component={LycaNavigation}
      />
      <Stack.Screen
        name="TELIA_NAVIGATION"
        component={TeliaNavigations}
      />
      <Stack.Screen
        name="ALL_SIM_CARDS"
        component={AllSimCardsNavigations}

      />
      <Stack.Screen
        name="INTRO"
        component={IntroScreen}

      />
      <Stack.Screen
        name="MESSAGES"
        component={MessagesScreen}
      />
      <Stack.Screen
        name="MESSAGE"
        component={MessageScreen}
        options={{ ...TransitionPresets.SlideFromRightIOS }}
      />
      <Stack.Screen
        name="TECHDEV"
        component={TechDevAd}
        options={{ ...TransitionPresets.SlideFromRightIOS }}
      />

      <Stack.Screen
        name="ORDER_HISTORY_NAV"
        component={HistoryNavigation}

      />
      <Stack.Screen
        name="NEW_NAVIGATIONS"
        component={NewsNavigations}
      />
      <Stack.Screen
        name="APP_SETTINGS"
        component={SettingsNavigation}
      />
    </Stack.Navigator>
  );
};
