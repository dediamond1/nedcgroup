import { Formik } from "formik";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import * as Yup from 'yup'
import { TopHeader } from "../../../../components/header/TopHeader";
import { AppScreen } from "../../../../helper/AppScreen";


const validationSchema = Yup.object().shape({
    passportNumber: Yup.string()
        .matches(/^[A-PR-WY]\d{8}$/, 'Please enter a valid passport number')
        .required('Passport number is required'),
});

export const PassportNumberScreen = ({ navigation }) => {

    return <AppScreen style={styles.screen}>
        <TopHeader title={"COMVIQ"} icon onPress={() => navigation.goBack()} />
        <View style={styles.container}>

            <Formik
                initialValues={{ passportNumber: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => navigation.navigate('INT_CUSTOMER_INFO', {
                    passportNumber: values.passportNumber
                })}
            >
                {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
                    <View>
                        <View style={styles.inputContainer}>
                            <Text>Passnummer</Text>
                            <TextInput
                                placeholder="ABC123456"
                                style={styles.input}
                                onChangeText={handleChange('passportNumber')}
                                onBlur={handleBlur('passportNumber')}
                                value={values.passportNumber}
                            />
                            {touched.passportNumber && errors.passportNumber && (
                                <Text style={styles.errorText}>{errors.passportNumber}</Text>
                            )}
                        </View>
                        <AppButton onPress={handleSubmit} text="NÄSTA" style={styles.btn} textStyle={{ fontFamily: "ComviqSansWebBold", fontSize: 18 }} />
                    </View>
                )}
            </Formik>
        </View>
    </AppScreen>
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        padding: 16
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        padding: 12,
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 10,
        fontSize: 18,
        fontFamily: "ComviqSansWebRegular",
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    btn: {
        padding: 15,
        backgroundColor: "#2bb2e0"
    }
});