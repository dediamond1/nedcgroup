import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import InternationalSimMainScreen from "../../../screens/AllSimsScreens/internationall/existSim/InternationalMainScreen";
import { IntSimExistSimEixistNavs } from "./existSim";

const Stack = createStackNavigator()
export const InternationalSimNavigations = () => {
    return <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="INT_MAIN" component={InternationalSimMainScreen} />
        <Stack.Screen name="INT_REG_EXIST" component={IntSimExistSimEixistNavs} />
    </Stack.Navigator>
}