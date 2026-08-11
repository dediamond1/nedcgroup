import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { TopHeader } from '../../components/header/TopHeader';
import { AppInput } from '../../components/input/AppInput';
import { AppButton } from '../../components/button/AppButton';
import { AppScreen } from '../../helper/AppScreen';

import { colors } from '../../constants/colors';
import { AppText } from '../../components/appText';
import { useNavigation } from '@react-navigation/native';

import { Status } from '../../../helper/Status';
import useAuthenticate from '../../hooks/useAuthenticate';
import { NormalLoader } from '../../../helper/Loader2';
import { useDispatch } from 'react-redux';
import { requestLoginCode, verifyLoginCode } from '../../redux/features/auth/authActions';

const RESEND_COOLDOWN = 60; // seconds (matches the backend cooldown)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * LoginScreen — passwordless-first.
 *
 * Default mode: email login. Enter the e-post → a single-use 6-digit code is
 * emailed → enter the code → logged in (the code replaces the password).
 * Password login stays available via the toggle ("Använd lösenord istället").
 */
export const LoginScreen = () => {
  const { loading: load, error, authenticate, setError, setLoading } = useAuthenticate();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [mode, setMode] = useState('code'); // 'code' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startResendCountdown = () => {
    setResendIn(RESEND_COOLDOWN);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const isEmailValid = EMAIL_RE.test(email);

  const sendCode = async () => {
    if (!isEmailValid) {
      setCodeError('Ange rätt e-post');
      return;
    }
    setCodeError('');
    setSendingCode(true);
    const resultAction = await dispatch(requestLoginCode({ email: email.trim() }));
    setSendingCode(false);
    if (resultAction.type.endsWith('/rejected')) {
      Alert.alert('Fel', String(resultAction.payload || 'Kunde inte skicka koden.'));
      return;
    }
    setCodeSent(true);
    startResendCountdown();
    Alert.alert('Kod skickad', `En inloggningskod har skickats till ${email.trim()}.`);
  };

  const submitCode = async () => {
    if (!code || code.length !== 6) {
      setCodeError('Ange koden (6 siffror)');
      return;
    }
    setCodeError('');
    setLoading(true);
    const resultAction = await dispatch(verifyLoginCode({ email: email.trim(), code }));
    setLoading(false);
    if (resultAction.type.endsWith('/rejected')) {
      setCodeError(String(resultAction.payload || 'Felaktig kod. Försök igen.'));
    }
    // On success the thunk persisted the token + updated the store — App.js
    // automatically switches from AuthNavigation to AppSideNavigation.
  };

  const changeEmail = () => {
    setCodeSent(false);
    setCode('');
    setCodeError('');
  };

  const submitPassword = () => {
    Keyboard.dismiss();
    authenticate(email, password);
  };

  const toggleMode = () => {
    setMode((m) => (m === 'code' ? 'password' : 'code'));
    setCodeError('');
  };

  return (
    <>
      {!load && error && (
        <Status
          loading={load}
          error={error}
          subTitle={load ? 'loggar in...' : 'Fel e-post eller lösenord...'}
          text={'Fel e-post eller lösenord...'}
          cantelText={'Försök igen'}
          cantelTextStyle={{ width: '100%' }}
          onPressOverLay={Keyboard.dismiss}
          onPressCancel={() => setError(false)}
        />
      )}
      {load ? (
        <NormalLoader
          loading={load}
          onPressOverLay={Keyboard.dismiss}
          subTitle={load ? 'loggar in...' : 'Fel e-post eller lösenord...'}
          cantelText={'Försök igen'}
          cantelTextStyle={{ width: '100%' }}
          onPressCancel={() => setError(false)}
        />
      ) : null}

      <TouchableWithoutFeedback style={styles.screen} onPress={Keyboard.dismiss}>
        <AppScreen style={styles.screen}>
          <TopHeader title={'LOGGA IN'} />
          <KeyboardAvoidingView
            style={styles.contentContainer}
            keyboardVerticalOffset={90}
            behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
          >
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
              value={email}
              autoCapitalize="none"
              onChangeText={setEmail}
              onSubmitEditing={() => {
                if (mode === 'code') sendCode();
              }}
              style={{
                padding: 12,
                borderWidth: 2,
                borderRadius: 10,
                fontSize: 17,
                color: '#000',
                borderColor: codeError && !isEmailValid ? '#e2027b' : '#000',
              }}
            />
            {codeError && !isEmailValid && mode === 'code' && (
              <AppText style={styles.errText} text={codeError} />
            )}

            {mode === 'code' ? (
              <>
                {!codeSent ? (
                  <AppButton
                    style={{
                      padding: 16,
                      backgroundColor: sendingCode ? 'grey' : '#2bb2e0',
                    }}
                    textStyle={{ fontFamily: 'ComviqSansWebRegular', fontSize: 18 }}
                    loading={sendingCode}
                    text={'Skicka kod'}
                    onPress={sendCode}
                    disabled={sendingCode}
                  />
                ) : (
                  <>
                    <AppText
                      text={'Inloggningskod'}
                      style={{ color: '#000', fontSize: 17, fontFamily: 'ComviqSansWebBold', marginTop: 12 }}
                    />
                    <AppInput
                      placeholder="6-siffrig kod"
                      keyboardType="number-pad"
                      maxLength={6}
                      value={code}
                      onChangeText={setCode}
                      onSubmitEditing={submitCode}
                      style={{
                        padding: 12,
                        borderWidth: 2,
                        borderRadius: 10,
                        fontSize: 18,
                        color: '#000',
                        letterSpacing: 6,
                        borderColor: codeError ? '#e2027b' : '#000',
                      }}
                    />
                    {codeError && <AppText style={styles.errText} text={codeError} />}
                    <AppButton
                      style={{
                        padding: 16,
                        backgroundColor: code.length !== 6 ? 'grey' : '#2bb2e0',
                      }}
                      textStyle={{ fontFamily: 'ComviqSansWebRegular', fontSize: 18 }}
                      loading={load}
                      text={'Logga in'}
                      onPress={submitCode}
                      disabled={code.length !== 6 || load}
                    />
                    <View style={styles.rowBetween}>
                      <Pressable onPress={changeEmail}>
                        <AppText
                          text={'Ändra e-post'}
                          style={styles.linkText}
                        />
                      </Pressable>
                      <Pressable onPress={resendIn > 0 ? undefined : sendCode} disabled={resendIn > 0}>
                        <AppText
                          text={resendIn > 0 ? `Skicka igen (${resendIn}s)` : 'Skicka igen'}
                          style={resendIn > 0 ? { ...styles.linkText, color: '#a8a29e' } : styles.linkText}
                        />
                      </Pressable>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
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
                  value={password}
                  onChangeText={setPassword}
                  onSubmitEditing={submitPassword}
                  style={{
                    padding: 12,
                    borderWidth: 2,
                    borderRadius: 10,
                    fontSize: 17.5,
                    borderColor: '#000',
                  }}
                />
                <AppButton
                  style={{
                    padding: 16,
                    backgroundColor: !email || !password || load ? 'grey' : '#2bb2e0',
                  }}
                  textStyle={{ fontFamily: 'ComviqSansWebRegular', fontSize: 18 }}
                  loading={load}
                  text={'Logga in'}
                  onPress={submitPassword}
                  disabled={!email || !password || load}
                />
              </>
            )}

            <Pressable onPress={toggleMode} style={{ marginTop: 12 }}>
              <AppText
                text={mode === 'code' ? 'Använd lösenord istället' : 'Logga in med kod istället'}
                style={{
                  color: '#e2027b',
                  textAlign: 'center',
                  fontSize: 16,
                  padding: 10,
                  textDecorationLine: 'underline',
                  fontFamily: 'ComviqSansWebBold',
                }}
              />
            </Pressable>

            <View>
              <AppText
                text={'Har du problem med att komma igång ?'}
                style={{
                  color: '#222222',
                  textAlign: 'center',
                  marginVertical: 10,
                  fontFamily: 'ComviqSansWebRegular',
                  fontSize: 16,
                }}
              />
              <Pressable onPress={() => navigation.navigate('QUICK_SUPPORT')}>
                <AppText
                  text={'Få Snabbsupport'}
                  style={{
                    color: '#e2027b',
                    textAlign: 'center',
                    fontSize: 18,
                    textTransform: 'uppercase',
                    padding: 16,
                    textDecorationLine: 'underline',
                    fontFamily: 'ComviqSansWebBold',
                  }}
                />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  linkText: {
    color: '#e2027b',
    fontSize: 15,
    padding: 8,
    textDecorationLine: 'underline',
    fontFamily: 'ComviqSansWebBold',
  },
});
