import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const auth = getAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError(t('auth.invalidEmail'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDarkMode 
          ? ['#191c2d', '#0f111a'] 
          : ['#e0e8ff', '#ffffff']}
        style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Text style={{ 
                color: isDarkMode ? '#9b95ff' : '#6055c5',
                fontSize: 16
              }}>
                {t('common.back')}
              </Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Image
                source={require('/images/logo.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={[
                styles.appTitle, 
                { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
              ]}>
                AstroGuía
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={[
                styles.formTitle,
                { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
              ]}>
                {t('auth.forgotPassword')}
              </Text>
              
              {success ? (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>
                    {t('auth.passwordResetSent')}
                  </Text>
                  
                  <Button
                    mode="contained"
                    onPress={() => router.replace('/login')}
                    style={styles.submitButton}
                  >
                    {t('auth.login')}
                  </Button>
                </View>
              ) : (
                <>
                  <Text style={[
                    styles.description,
                    { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                  ]}>
                    {t('auth.forgotPasswordDesc')}
                  </Text>
                  
                  {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null}

                  <TextInput
                    label={t('auth.email')}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                    mode="outlined"
                  />
                  
                  <Button
                    mode="contained"
                    onPress={handleResetPassword}
                    loading={loading}
                    disabled={loading}
                    style={styles.submitButton}
                  >
                    {t('common.continue')}
                  </Button>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: '#ff5252',
    marginBottom: 16,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    color: '#4caf50',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
});