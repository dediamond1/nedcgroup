import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TopHeader } from '../../../components/header/TopHeader';
import { AppScreen } from '../../../helper/AppScreen';

const MessageScreen = ({ route, navigation }) => {
    const { message } = route.params || {};
    return (
        <AppScreen style={styles.screen}>
            <TopHeader title={'Meddelande'} textStyle={{ fontSize: 24 }} icon onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.subject}>{message?.subject || 'Välkommen'}</Text>
                    <Text style={styles.date}>March 28, 2023</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.sender}>
                        <Icon name="email" size={30} color="#007AFF" />
                        <Text style={styles.senderName}>{message?.sender || "NEDC Group AB"}</Text>
                    </View>
                    <Text style={styles.text}>{message?.text || "Hej! vi har updaterad appen. nu har vi nya saker som vi har integrerat i appen. hoppas att ni gillar de nya funktioner.\n\nMed vanliga halsningar\NEDC Group AB"}</Text>
                </View>
            </View>
        </AppScreen>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subject: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    date: {
        fontSize: 16,
        color: '#4A4A4A',
    },
    body: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
    },
    sender: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    senderName: {
        marginLeft: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A4A4A',
    },
    text: {
        fontSize: 18,
        color: '#4A4A4A',
        lineHeight: 31,
    },
});

export default MessageScreen;
