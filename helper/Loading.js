import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';
import { AppText } from '../src/components/appText';
import { TopHeader } from '../src/components/header/TopHeader';
// import LottieView from 'lottie-react-native';

export const Loading = ({ title, text = 'Laddar...', loading, onDone }) => {
  return (
    <Modal visible={loading}>
      <TopHeader title={text} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={28} />
        {title && <AppText text={text} />}
        {/* <LottieView
          style={{
            width: 400,
            height: 310
          }}
          autoPlay
          loop
          onAnimationFinish={onDone}
          source={require('../assets/animations/loading2.json')}
        /> */}
      </View>
    </Modal>
  );
};
