import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TopHeader } from '../../components/header/TopHeader';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you're using Ionicons
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

// Define validation schema with Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
});

const ForgotPasswordModal = ({ visible, onClose, onReset, language, handleResetPassword }) => {
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = (values, { resetForm }) => {
    // Simulate backend API call and handle success
    console.log("email",values.email)
    handleResetPassword(values.email)
    if (values.email) {
      setResetSuccess(true);
      resetForm();
      onReset();
    } 
  };

  const closeModal = () => {
    onClose();
    setResetSuccess(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <TopHeader
          title={language === 'sv' ? 'Återställ lösenord' : 'إعادة تعيين كلمة المرور'}
          style={{ backgroundColor: "#2a2a72" }}
          icon={true}
          iconName='close'
          iconBackground='#2a2a72'
          onPress={closeModal}
        />

        <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {resetSuccess ? (
            <View style={styles.successContainer}>
              <Icon
                name="checkmark-circle-outline"
                size={100}
                color="#2a2a72"
                style={styles.successIcon}
              />
              <Text style={styles.successText}>
                {language === 'sv'
                  ? `Instruktioner har skickats till din e-postadress. Kontrollera din inkorg och eventuellt även skräppostmappen.`
                  : `تم إرسال التعليمات إلى بريدك الإلكتروني. تحقق من بريدك الوارد وقد تجدها أحيانًا في مجلد البريد العشوائي.`}
              </Text>
              <Text style={styles.additionalInfo}>
                {language === 'sv'
                  ? 'Om e-postadressen du angav är registrerad hos företaget, får du ett e-postmeddelande. Annars får du inget meddelande.'
                  : 'إذا كان البريد الإلكتروني الذي أدخلته مسجلًا لدينا، فستتلقى رسالة إلكترونية. وإلا فلن تصلك أي رسالة.'}
              </Text>
            </View>
          ) : (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit }) => (
                <View style={styles.formContainer}>
                  <Text style={styles.explanationText}>
                    {language === 'sv'
                      ? 'Fyll i e-postadressen som du använde vid registreringen. Vi kommer att skicka instruktioner för att återställa ditt lösenord om e-postadressen är registrerad hos oss.'
                      : 'يرجى إدخال عنوان البريد الإلكتروني الذي استخدمته أثناء التسجيل. سنرسل لك تعليمات لإعادة تعيين كلمة المرور إذا كان البريد الإلكتروني مسجلاً لدينا.'}
                  </Text>
                 
                  <Field
                    name="email"
                    component={CustomTextInput}
                    placeholder={language === 'sv' ? 'Ange din e-post' : 'أدخل بريدك الإلكتروني'}
                  />
                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.modalButtonText}>
                      {language === 'sv' ? 'Skicka ny lösenord' : 'إرسال كلمة مرور جديدة'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={closeModal}
                  >
                    <Text style={styles.modalButtonText}>
                      {language === 'sv' ? 'Avbryt' : 'إلغاء'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// Custom TextInput component to use with Formik
const CustomTextInput = ({ field, form, ...props }) => {
  const hasError = form.touched[field.name] && form.errors[field.name];
  return (
    <View style={styles.inputContainer}>
      <TextInput
      keyboardType='email-address'
        style={[styles.input, hasError && styles.inputError]}
        {...field}
        {...props}
        onChangeText={text => form.setFieldValue(field.name, text)}
        onBlur={() => form.setFieldTouched(field.name)}
      />
      {hasError && <Text style={styles.errorText}>{form.errors[field.name]}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  successContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  successIcon: {
    marginBottom: 20,
  },
  explanationText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  successText: {
    fontSize: 18,
    color: '#2a2a72',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  additionalInfo: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 48,
    fontSize: 16,
    borderColor: '#2a2a72',
    borderWidth: 2,
    borderRadius: 8,
    paddingLeft: 14,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
  modalButton: {
    backgroundColor: '#2a2a72',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default ForgotPasswordModal;
