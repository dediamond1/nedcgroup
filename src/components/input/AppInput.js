import React from 'react';
import { StyleSheet, TextInput } from 'react-native';

export const AppInput = ({ style, ...props }) => {
  return <TextInput {...props} style={[styles.container, { ...style }]} />;
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderColor: '#000',
    borderWidth: 1.4,
    borderRadius: 8,
    fontFamily: 'ComviqSansWebRegular',
    marginVertical: 8,
    fontSize: 18,

  },
});
