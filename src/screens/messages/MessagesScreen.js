import React from "react";

import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TopHeader } from "../../components/header/TopHeader";
import { AppScreen } from "../../helper/AppScreen";


export const MessagesScreen = ({ navigation }) => {
    return <AppScreen style={styles.screen}>
        <TopHeader title={"Meddelanden"} textStyle={{ fontSize: 24 }} icon onPress={() => navigation.goBack()} />
        <ScrollView style={styles.screen}>
            <Messages messages={[{ text: "Ny uppdatering", iconName: "email" }]} onPress={() => navigation.navigate('MESSAGE')} />
        </ScrollView>
    </AppScreen>
}




const Messages = ({ messages, onPress }) => {
    return (
        <View style={styles.container}>
            {messages.map((message, index) => (
                <TouchableOpacity key={index} onPress={onPress}>
                    <View style={styles.messageContainer}>
                        <Icon name="email" size={30} color="#007AFF" />
                        <Text style={styles.messageText}>{message.text}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    container: {
        backgroundColor: '#F8F8F8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 8
    },
    messageText: {
        marginLeft: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A4A4A',

    },
})


