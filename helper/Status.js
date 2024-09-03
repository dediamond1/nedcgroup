import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AppText } from '../src/components/appText';
import { AppButton } from '../src/components/button/AppButton';
// import LotieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
export const Status = ({
  loading,
  text,
  onPressCancel,
  cancelBtnStyle,
  tryAgainBtnStyle,
  tryAgainTextStyle,
  cantelTextStyle,
  onPressTryAgain,
  tryAgainText = 'Försök igen',
  cantelText = 'Stäng',
  error,
  status,
  progress,
  success,
  onPressOverLay,
}) => {
  return (
    <Pressable style={styles.container} onPress={onPressOverLay}>
      <Animatable.View
        style={[styles.body, { padding: success ? 24 : 10 }]}
        animation={error ? 'shake' : 'zoomIn'}
        easing="linear"
        duration={200}>
        {!success ? (
          <>
            {loading && (
              <View style={styles.iconContainer}>
                <ActivityIndicator color="red" size={30} />
              </View>
            )}
            <View style={styles.textContainer}>
              <AppText style={[styles.text, { color: '#e2027b' }]} text={text} />
            </View>
            {status && (
              <AppText
                style={[styles.StatusText, { color: '#e2027b' }]}
                text={`${progress}%`}
              />
            )}

            {error && (
              <>
                <View
                  style={{
                    width: '100%',
                    height: 2,
                    backgroundColor: '#e2027b',
                    borderRadius: 100,
                  }}
                />
                <View style={styles.btnContainer}>
                  {onPressTryAgain && (
                    <AppButton
                      textStyle={tryAgainTextStyle}
                      style={tryAgainBtnStyle}
                      text={tryAgainText}
                      onPress={onPressTryAgain}
                    />
                  )}
                  {onPressCancel && (
                    <AppButton
                      textStyle={cantelTextStyle}
                      text={cantelText}
                      style={cancelBtnStyle}
                      onPress={onPressCancel}
                    />
                  )}
                </View>
              </>
            )}
          </>
        ) : (
          <View>
            {/* <LotieView
              autoPlay
              loop={false}
              autoSize
              source={require('../assets/animations/check.json')} 89462048009132592966
              style={styles.LotieView}
            /> */}
            <View style={styles.textContainer}>
              <AppText style={[styles.text, { color: '#e2027b' }]} text={text} />
            </View>
            <AppButton
              text={'Stäng'}
              style={[styles.closeBtn]}
              onPress={onPressCancel}
            />
          </View>
        )}
      </Animatable.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 16,
    zIndex: 50,
  },
  LotieView: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  body: {
    backgroundColor: '#fff',
    padding: 14,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 10,
    elevation: 5,
  },
  iconContainer: {
    paddingVertical: 10,
    marginTop: 10,
  },
  textContainer: {
    padding: 10,
    marginVertical: 10,
  },
  text: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  StatusText: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    marginTop: -10,
    padding: 10,
  },
  errContainer: {
    padding: 10,
  },
  btnContainer: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
});