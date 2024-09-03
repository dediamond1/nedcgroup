import React from 'react';
import { View } from 'react-native';
import { AppText } from '../src/components/appText';
import { TopHeader } from '../src/components/header/TopHeader';

export const ClosedShop = () => {
  return (
    <>
      <TopHeader title={'Kassa stängt'} />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 10,
        }}>
        <View>
          <AppText
            text={'Du kan tyvärr INTE Sälja efter kl: 21:00'}
            style={{ color: 'red', fontSize: 16 }}
          />
        </View>
        <AppText text={'Kassa stängt!'} style={{ color: 'red', fontSize: 16 }} />
      </View>
    </>
  );
};
