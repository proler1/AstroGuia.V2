import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, ProgressBar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function PersonalInfoScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { user, updateUserProfile } = useAuth();
  
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async () => {
    if (!name.trim()) {
      setError(t('auth.name') + ' ' + t('common.error'));
      return;
    }
    
    setLoading(true);
    try {
      await updateUserProfile({ displayName: name });
      router.push('/onboarding/birth-details');
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
            <Animated.View 
              style={styles.content}
              entering={FadeIn.duration(500)}
            >
              <View style={styles.header}>
                <ProgressBar 
                  progress={0.25} 
                  color={isDarkMode ? '#9b95ff' : '#6055c5'} 
                  style={styles.progressBar}
                />
                <Text style={[
                  styles.stepIndicator,
                  { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                ]}>
                  Step 1/4
                </Text>
                <Text style={[
                  styles.title,
                  { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
                ]}>
                  {t('onboarding.personalInfoTitle')}
                </Text>
                <Text style={[
                  styles.description,
                  { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                ]}>
                  {t('onboarding.personalInfoDesc')}
                </Text>
              </View>
              
              <View style={styles.form}>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}
                
                <TextInput
                  label={t('auth.name')}
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  mode="outlined"
                />
                
                <View style={styles.buttonsContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => router.back()}
                    style={[styles.button, styles.backButton]}
                    contentStyle={styles.buttonContent}
                    labelStyle={{ color: isDarkMode ? '#9b95ff' : '#6055c5' }}
                  >
                    {t('common.back')}
                  </Button>
                  
                  <Button
                    mode="contained"
                    onPress={handleNext}
                    loading={loading}
                    disabled={loading}
                    style={[styles.button, styles.nextButton]}
                    contentStyle={styles.buttonContent}
                  >
                    {t('common.next')}
                  </Button>
                </View>
              </View>
            </Animated.View>
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
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
  },
  stepIndicator: {
    fontSize: 14,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    borderRadius: 12,
  },
  backButton: {
    marginRight: 8,
  },
  nextButton: {
    marginLeft: 8,
  },
  buttonContent: {
    height: 56,
  },
  errorText: {
    color: '#ff5252',
    marginBottom: 16,
  },
});