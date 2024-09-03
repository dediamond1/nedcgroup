import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import { AppText } from '../src/components/appText';
import { TopHeader } from '../src/components/header/TopHeader';


export const FailedScreen = ({ title, text = 'OBS...', failed, onDone }) => {
  return (
    <Modal visible={failed}>
      <TopHeader title={text} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator
          size={26}
        // autoPlay
        // loop={false}
        // onAnimationFinish={onDone}
        // source={require('../assets/animations/failed.json')}
        />
      </View>
    </Modal>
  );
};
