import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/contexts/ThemeContext';
import { useAuth } from '../src/contexts/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword) {
      setError(t('auth.invalidEmail'));
      return false;
    }
    
    if (password !== confirmPassword) {
      setError(t('auth.passwordsDontMatch'));
      return false;
    }
    
    if (password.length < 6) {
      setError(t('auth.weakPassword'));
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await register(email, password);
      // Navigation will be handled by the AuthContext through index.tsx
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError(t('auth.emailAlreadyInUse'));
      } else {
        setError(error.message || t('common.error'));
      }
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
                {t('auth.register')}
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
              
              <TextInput
                label={t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
                style={styles.input}
                right={
                  <TextInput.Icon 
                    icon={secureTextEntry ? 'eye' : 'eye-off'} 
                    onPress={() => setSecureTextEntry(!secureTextEntry)} 
                  />
                }
                mode="outlined"
              />
              
              <TextInput
                label={t('auth.confirmPassword')}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureConfirmTextEntry}
                style={styles.input}
                right={
                  <TextInput.Icon 
                    icon={secureConfirmTextEntry ? 'eye' : 'eye-off'} 
                    onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)} 
                  />
                }
                mode="outlined"
              />
              
              <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
              >
                {t('auth.register')}
              </Button>
              
              <View style={styles.loginContainer}>
                <Text style={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}>
                  {t('auth.alreadyHaveAccount')}
                </Text>
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={[
                      styles.loginLink,
                      { color: isDarkMode ? '#9b95ff' : '#6055c5' }
                    ]}>
                      {t('auth.login')}
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 28,
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
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  registerButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  loginLink: {
    fontWeight: '600',
  },
  errorText: {
    color: '#ff5252',
    marginBottom: 16,
    textAlign: 'center',
  },
});