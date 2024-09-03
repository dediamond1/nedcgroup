import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
//import FastImage from 'react-native-fast-image';
import { TopHeader } from '../src/components/header/TopHeader';
import { date } from 'yup';
// import { generateBarcodeBase64 } from './BarcodeGenerator';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AnimatedStatus = ({ status, title, message, onClose, voucherCode, ean, voucherDescription, OrderDate }) => {
    const [animationType, setAnimationType] = useState('bounceIn');
    const [currentTime, setCurrentTime] = useState(date);
    const [barcodeBase64, setBarcodeBase64] = useState();

    const backgroundColor = status === 'failed' ? '#E41B88' : '#3dc5f5';


    useEffect(() => {
        fetch('http://worldtimeapi.org/api/timezone/Europe/Stockholm')
            .then(response => response.json())
            .then(data => setCurrentTime(new Date(data.datetime)))
            .catch(error => console.error(error));
    }, []);



    useEffect(() => {
        if (status === 'failed') {
            setAnimationType('shake');

        } else {
            setAnimationType('bounceIn');
        }
    }, [status]);




    const formatDateTime = (dateTime) => {

        const formatTime = (time) => {
            const options = { hour: '2-digit', minute: '2-digit', hour12: false };
            return time?.toLocaleTimeString('sv-US', options);
        };

        const formatDate = (date) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date?.toLocaleDateString('en-US', options);
        };

        return {
            year: new Date(OrderDate).getFullYear(),
            time: formatTime(OrderDate),
            date: formatDate(OrderDate),
        };
    };


    const renderFadedTexts = () => {
        const topTexts = status === 'failed' ? Array(3).fill('INTE GODKÄND') : Array(2).fill('GODKÄND');
        const bottomTexts = status === 'failed' ? Array(3).fill('INTE GODKÄND') : Array(2).fill('GODKÄND');

        const topTextElements = topTexts.map((text, index) => {
            return (
                <Animatable.Text
                    key={`top_${index}`}
                    animation="fadeIn"
                    duration={1500}
                    delay={index * 100}
                    style={[styles.fadedText, { ...styles.topFadedText, color: status === 'failed' ? '#fecbe7' : '#90eebf', left: 90, fontSize: status === 'failed' ? 28 : 34, opacity: .2 }]}
                >
                    {text}
                </Animatable.Text>
            );
        });

        const bottomTextElements = bottomTexts.map((text, index) => {
            return (
                <Animatable.Text
                    key={`bottom_${index}`}
                    animation="fadeIn"
                    duration={1500}
                    delay={index * 100}
                    style={[styles.fadedText, { ...styles.bottomFadedText, color: status === 'failed' ? '#fecbe7' : '#90eebf', fontSize: status === 'failed' ? 28 : 34, right: 90 }]}
                >
                    {text}
                </Animatable.Text>
            );
        });

        return (
            <>
                {topTextElements}
                {bottomTextElements}
            </>
        );
    };

    return (
        <>


            <TopHeader title={message} style={{ backgroundColor }} />

            <View style={[styles.container, { backgroundColor }]}>
                <Text style={styles.title}>{title}</Text>
                {/* <Text style={styles.message}>{message}</Text> */}
                <View style={styles.voucherContainer}>
                    <View style={styles.header}>
                        <Text style={styles.storeName}>{voucherDescription ? voucherDescription : ''}</Text>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.voucherCode}>Voucher nr:</Text>
                        <Text style={styles.voucherCode}> {voucherCode ? voucherCode : ''}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            backgroundColor: status === 'failed' ? '#F7D8E6' : '#77D6F8',
                        },
                    ]}
                    onPress={onClose}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { color: status === 'failed' ? '#e2027b' : '#fff' },
                        ]}
                    >
                        OK
                    </Text>
                </TouchableOpacity>
            </View>
            {renderFadedTexts()}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 20,
        alignSelf: 'center',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -(windowWidth - 32) / 2 }, { translateY: -80 }],
        width: windowWidth - 32,
        elevation: 5,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'ComviqSansWebRegular',
    },
    message: {
        fontSize: 17,
        color: '#fff',
        marginBottom: 16,
        textAlign: 'center',
        lineHeight: 24,
        fontFamily: 'ComviqSansWebBold',
    },
    button: {
        width: "100%",
        marginTop: 5,
        borderRadius: 8,
        alignItems: 'center',
        padding: 16,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    fadedText: {
        position: 'absolute',
        fontSize: 40,
        elevation: 5,
        opacity: 0.5, // Adjust the opacity value as needed
        fontFamily: 'ComviqSansWebRegular',
    },
    topFadedText: {
        top: 140,
        left: 40,
        elevation: 5,
        fontFamily: 'ComviqSansWebRegular',
        transform: [
            { rotate: '-0deg' },
        ],
    },
    bottomFadedText: {
        bottom: 45,
        right: 50,
        fontFamily: 'ComviqSansWebRegular',
        opacity: 0.1, // Adjust the opacity value as needed
        transform: [
            { rotate: '-0deg' },
        ],
    },
    voucherContainer: {
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        padding: 10,
        marginBottom: 16,
        width: '100%', // Take full width
    },
    header: {
        paddingBottom: 8,
        borderBottomWidth: 1,
        marginVertical: 5,
        borderBottomColor: '#FFF',
        width: '100%', // Take full width
        alignItems: 'center',
    },
    storeName: {
        fontSize: 18,
        fontFamily: 'ComviqSansWebRegular',
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    voucherCode: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'ComviqSansWebRegular',
        textTransform: "uppercase",
        marginBottom: 8,
    },
    amount: {
        fontSize: 17.2,
        color: '#fff',
        fontFamily: 'ComviqSansWebBold',
        marginBottom: 8,
        marginVertical: 8
    },
    date: {
        fontSize: 14,
        fontFamily: 'ComviqSansWebBold',
        color: '#fff',
    },
});


