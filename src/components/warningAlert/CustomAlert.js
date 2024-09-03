import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { colors } from '../../constants/colors';
import { AppText } from '../appText';
import { AppButton } from '../button/AppButton';

export const CustomAlert = ({
  showButtons,
  title,
  onPressAccept,
  onPressCancel,
}) => {
  return (
    <TouchableWithoutFeedback style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <AppText style={styles.text} text={title} />
          {showButtons && (
            <View style={styles.btnContainer}>
              <AppButton textStyle={{ fontFamily: "ComviqSansWebBold", fontSize: 19 }} text={'Ja, Makulera'} onPress={onPressAccept} style={{ backgroundColor: "#2bb2e0", padding: 16 }} />
              <AppButton textStyle={{ fontFamily: "ComviqSansWebBold", fontSize: 19 }} style={{ padding: 16 }} text={'Avbryt'} onPress={onPressCancel} />
            </View>
          )}
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, .7)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
    width: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    // marginHorizontal: 5,
    paddingHorizontal: 40,
    paddingVertical: 21.5,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  text: {
    fontSize: 22,
    textAlign: "center",
    color: "#2bb2e0",
    lineHeight: 34,
    fontFamily: "ComviqSansWebBold",
  },
  btnContainer: {
    marginTop: 25,
    justifyContent: 'space-around',
  },
});
