import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AppScreen } from '../../helper/AppScreen';
import { TopHeader } from '../../components/header/TopHeader';
import ForgotPasswordModal from '../../components/modals/ForgotPasswordModal';
import ContactSupportModal from '../../components/modals/ContactSupportModal'; // Import the new modal
import { api } from '../../api/api'; // Import your API utility

const QuickSupportScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false); // State for contact modal
  const [language, setLanguage] = useState('sv'); // Language state ('sv' for Swedish, 'ar' for Arabic)

  const supportOptions = [  
    {
      id: 'forgotPassword',
      title: language === 'sv' ? 'Glömt lösenord' : 'نسيت كلمة المرور',
      description: language === 'sv' 
        ? 'Om du har glömt ditt lösenord, klicka här för att återställa det.' 
        : 'إذا كنت قد نسيت كلمة المرور الخاصة بك، النقر هنا لاستعادة ذلك.',
      icon: 'key-outline',
      action: () => setModalVisible(true),
    },
    {
      id: 'loginIssue',
      title: language === 'sv' ? 'Problem med inloggning?' : 'مشكلة في تسجيل الدخول؟',
      description: language === 'sv' 
        ? 'Upplever du problem med att logga in? Kontrollera dina uppgifter och försök igen. Om problemet kvarstår, kontakta support.' 
        : 'هل تواجه مشكلة في تسجيل الدخول؟ تحقق من بياناتك وحاول مرة أخرى. إذا استمرت المشكلة، يرجى الاتصال بالدعم.',
      icon: 'person-outline',
      action: () => setContactModalVisible(true),
    },
    {
      id: 'inactiveAccount',
      title: language === 'sv' ? 'Inaktivt konto?' : 'حساب غير نشط؟',
      description: language === 'sv' 
        ? 'Om ditt konto är inaktivt, vänligen kontakta vår support för att aktivera det.' 
        : 'إذا كان حسابك غير نشط، يرجى الاتصال بدعمنا لتفعيله.',
      icon: 'help-circle-outline',
      action: () => setContactModalVisible(true),
    },
    {
      id: 'contactSupport',
      title: language === 'sv' ? 'Prata med support' : 'تحدث إلى الدعم',
      description: language === 'sv' 
        ? 'Vill du prata direkt med vår support? Klicka här för att se vårt telefonnummer.' 
        : 'هل ترغب في التحدث مباشرةً مع الدعم؟ اضغط هنا لعرض رقم هاتفنا.',
      icon: 'headset-outline',
      action: () => setContactModalVisible(true),
    },
  ];

  const handleResetPassword = async (email) => {
    try {
      await api.post('/api/manager/reset-password', { email: email?.toLowerCase() });
    } catch (error) {
      Alert.alert(
        language === 'sv' ? 'Fel' : 'خطأ',
        language === 'sv' ? 'Ett fel inträffade. Försök igen senare.' : 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقًا.'
      );
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'sv' ? 'ar' : 'sv');
  };

  return (
    <AppScreen style={styles.screen}>
      <TopHeader 
        title={language === 'sv' ? 'Snabbsupport' : 'الدعم السريع'} 
        style={{ backgroundColor: "#2a2a72" }} 
        icon={true} 
        iconName='close' 
        iconBackground='#2a2a72' 
        onPress={() => navigation.goBack()} 
      />
      <TouchableOpacity onPress={toggleLanguage} style={styles.languageToggle}>
        <Text style={styles.languageText}>{language === 'sv' ? 'Byt till arabiska' : 'التبديل إلى السويدية'}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}>
          {language === 'sv' 
            ? 'Välj ett av alternativen nedan för att få hjälp med dina problem, oavsett om det är inloggning, återställning av lösenord eller att komma i kontakt med support.' 
            : 'اختر أحد الخيارات أدناه للحصول على المساعدة في مشاكلك، سواء كان ذلك تسجيل الدخول، إعادة تعيين كلمة المرور، أو التواصل مع الدعم.'}
        </Text>

        {supportOptions.map(option => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={option.action}
          >
            <Icon name={option.icon} size={24} color="#fff" style={styles.icon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionText}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <ForgotPasswordModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onReset={handleResetPassword}
          handleResetPassword={(email)=> handleResetPassword(email)}
          language={language}
        />
        
        <ContactSupportModal
          visible={contactModalVisible}
          language={language}
          onClose={() => setContactModalVisible(false)} // Close the contact modal
        />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'ComviqSansWebRegular',
  },
  optionButton: {
    flexDirection: 'row',
    backgroundColor: '#2a2a72',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionContent: {
    marginLeft: 10,
    flex: 1,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionDescription: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'ComviqSansWebRegular',
    lineHeight: 22,
  },
  icon: {
    marginRight: 10,
  },
  languageToggle: {
    alignSelf: 'flex-end',
    padding: 10,
    marginRight: 20,
  },
  languageText: {
    color: '#2a2a72',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'ComviqSansWebRegular',
  },
});

export default QuickSupportScreen;
