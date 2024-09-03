import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import AllSimRegMainScreen from "../../screens/AllSimsScreens";
import { SvenskSIMnavigations } from "./svensk";
import { InternationalSimNavigations } from "./international";



const Stack = createStackNavigator()

export const AllSimCardsNavigations = () => {
    return <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ALLSIM_MAIN" component={AllSimRegMainScreen} />
        <Stack.Screen name="SVENSK_REG_SIM" component={SvenskSIMnavigations} />
        <Stack.Screen name="INTERNATIONAL_REG_SIM" component={InternationalSimNavigations} />
    </Stack.Navigator>
}