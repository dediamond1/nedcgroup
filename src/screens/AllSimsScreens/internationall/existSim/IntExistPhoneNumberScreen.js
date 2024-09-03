import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Keyboard } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppScreen } from '../../../../helper/AppScreen';
import { TopHeader } from '../../../../components/header/TopHeader';

const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
        .matches(/^(0046|\+46|0)[\d]{1,9}$/, 'Ogiltigt nummer')
        .min(10, 'Ogiltigt nummer')
        .max(14)
        .required('Ange telefonnnumer'),
});

export const ExistPhoneNumberScreen = ({ navigation }) => {
    const handleNextButton = (values) => {
        // Do something with the validated phone number
        console.log(values.phoneNumber);
    };

    return (
        <AppScreen style={styles.screen}>
            <TopHeader title={'Telefonnummer'} icon onPress={() => navigation.goBack()} />
            <View style={styles.container}>
                <Formik
                    initialValues={{ phoneNumber: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleNextButton(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.screen}>
                            <View>
                                <Text style={styles.label}>Telefonnummer</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={handleChange('phoneNumber')}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={values.phoneNumber}
                                    keyboardType="phone-pad"
                                    maxLength={12}
                                />
                                {touched.phoneNumber && errors.phoneNumber && (
                                    <Text style={styles.error}>{errors.phoneNumber}</Text>
                                )}
                                <View>
                                    <Text style={[styles.numbersExample, {
                                        fontFamily: "ComviqSansWebBold",
                                    }]}>Till exampel: </Text>
                                    <Text style={styles.numbersExample}>+46712345678</Text>
                                    <Text style={styles.numbersExample}>0712345678</Text>
                                </View>
                                {isValid && <TouchableOpacity
                                    style={[styles.button]}
                                    onPress={handleSubmit}
                                    disabled={!values.phoneNumber}
                                >
                                    <Text style={styles.buttonText}>SKICKA SMS</Text>
                                </TouchableOpacity>}

                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </Formik>
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
        padding: 20,

    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        fontFamily: "ComviqSansWebBold",
    },
    input: {
        padding: 14,
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 10,
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 18,
        fontFamily: "ComviqSansWebRegular",

    },
    button: {
        backgroundColor: '#2bb2e0',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        fontFamily: "ComviqSansWebBold",
    },
    error: {
        color: 'red',
        fontSize: 15,
        marginVertical: 5,
        fontFamily: "ComviqSansWebRegular",
    },
    numbersExample: {
        fontFamily: "ComviqSansWebBold",
        fontSize: 15,
        color: "#595959",
        marginVertical: 8,
        lineHeight: 24
    }
});


