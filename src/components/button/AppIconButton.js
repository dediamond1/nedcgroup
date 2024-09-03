import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../constants/colors';

export const AppIconButton = ({
    onPress,
    icon,
    size = 60,
    color = '#fff',
    bgColor = colors.primary.main,
    style,
}) => {
    return (
            <TouchableOpacity
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: bgColor,
                    zIndex: 10,
                }}
                activeOpacity={0.6}
                onPress={onPress}>
                <MaterialIcon name={icon} color={color} size={size * 0.5} />
            </TouchableOpacity>
    );
};
