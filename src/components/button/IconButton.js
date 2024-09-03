import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';
import { AppText } from '../appText';
export const IconButton = ({
  onPress,
  title = 'settings',
  MIcon,
  size = 60,
  backgroundColor = colors.primary.main,
  color = colors.primary.text,
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
      }}
      onPress={onPress}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {MIcon && <MCIcon name={MIcon} size={size * 0.5} color={color} />}
      </View>
      <AppText
        numberOfLines={1}
        text={title}
        style={{ color: '#222222', fontSize: 17, marginLeft: 10, fontFamily: "ComviqSansWebBold" }}
      />
    </TouchableOpacity>
  );
};
