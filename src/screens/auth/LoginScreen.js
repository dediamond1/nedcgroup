import React from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Platform,
  Pressable,

} from 'react-native';
import { TopHeader } from '../../components/header/TopHeader';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppInput } from '../../components/input/AppInput';
import { AppButton } from '../../components/button/AppButton';
import { AppScreen } from '../../helper/AppScreen';


import { colors } from '../../constants/colors';
import { AppText } from '../../components/appText';
import { useNavigation } from '@react-navigation/native';

import { Status } from '../../../helper/Status';
import useAuthenticate from '../../hooks/useAuthenticate';
import { NormalLoader } from '../../../helper/Loader2';

const validate = Yup.object().shape({
  email: Yup.string().email('Ange rätt e-post').required('Ange e-post'),
  password: Yup.string().required('Ange Lösenord'),
  pincode: Yup.string().max(4).required('ange pinkod'),
});

export const LoginScreen = () => {
  const { loading: load, error, authenticate, setError } = useAuthenticate()
  const navigation = useNavigation();
  const authenticateUser = async (email, password) => {
    await authenticate({ email: email, password: password })
  }

  return (
    <>
      {!load && error && <Status
        loading={load}
        error={error}
        subTitle={load ? 'loggar in...' : 'Fel e-post eller lösenord...'}
        text={"Fel e-post eller lösenord..."}
        cantelText={"Försök igen"}
        cantelTextStyle={{ width: '100%' }}
        onPressOverLay={Keyboard.dismiss}
        onPressCancel={() => setError(false)}
      />}
      {load ? (
        <NormalLoader
          loading={load}
          onPressOverLay={Keyboard.dismiss}
          subTitle={load ? 'loggar in...' : 'Fel e-post eller lösenord...'}
          cantelText={"Försök igen"}
          cantelTextStyle={{ width: '100%' }}

          onPressCancel={() => setError(false)}
        />
      ) : null}

      <TouchableWithoutFeedback
        style={styles.screen}
        onPress={Keyboard.dismiss}>
        <AppScreen style={styles.screen}>
          <TopHeader title={'LOGGA IN'} />
          <Formik
            initialValues={{ email: '', password: '', pincode: '' }}
            validationSchema={validate}
            onSubmit={async ({ email, password }) => {
              authenticateUser(email, password);
            }}>
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              errors,
              touched,
              values,
            }) => (
              <KeyboardAvoidingView
                style={styles.contentContainer}
                keyboardVerticalOffset={90}
                behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
                <AppText
                  text={'E-post'}
                  style={{ color: '#000', fontSize: 17, fontFamily: 'ComviqSansWebBold' }}
                />
                <AppInput
                  placeholder="E-post"
                  keyboardType="email-address"
                  returnKeyType="next"
                  clearButtonMode="while-editing"
                  textContentType="emailAddress"
                  value={values.email}
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  style={{
                    padding: 12,
                    borderWidth: 2,
                    borderRadius: 10,
                    fontSize: 17,
                    color: '#000',
                    borderColor:
                      touched.email && errors.email ? '#e2027b' : '#000',
                  }}
                />
                {touched.email && errors.email && (
                  <AppText
                    style={styles.errText}
                    text={touched.email && errors.email}
                  />
                )}
                <AppText
                  text={'Lösenord'}
                  style={{ color: '#000', fontSize: 17, fontFamily: 'ComviqSansWebBold' }}
                />
                <AppInput
                  placeholder="Lösenord"
                  secureTextEntry
                  returnKeyType="done"
                  clearButtonMode="while-editing"
                  textContentType="password"
                  autoCapitalize="none"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  onSubmitEditing={handleSubmit}
                  style={{
                    padding: 12,
                    borderWidth: 2,
                    borderRadius: 10,
                    fontSize: 17.5,
                    borderColor:
                      touched.password && errors.password ? '#e2027b' : '#000',
                  }}
                />
                {touched.password && errors.password && (
                  <AppText style={styles.errText} text={errors.password} />
                )}
                {!load && (
                  <AppButton
                    style={{
                      padding: 16,
                      backgroundColor: load ? 'grey' : '#2bb2e0',
                    }}
                    textStyle={{ fontFamily: "ComviqSansWebRegular", fontSize: 18 }}
                    loading={load}
                    text={'Logga in'}
                    onPress={() => {
                      handleSubmit;
                      Keyboard.dismiss();
                      authenticate(values.email, values.password);
                    }}
                  />
                )}

                <View>
                  <AppText
                    text={'Har du problem med att komma igång ?'}
                    style={{
                      color: '#222222',
                      textAlign: 'center',
                      marginVertical: 10,
                      fontSize: 16,
                      fontFamily: "ComviqSansWebRegular"
                    }}
                  />
                  <Pressable onPress={() => navigation.navigate('HELP')}>
                    <AppText
                      text={'Kontakta support'}
                      style={{
                        color: '#e2027b',
                        textAlign: 'center',
                        fontSize: 18,
                        padding: 16,
                        textDecorationLine: 'underline',
                        fontFamily: "ComviqSansWebRegular"
                      }}
                    />
                  </Pressable>
                </View>
              </KeyboardAvoidingView>
            )}
          </Formik>
        </AppScreen>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    zIndex: 20,
  },
  contentContainer: {
    padding: 16,
  },
  errText: {
    color: colors.primary.main,
    fontSize: 14,
  },
});
