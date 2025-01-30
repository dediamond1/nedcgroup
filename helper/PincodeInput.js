import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, TextInput, StyleSheet } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export const PincodeInput = ({ onPress, backgroundColor ="#3b3687" }) => {
    const [pincode, setPincode] = useState('');

    const handleNumberPress = (number) => {
        if (pincode.length < 4) {
            setPincode(pincode + number);
        }
    };

    useEffect(() => {
        if (pincode.length === 4) {
            handleSubmitt();
        }
    }, [pincode]);

    const handleDeletePress = () => {
        setPincode(pincode.slice(0, -1));
    };

    const handleSubmitt = () => {
        if (pincode?.length < 4) {
            return alert('Ange pinkod')
        }

        onPress(pincode)
        setPincode('')
    }


    return (
        <View style={styles.container}>

            {pincode?.length < 1 ? <View style={styles.pincodeContainer} >

                <View
                    style={[styles.pincodeInput, { backgroundColor: "transparent" }]}
                />
            </View> : <View style={styles.pincodeContainer}>
                <View style={styles.pincodeRow}>
                    {Array.from({ length: pincode.length }).map((_, index) => (
                        <TextInput
                            key={index}
                            style={styles.pincodeInput}
                            value={pincode[index]}
                            maxLength={1}
                            // secureTextEntry={true}
                            editable={false}
                            underlineColorAndroid="transparent"
                        />
                    ))}
                </View>
            </View>}


            <View style={styles.numberPad}>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('1')}>
                        <Text style={styles.numberButtonText}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('2')}>
                        <Text style={styles.numberButtonText}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('3')}>
                        <Text style={styles.numberButtonText}>3</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('4')}>
                        <Text style={styles.numberButtonText}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('5')}>
                        <Text style={styles.numberButtonText}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('6')}>
                        <Text style={styles.numberButtonText}>6</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('7')}>
                        <Text style={styles.numberButtonText}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('8')}>
                        <Text style={styles.numberButtonText}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('9')}>
                        <Text style={styles.numberButtonText}>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} disabled={pincode.length < 4} onPress={handleSubmitt}>
                        <MaterialCommunityIcons name='check' size={45} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} onPress={() => handleNumberPress('0')}>
                        <Text style={styles.numberButtonText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.numberButton, {backgroundColor}]} disabled={pincode.length === 0} onPress={handleDeletePress}>
                        <MaterialCommunityIcons name='backspace-outline' color={"#fff"} size={30} />

                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    pinCodeHeader: {
        padding: 10,
        marginVertical: 20
    },
    pinCodeText: {
        fontSize: 22,
        textAlign: "center",
        fontFamily: "ComviqSansWebBold"

    },
    pincodeContainer: {
        marginBottom: 20,
    },

    pincodeContainer: {
        marginBottom: 20,
    },
    pincodeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    pincodeInput: {
        backgroundColor: '#F2F2F2',
        width: 45,
        height: 45,
        borderRadius: 55 / 2,
        marginHorizontal: 16,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "ComviqSansWebBold",
        fontWeight: '600',
    },
    numberPad: {
        borderRadius: 8,
        padding: 24,
        width: '100%',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    numberButton: {
        backgroundColor: '#3b3687',
        borderRadius: 73 / 2,
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    numberButtonText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: "#fff",
        fontFamily: "ComviqSansWebBold"
    },
    deleteButtonText: {
        color: '#ff5c5c',
        marginVertical: 5,
        fontFamily: "ComviqSansWebBold"

    },
    submitButtonText: {
        color: '#4caf50',
        marginVertical: 5,
        fontFamily: "ComviqSansWebBold"
    },
});
