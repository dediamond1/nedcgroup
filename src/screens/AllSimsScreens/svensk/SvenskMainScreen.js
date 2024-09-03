import React from "react";
import { StyleSheet, View } from "react-native";
import { TopHeader } from "../../../components/header/TopHeader";
import { SimOption } from "../../../components/simOptions";
import { AppScreen } from "../../../helper/AppScreen";
const simOptions = [
    {
        title: "Nytt SIM-kort",
        description: "Kunden vill ha ett nytt Comviq-nummer",
        link: "SVENSK_NEW"
    },
    {
        title: "Befintligt SIM-kort",
        description: "Använd kundens befintliga Comviq-nummer",
        link: "SVENSK_EXIST"
    }
]
export default function SvenskaMainScreen({ navigation }) {
    return <AppScreen style={styles.screen}>
        <TopHeader title={"COMVIQ"} icon onPress={() => navigation.goBack()} />
        <SimOption options={simOptions} />
    </AppScreen>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    }
})