import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';

export const AppText = ({ text, style, ...rest }) => {
  return <Text {...rest} style={[styles.container, style]}>{text}</Text>;
};

const styles = StyleSheet.create({
  container: {
    color: colors.primary.text,
    fontFamily: 'ComviqSansWebRegular',
    marginVertical: 5,
  },
});
