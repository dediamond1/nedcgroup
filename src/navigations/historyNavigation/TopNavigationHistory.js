import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { HistoryNavigation } from "./HistoryNavigation";
import { OrderPdfHistory } from "../../screens/history/OrderPDfHistory";
const TopTab = createMaterialTopTabNavigator()
export const TopNavigationHistory = () => {
    return <TopTab.Navigator>
        <TopTab.Screen name="ORDER_HISTORY_NAVI" component={HistoryNavigation} />
        <TopTab.Screen name="ORDER_PDF_HISTORY" component={OrderPdfHistory} />
    </TopTab.Navigator>
}