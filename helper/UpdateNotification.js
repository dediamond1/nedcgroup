import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText } from '../src/components/appText';

const CACHE_KEY = 'translationCache';

const translations = {
  sv: {
    title: 'Ny version är tillgänglig!',
    message: 'En ny version av appen är tillgänglig. För att installera den senaste versionen, vänligen avinstallera den nuvarande appen och ladda ner den senaste versionen genom att klicka på "Ladda ner nu".',
    buttonTexts: {
      download: 'Ladda ner nu',
      openSettings: 'Öppna Inställningar för att Avinstallera',
      remindLater: 'Påminn mig om 2 timmar',
    }
  },
  ar: {
    title: 'تحديث جديد متاح!',
    message: 'نسخة جديدة من التطبيق متاحة. لتثبيت النسخة الأحدث، يرجى إلغاء تثبيت التطبيق الحالي وتنزيل النسخة الأحدث عن طريق النقر على "تنزيل الآن".',
    buttonTexts: {
      download: 'تنزيل الآن',
      openSettings: 'افتح الإعدادات لإلغاء التثبيت',
      remindLater: 'ذكرني بعد ساعتين',
    }
  }
};

const UpdateNotification = ({ visible, onClose, updateUrl }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('sv'); // Default language
  const [loading, setLoading] = useState(false);
  const [showTabs, setShowTabs] = useState(true); // State to control the visibility of the tabs
  const [error, setError] = useState(null); // State to track if an error has occurred
  const [translatedTitle, setTranslatedTitle] = useState(translations.sv.title);
  const [buttonTexts, setButtonTexts] = useState(translations.sv.buttonTexts);
  const [translatedMessage, setTranslatedMessage] = useState(translations.sv.message);

  useEffect(() => {
    if (error) {
      Alert.alert('Fel', 'Kunde inte översätta texten. Återgår till svenska.', [
        {
          text: 'OK',
          onPress: () => setError(null), // Reset error state after alert is acknowledged
        },
      ]);
    }
  }, [error]);

  const handleDownload = () => {
    if (updateUrl) {
      Linking.openURL(updateUrl).catch((err) => {
        console.error('Error opening URL:', err);
        Alert.alert('Fel', 'Kunde inte öppna nedladdningslänken');
      });
    }
  };

  const handleOpenSettings = () => {
    // Open app settings to allow the user to uninstall the app
    Linking.openSettings().catch(() => {
      Alert.alert('Fel', 'Kunde inte öppna inställningar.');
    });
  };

  const cacheTranslations = async (language, title, message, buttonTexts) => {
    try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      const cachedTranslations = cache ? JSON.parse(cache) : {};
      cachedTranslations[language] = { title, message, buttonTexts };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cachedTranslations));
    } catch (error) {
      console.error('Failed to cache translations:', error);
    }
  };

  const fetchCachedTranslations = async (language) => {
    try {
      const cache = await AsyncStorage.getItem(CACHE_KEY);
      const cachedTranslations = cache ? JSON.parse(cache) : {};
      return cachedTranslations[language];
    } catch (error) {
      console.error('Failed to fetch cached translations:', error);
      return null;
    }
  };

  const handleTranslate = async (language) => {
    setSelectedLanguage(language);
    setLoading(true); // Start loading state
    setShowTabs(true); // Initially show tabs
    try {
      const cachedTranslations = await fetchCachedTranslations(language);
      if (cachedTranslations) {
        setTranslatedMessage(cachedTranslations.message);
        setTranslatedTitle(cachedTranslations.title);
        setButtonTexts(cachedTranslations.buttonTexts);
      } else {
        const { title, message, buttonTexts } = translations[language] || translations.sv;

        setTranslatedMessage(message);
        setTranslatedTitle(title);
        setButtonTexts(buttonTexts);

        // Cache the translations only if there is no error
        await cacheTranslations(language, title, message, buttonTexts);
      }
    } catch (error) {
      setError(true); // Set error state to trigger the alert
      setSelectedLanguage('sv');
      setShowTabs(false); // Hide tabs on error

      // Directly set Swedish as the fallback
      setTranslatedMessage(translations.sv.message);
      setTranslatedTitle(translations.sv.title);
      setButtonTexts(translations.sv.buttonTexts);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <Modal
      transparent={false} // Full screen modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <View style={styles.overlay}>
        {showTabs && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedLanguage === 'sv' && styles.activeTab]}
              onPress={() => handleTranslate('sv')}
            >
              <Text style={styles.tabText}>Svenska</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedLanguage === 'ar' && styles.activeTab]}
              onPress={() => handleTranslate('ar')}
            >
              <Text style={styles.tabText}>العربية</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#e2027b" />
          ) : (
            <>
              <View>
                <Text style={styles.title}>{translatedTitle}</Text>
                <Text style={styles.message}>{translatedMessage}</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.button} onPress={handleDownload}>
                  <AppText style={styles.buttonText} text={buttonTexts?.download} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleOpenSettings}>
                  <AppText style={styles.buttonText} text={buttonTexts?.openSettings} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#ccc' }]}
                  onPress={onClose}
                >
                  <AppText
                    style={[
                      styles.buttonText,
                      { color: '#000', textTransform: 'uppercase' },
                    ]}
                    text={buttonTexts?.remindLater}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
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
    backgroundColor: '#fff', // Full screen white background
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#ccc',
  },
  activeTab: {
    borderBottomWidth: 4,
    borderColor: '#e2027b',
  },
  tabText: {
    fontSize: 16,
    color: '#e2027b',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400, // Optional max-width for better presentation on large screens
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#e2027b',
    lineHeight: 30, // Added line height for title
    fontFamily: 'ComviqSansWebRegular.ttf',
  },
  message: {
    fontSize: 17,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 28, // Added line height for message
    color: '#000',
  },
  button: {
    width: '100%',
    padding: 8,
    backgroundColor: '#e2027b',
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateNotification;
