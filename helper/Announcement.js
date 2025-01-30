import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppText } from '../src/components/appText';

const { width, height } = Dimensions.get('window');

const ANNOUNCEMENT_TYPES = {
  error: {
    backgroundColor: '#f8d7da',
    textColor: '#721c24',
    iconName: 'exclamation-triangle',
  },
  info: {
    backgroundColor: '#339900',
    textColor: '#fff',
    iconName: 'info-circle',
  },
  news: {
    backgroundColor: '#e7f0ff',
    textColor: '#0c5460',
    iconName: 'newspaper-o',
  },
};

const Announcement = ({ type, message, title, onDismiss, isLoading }) => {
  const announcementType = ANNOUNCEMENT_TYPES[type] || ANNOUNCEMENT_TYPES.info;
  const [showModal, setShowModal] = useState(type === 'news');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (keyboardVisible) {
    return null; // Don't render when the keyboard is active
  }

  // Full-screen modal for news type
  if (type === 'news') {
    return (
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: announcementType.textColor }]}>
              {title || 'Nyhet'}
            </Text>
            <ScrollView contentContainerStyle={styles.modalMessageContainer}>
              <Text style={[styles.modalMessage, { color: announcementType.textColor }]}>
                {message}
              </Text>
            </ScrollView>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <AppText text={'Stäng'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Banner style for error and info types
  return (
    <View style={[styles.banner, { backgroundColor: announcementType.backgroundColor }]}>
      {isLoading ? (
        <ActivityIndicator size="small" color={announcementType.textColor} />
      ) : (
        <>
          <View style={styles.iconsContainer}>
            <View style={styles.titleIconContainer}>
              <Icon
                name={announcementType.iconName}
                size={24}
                color={announcementType.textColor}
                style={styles.icon}
              />
              <AppText
                text={title}
                style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'ComviqSansWebBold' }}
              />
            </View>
            {type !== 'info' && onDismiss && (
              <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
                <Icon name="times" size={24} color={announcementType.textColor} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.messageContainer}>
            <Text style={[styles.message, { color: announcementType.textColor }]}>
              {message}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  modalContent: {
    width: width,
    height: height * 0.98,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  modalMessageContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  modalMessage: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
  },
  banner: {
    padding: 16,
    flexDirection: 'column',
    elevation: 4,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'ComviqSansWebBold',
    fontWeight: '600',
  },
  dismissButton: {
    padding: 8,
  },
});

export default Announcement;
