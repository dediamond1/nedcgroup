import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "../../components/appText";
import { TopHeader } from "../../components/header/TopHeader";
import { SimOption } from "../../components/simOptions";
import { AppScreen } from "../../helper/AppScreen";

const simcards = [
    {
        title: "Svensk",
        description: "Kunden bor i Sverige och har giltigt nationellt ID",
        link: "SVENSK_REG_SIM"
    },
    // {
    //     title: "Utländsk",
    //     description: "Kunden är ej svensk medbörgare och saknar nationellt ID",
    //     link: "INTERNATIONAL_REG_SIM"
    // },
    // {
    //     title: "Företag",
    //     description: "Kunden är firmatecknaren och har giltigt nationellt ID",
    //     link: "COMPANY_REG_SIM"
    // },
]

export default function AllSimRegMainScreen({ navigation }) {
    return <AppScreen style={styles.screen}>
        <TopHeader textStyle={{ fontSize: 26 }} title={"COMVIQ"} icon onPress={() => navigation.goBack()} />
        <SimOption options={simcards} />
    </AppScreen>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },

})