import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText } from '../appText';

export const TopHeader = ({
  title,
  icon,
  onPress,
  iconName = "arrow-left",
  textStyle,
  subTitle,
  iconBackground = "#3b3687",
  loading,
  style
}) => {

  return (
    <View style={[styles.container, { ...style }]}>
      {icon && (
        <Pressable onPress={onPress} style={[styles.backBtn, { backgroundColor: iconBackground }]}>
          <MaterialCommunityIcons color={'#fff'} name={iconName} size={30} />
        </Pressable>
      )}
      {loading && <ActivityIndicator size={24} />}
      <View>
        {!loading && (
          <Text style={[styles.title, { ...textStyle }]}>{title}</Text>
        )}

        {subTitle && (
          <AppText style={[styles.subTitle, { ...textStyle }]} text={subTitle} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    position: 'relative',
    backgroundColor: "#3b3687",
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    top: '40%',
    width: 45,
    height: 45,
    borderRadius: 60 / 2,
    backgroundColor: '#2bb2e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    alignSelf: 'center',
    fontFamily: 'ComviqSansWebBold',
    fontSize: 22,
    color: '#F9F9F9',
  },

  subTitle: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'ComviqSansWebBold',
    color: '#e2027b',
    marginTop: 10,
  },
});
