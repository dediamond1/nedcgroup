import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TopHeader } from '../../components/header/TopHeader';
import { AppScreen } from '../../helper/AppScreen';

const CACHE_KEY = 'techDevTranslationCache';

const translations = {
  sv: {
    title: 'Få upp till 15% provision!',
    subtitle: 'Hjälp oss hitta nya kunder och tjäna pengar på det.',
    text: 'Känner du någon som behöver apputveckling, webbutveckling eller webbdesign? Techdev Cyber erbjuder dessa tjänster och ger dig 13% provision för varje kund du hänvisar. Om du hänvisar tre eller fler kunder samtidigt ökar provisionen till 15%. Kontakta oss om du har potentiella kunder!',
    contact_phone: 'Telefon: +46 793 394 031',
    contact_email: 'E-post: info@techdevcyber.se',
    contact_website: 'Webbplats: https://techdevcyber.se'
  },
  ar: {
    title: 'احصل على ما يصل إلى 15% عمولة!',
    subtitle: 'ساعدنا في العثور على عملاء جدد واكسب المال من ذلك.',
    text: 'هل تعرف أي شخص يحتاج إلى تطوير تطبيقات، تطوير مواقع ويب، أو تصميم مواقع ويب؟ تقدم Techdev Cyber هذه الخدمات وتمنحك 13% عمولة عن كل عميل تحيله. إذا قمت بتحويل ثلاثة عملاء أو أكثر في نفس الوقت، ترتفع العمولة إلى 15%. اتصل بنا إذا كان لديك عملاء محتملين!',
    contact_phone: 'Telefon: +46 793 394 031',
    contact_email: 'البريد الإلكتروني: info@techdevcyber.se',
    contact_website: 'موقع الويب: https://techdevcyber.se'
  }
};

export const TechDevAd = ({ navigation }) => {
  const [language, setLanguage] = useState('sv'); // Default to Swedish
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [translationsData, setTranslationsData] = useState({
    title: '',
    subtitle: '',
    text: '',
    contact_phone: '',
    contact_email: '',
    contact_website: ''
  });

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        await AsyncStorage.removeItem(CACHE_KEY);
        const cachedTranslations = await AsyncStorage.getItem(CACHE_KEY);
        const allTranslations = cachedTranslations ? JSON.parse(cachedTranslations) : {};

        if (allTranslations[language]) {
          setTranslationsData(allTranslations[language]);
        } else {
          const newTranslations = translations[language] || translations['sv'];
          setTranslationsData(newTranslations);
          allTranslations[language] = newTranslations;
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(allTranslations));
        }
      } catch (error) {
        console.error('Error loading translations:', error);
        setHasError(true);
        setTranslationsData(translations['sv']); // Fallback to Swedish
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  return (
    <AppScreen style={styles.screen}>
      <TopHeader 
        iconBackground='#022440' 
        style={styles.topHeader} 
        title="Techdev Cyber" 
        icon 
        onPress={() => navigation.goBack()} 
      />
      <View style={styles.languageTabs}>
        <TouchableOpacity
          style={[styles.languageTab, language === 'sv' && styles.activeTab]}
          onPress={() => handleLanguageChange('sv')}
        >
          <Text style={[styles.languageText, language === 'sv' && styles.activeTabText]}>Svenska</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.languageTab, language === 'ar' && styles.activeTab]}
          onPress={() => handleLanguageChange('ar')}
        >
          <Text style={[styles.languageText, language === 'ar' && styles.activeTabText]}>العربية</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.background}>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#e2027b" />
                <Text style={styles.loadingText}>Laddar översättning...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.title}>{translationsData.title}</Text>
                <Text style={styles.subtitle}>{translationsData.subtitle}</Text>
                <Text style={styles.text}>{translationsData.text}</Text>
                <Text style={styles.contact}>{translationsData.contact_phone}</Text>
                <Text style={styles.contact}>{translationsData.contact_email}</Text>
                <Text style={styles.contact}>{translationsData.contact_website}</Text>
              </>
            )}
            {hasError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Kunde inte ladda översättningar. Återgår till svenska.</Text>
              </View>
            )}
            <View style={styles.footerSpace} />
          </View>
        </View>
        <View style={styles.footerSpace} />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#011527",
  },
  topHeader: {
    backgroundColor: "transparent",
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#034072",
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    color: '#ff674b',
    textAlign: 'center',
    lineHeight: 42,
    fontFamily: "ComviqSansWebBold",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 25,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "ComviqSansWebBold",
    lineHeight: 36,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    color: '#fff',
    textAlign: 'center',
    fontFamily: "ComviqSansWebRegular",
    lineHeight: 32,
  },
  contact: {
    fontSize: 18,
    color: '#ff674b',
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: "ComviqSansWebBold",
  },
  footerSpace: {
    height: 80,
  },
  languageTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  languageTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent', // Default border color
  },
  activeTab: {
    borderBottomColor: '#ff674b', // Active tab underline color
  },
  languageText: {
    fontSize: 16,
    color: '#ccc',
    fontFamily: 'ComviqSansWebBold',
  },
  activeTabText: {
    color: '#ff674b', // Text color for the active tab
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e2027b',
  },
  errorContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffdddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
  },
});

export default TechDevAd;
