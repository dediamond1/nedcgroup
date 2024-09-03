import React from "react"
import { createStackNavigator } from '@react-navigation/stack'
import SvenskaMainScreen from "../../../screens/AllSimsScreens/svensk/SvenskMainScreen"
import { SvenskNewSimNav } from "./noneExistSimNav"
import { SvenskExistSimNav } from "./existingSimNav"

const Stack = createStackNavigator()
export const SvenskSIMnavigations = () => {
    return <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SVENSK_MAIN" component={SvenskaMainScreen} />
        <Stack.Screen name="SVENSK_NEW" component={SvenskNewSimNav} />
        <Stack.Screen name="SVENSK_EXIST" component={SvenskExistSimNav} />
    </Stack.Navigator>
}