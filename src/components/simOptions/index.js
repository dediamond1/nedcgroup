import { useNavigation } from "@react-navigation/native"
import React from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { AppText } from "../appText"
export const SimOption = ({ options = [] }) => {
    const navigation = useNavigation()
    return <View style={styles.simsOuterContainer}>
        {options?.map((name, index) => <TouchableOpacity key={index} style={styles.simsContainer} onPress={() => navigation.navigate(name?.link)}>
            <View>
                <AppText style={styles.title} text={name.title} />
                <AppText style={styles.description} text={name.description} />
            </View>
        </TouchableOpacity>)}
    </View>
}

const styles = StyleSheet.create({
    simsOuterContainer: {
        padding: 20
    },
    simsContainer: {
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#fff",
        marginVertical: 12,
        height: 150,
        elevation: 3,
    },
    title: {
        color: "#000",
        fontSize: 20,
        textAlign: "center",
        fontFamily: "ComviqSansWebBold",
        marginVertical: 8

    },
    description: {
        textAlign: "center",
        fontSize: 18,
        lineHeight: 30,
        color: "#000",


    }
})