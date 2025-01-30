import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ContactSupportModal = ({ visible, onClose, language }) => {
  const translations = {
    sv: {
      title: 'Kontakta support',
      description: 'Om du behöver hjälp, vänligen ring vårt supportteam på numret nedan:',
      phoneNumber: '+46 79 339 40 31', // Formatted phone number
      closeButton: 'Stäng'
    },
    ar: {
      title: 'اتصل بالدعم',
      description: 'إذا كنت بحاجة إلى المساعدة، يرجى الاتصال بفريق الدعم لدينا على الرقم أدناه:',
      phoneNumber: '+46 79 339 40 31', // Formatted phone number
      closeButton: 'إغلاق'
    }
  };

  const t = translations[language] || translations['sv']; // Default to Swedish

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.description}>{t.description}</Text>
          <Text style={styles.phoneNumber}>{t.phoneNumber}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>{t.closeButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2a2a72',
    marginBottom: 20,
    textAlign: 'center', // Center align the phone number
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2a2a72',
    borderRadius: 5,
    width: "100%", 
    alignItems: 'center'
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactSupportModal;
