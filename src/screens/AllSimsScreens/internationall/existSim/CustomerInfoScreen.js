import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppScreen } from '../../../../helper/AppScreen';
import { TopHeader } from '../../../../components/header/TopHeader';
import { countries } from '../../../../utils/countries';
import { AppButton } from '../../../../components/button/AppButton';


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    container: {
        paddingHorizontal: 16,
        paddingVertical: 32,
        backgroundColor: "#fff"
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        height: 52,
        borderColor: '#000',
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    errorText: {
        color: '#e2027b',
        marginTop: 5,
        fontFamily: "ComviqSansWebRegular",
        fontSize: 15
    },
    picker: {
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        height: 40,
        marginTop: 5,
        marginBottom: 10,
        fontFamily: "ComviqSansWebBold",
        elevation: 2,
    },
    label: {
        fontSize: 17,
        marginVertical: 5,
        fontFamily: "ComviqSansWebBold",
    },
    btn: {
        backgroundColor: "#2bb2e0",
        padding: 16
    }
});



const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Förnamn är obligatoriskt'),
    lastName: Yup.string().required('Efternamn är obligatoriskt'),
    address: Yup.string().required('Adress är obligatoriskt'),
    postalCode: Yup.string().required('Postnummer är obligatoriskt'),
    country: Yup.string().required('Land är obligatoriskt'),
});

export const IntCustomerInfoScreen = ({ navigation }) => {

    return (
        <AppScreen style={styles.screen}>
            <TopHeader title={"Kund uppgifter"} icon onPress={() => navigation.goBack()} />
            <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        address: '',
                        postalCode: '',
                        country: 'SE',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => console.log(values)}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.screen}>
                            <View style={styles.container}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Förnamn</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        value={values.firstName}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <Text style={styles.errorText}>{errors.firstName}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Efternamn</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        value={values.lastName}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <Text style={styles.errorText}>{errors.lastName}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Adress</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        value={values.address}
                                    />
                                    {touched.address && errors.address && (
                                        <Text style={styles.errorText}>{errors.address}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Postnummer</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={handleChange('postalCode')}
                                        onBlur={handleBlur('postalCode')}
                                        value={values.postalCode}
                                    />
                                    {touched.postalCode && errors.postalCode && (
                                        <Text style={styles.errorText}>{errors.postalCode}</Text>
                                    )}
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Välj nationalitet</Text>
                                    {/* <Text style={styles.inputValue}>{countries.find(country => country.value === values.country)?.label}</Text> */}
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={values.country}
                                        onValueChange={(value) => setFieldValue('country', value)}
                                    >
                                        {countries.map((country) => (
                                            <Picker.Item key={country.value} label={country.label} value={country.value} style={{ fontFamily: "ComviqSansWebBold", }} />
                                        ))}
                                    </Picker>
                                    {touched.country && errors.country && (
                                        <Text style={styles.errorText}>{errors.country}</Text>
                                    )}
                                </View>

                                <AppButton text="Submit" onPress={handleSubmit} style={styles.btn} />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                </Formik>
                <View style={{ height: 60 }} />
            </ScrollView>

        </AppScreen>
    );
};


