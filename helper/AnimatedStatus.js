import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {TopHeader} from '../src/components/header/TopHeader';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AnimatedStatus = ({
  status,
  title,
  message,
  onClose,
  voucherCode,
  ean,
  voucherDescription,
  OrderDate,
}) => {
  const [animationType, setAnimationType] = useState('bounceIn');

  const isSuccess = status !== 'failed';

  // Clean color schemes without gradients
  const colors = {
    success: {
      primary: '#667eea',
      secondary: '#4facfe',
      accent: '#7f97faff',
      text: '#ffffff',
      buttonBg: '#ffffff',
      buttonText: '#667eea',
      overlay: 'rgba(255, 255, 255, 0.15)',
    },
    failed: {
      primary: '#ff416c',
      secondary: '#ff6b9d',
      accent: '#ee7998ff',
      text: '#ffffff',
      buttonBg: '#ffffff',
      buttonText: '#ff416c',
      overlay: 'rgba(255, 255, 255, 0.15)',
    },
  };

  const currentColors = isSuccess ? colors.success : colors.failed;

  useEffect(() => {
    setAnimationType(status === 'failed' ? 'shake' : 'bounceIn');
  }, [status]);

  const StatusIcon = () => (
    <Animatable.View
      animation={isSuccess ? 'pulse' : 'flash'}
      iterationCount="infinite"
      duration={2000}
      style={styles.iconContainer}>
      <View style={[styles.icon, {backgroundColor: currentColors.accent}]}>
        <Text style={styles.iconText}>{isSuccess ? '✓' : '✗'}</Text>
      </View>
    </Animatable.View>
  );

  const renderFloatingElements = () => {
    const statusText = isSuccess ? 'GODKÄND' : 'INTE GODKÄND';
    const elements = [];

    for (let i = 0; i < 5; i++) {
      elements.push(
        <Animatable.View
          key={i}
          animation="fadeInUp"
          duration={2000}
          delay={i * 300}
          style={[
            styles.floatingElement,
            {
              top: 120 + i * 90,
              left: i % 2 === 0 ? 30 : windowWidth - 180,
              opacity: 0.08 - i * 0.01,
            },
          ]}>
          <Text style={[styles.floatingText, {color: currentColors.text}]}>
            {statusText}
          </Text>
        </Animatable.View>,
      );
    }

    return elements;
  };

  const ParticleBackground = () => (
    <View style={styles.particleContainer}>
      {[...Array(12)].map((_, i) => (
        <Animatable.View
          key={i}
          animation="pulse"
          duration={2000 + i * 150}
          iterationCount="infinite"
          style={[
            styles.particle,
            {
              left: Math.random() * windowWidth,
              top: Math.random() * windowHeight,
              backgroundColor: currentColors.accent,
              opacity: 0.1,
              width: 3 + Math.random() * 4,
              height: 3 + Math.random() * 4,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <>
      <Animatable.View
        animation="fadeIn"
        delay={900}
        style={styles.closeButtonContainer}>
        <TouchableOpacity
          style={[styles.closeButton, {backgroundColor: currentColors.accent}]}
          onPress={onClose}
          activeOpacity={0.8}>
          <Text style={styles.closeButtonText}>Stäng</Text>
          <View style={styles.closeIconContainer}>
            <View style={[styles.closeLine1, {backgroundColor: '#ffffff'}]} />
            <View style={[styles.closeLine2, {backgroundColor: '#ffffff'}]} />
          </View>
        </TouchableOpacity>
      </Animatable.View>
      <View
        style={[
          styles.backgroundSolid,
          {backgroundColor: currentColors.primary},
        ]}
      />

      <ParticleBackground />

      <TopHeader title={message} style={{backgroundColor: 'transparent'}} />

      <Animatable.View
        animation={animationType}
        duration={800}
        style={styles.container}>
        <View style={[styles.card, {backgroundColor: currentColors.primary}]}>
          {/* Clean overlay */}
          <View
            style={[
              styles.cleanOverlay,
              {backgroundColor: currentColors.overlay},
            ]}
          />

          <StatusIcon />

          <Animatable.Text
            animation="fadeInDown"
            delay={300}
            style={styles.title}>
            {title}
          </Animatable.Text>

          <Animatable.View
            animation="fadeInUp"
            delay={500}
            style={styles.voucherContainer}>
            <View style={styles.voucherHeader}>
              <View style={styles.decorativeLine} />
              <Text style={styles.storeName}>
                {voucherDescription || 'Voucher'}
              </Text>
              <View style={styles.decorativeLine} />
            </View>

            <View style={styles.voucherContent}>
              <View style={styles.voucherRow}>
                <Text style={styles.voucherLabel}>Voucher nr:</Text>
                <Text style={styles.voucherCode}>{voucherCode || '---'}</Text>
              </View>
            </View>
          </Animatable.View>

          <Animatable.View
            animation="bounceIn"
            delay={700}
            style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: currentColors.buttonBg}]}
              onPress={onClose}
              activeOpacity={0.8}>
              <Text
                style={[styles.buttonText, {color: currentColors.buttonText}]}>
                ✓ OK
              </Text>
            </TouchableOpacity>
          </Animatable.View>

          {/* Enhanced Close Button */}
          <Animatable.View
            animation="fadeIn"
            delay={900}
            style={styles.closeButtonContainer}>
            <TouchableOpacity
              style={[
                styles.closeButton,
                {backgroundColor: currentColors.accent},
              ]}
              onPress={onClose}
              activeOpacity={0.8}>
              <Text style={styles.closeButtonText}>Stäng</Text>
              <View style={styles.closeIconContainer}>
                <View
                  style={[styles.closeLine1, {backgroundColor: '#ffffff'}]}
                />
                <View
                  style={[styles.closeLine2, {backgroundColor: '#ffffff'}]}
                />
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Animatable.View>

      {renderFloatingElements()}
    </>
  );
};

const styles = StyleSheet.create({
  backgroundSolid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -(windowWidth - 40) / 2}, {translateY: -200}],
    width: windowWidth - 40,
    zIndex: 10,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
  },
  cleanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  iconContainer: {
    marginBottom: 20,
    zIndex: 2,
  },
  icon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 42,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'ComviqSansWebRegular',
    zIndex: 2,
  },
  voucherContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 18,
    padding: 24,
    marginBottom: 28,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 2,
  },
  voucherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  decorativeLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 15,
  },
  storeName: {
    fontSize: 20,
    fontFamily: 'ComviqSansWebRegular',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  voucherContent: {
    gap: 16,
  },
  voucherRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  voucherLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'ComviqSansWebRegular',
  },
  voucherCode: {
    fontSize: 17,
    color: '#ffffff',
    fontFamily: 'ComviqSansWebRegular',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  voucherDate: {
    fontSize: 15,
    color: '#ffffff',
    fontFamily: 'ComviqSansWebRegular',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    zIndex: 2,
  },
  button: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: 'ComviqSansWebRegular',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  floatingText: {
    fontSize: 28,
    fontFamily: 'ComviqSansWebRegular',
    fontWeight: 'bold',
    transform: [{rotate: '-12deg'}],
  },
  closeButtonContainer: {
    top: 25,
    padding: 10,
    zIndex: 10,
  },
  closeButton: {
    width: '100%',
    height: 46,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'ComviqSansWebRegular',
  },
  closeIconContainer: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeLine1: {
    position: 'absolute',
    width: 12,
    height: 1.5,
    borderRadius: 1,
    transform: [{rotate: '45deg'}],
  },
  closeLine2: {
    position: 'absolute',
    width: 12,
    height: 1.5,
    borderRadius: 1,
    transform: [{rotate: '-45deg'}],
  },
});
