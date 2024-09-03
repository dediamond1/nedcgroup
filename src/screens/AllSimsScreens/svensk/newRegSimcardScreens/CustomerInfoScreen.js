import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TopHeader } from '../../../../components/header/TopHeader';
import { AppText } from '../../../../components/appText';
import { AppInput } from '../../../../components/input/AppInput';
import { AppButton } from '../../../../components/button/AppButton';


export const CustomerInfoScreen = ({ navigation, route }) => {

  const validationSchema = Yup.object().shape({

    personNummer: Yup.string()
      .required('Ange personnummer')
      .min(12, 'ange personnummer 12 siffror'),
  });


  const { simInfo } = route.params || {};
  const { iccID } = simInfo || {};


  return (
    <>

      <TopHeader
        title={'Kund information'}
        icon="chevron-left"
        onPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.container}>
        <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
          <View style={[styles.container, { padding: 10 }]}>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                personNummer: '',
              }}
              onSubmit={({ email, postalCode, city, street, personNummer }) => {
                navigation.navigate('COMFIRM_NONE_EXIT', {
                  userInfo: {
                    personalNumber: personNummer,
                    iccID: iccID,

                  }
                })
              }}>
              {({
                errors,
                touched,
                values,
                handleBlur,
                handleSubmit,
                handleChange,
              }) => (
                <>
                  <AppText
                    text={'Personnummer*'}
                    style={{ color: '#000', fontSize: 16, marginVertical: 2 }}
                  />
                  <AppInput
                    value={values.personNummer}
                    placeholder="ange Personnummer"
                    onChangeText={handleChange('personNummer')}
                    onBlur={handleBlur('personNummer')}
                    keyboardType="numeric"
                    maxLength={12}
                  />

                  {values.personNummer.length === 12 && iccID.length === 20 && <AppButton text={"Bekrafäta"} onPress={handleSubmit} />}


                </>
              )}
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
