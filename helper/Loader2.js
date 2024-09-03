import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";
import { AppText } from "../src/components/appText";
import { TopHeader } from "../src/components/header/TopHeader";

export const NormalLoader = ({ text = "PRINTER UT VOUCHER...", subTitle = "vänligen vänta printer ut voucher", loading }) => {
    if (!loading) {
        return null
    }
    return (
        <Modal animationType="fade">
            <TopHeader title={"COMVIQ"} />
            <View style={styles.container}>
                <ActivityIndicator size={60} color="#2bb2e0" />
                <AppText text={subTitle} style={{ color: "#222222", marginVertical: 18, fontSize: 18, textTransform: "uppercase", fontFamily: "ComviqSansWebRegular", textAlign: "center", lineHeight: 28 }} />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",

    }
})