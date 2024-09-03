import React from 'react';
import {ActivityIndicator, View, Image} from 'react-native';
import {StyleSheet, Text} from 'react-native';
//import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export const AppButton = ({
  text,
  onPress,
  image,
  style,
  loading,
  textStyle,
  icon,
  iconColor = '#fff',
  color = '#fff',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.continer, {...style}]}
      activeOpacity={0.6}>
      {loading ? (
        <ActivityIndicator animating={true} color={color} />
      ) : (
        <View style={styles.subContainer}>
          {image && (
            <View style={{height: 30, width: 30}}>
              <Image
                resizeMode="contain"
                style={{width: '100%', height: '100%'}}
                source={image}
              />
            </View>
          )}
          {!image && icon && (
            <MaterialIcon name={icon} size={24} color={iconColor} />
          )}
          <Text style={[styles.text, textStyle]}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  continer: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#e2027b',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'ComviqSansWeb-Regular.eot',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginLeft: 10,
  },
});
