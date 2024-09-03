import React from "react";
import { createStackNavigator } from '@react-navigation/stack'
import { PassportNumberScreen } from "../../../../screens/AllSimsScreens/internationall/existSim/PassportNumberScreen";
import { ExistPhoneNumberScreen } from "../../../../screens/AllSimsScreens/internationall/existSim/IntExistPhoneNumberScreen";
import { IntCustomerInfoScreen } from "../../../../screens/AllSimsScreens/internationall/existSim/CustomerInfoScreen";

const Stack = createStackNavigator()
export const IntSimExistSimEixistNavs = () => {
    return <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="INT_CUSTOMER_INFO" component={IntCustomerInfoScreen} />
        <Stack.Screen name="INT_CUSTOMER_NUMBER" component={ExistPhoneNumberScreen} />
        <Stack.Screen name="PASS_NUMBER" component={PassportNumberScreen} />
    </Stack.Navigator>
}