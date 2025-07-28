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
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function BirthDetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { updateUserProfile } = useAuth();
  
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [birthTime, setBirthTime] = useState<Date>(new Date());
  const [birthLocation, setBirthLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine zodiac sign based on birth date
  const getZodiacSign = (date: Date): string => {
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces'; // February 19 - March 20
  };

  const handleNext = async () => {
    if (!birthLocation.trim()) {
      setError(t('onboarding.birthPlace') + ' ' + t('common.error'));
      return;
    }
    
    setLoading(true);
    try {
      const zodiacSign = getZodiacSign(birthDate);
      
      await updateUserProfile({ 
        birthDate: birthDate.toISOString(),
        birthTime: birthTime.toISOString(),
        birthLocation,
        zodiacSign
      });
      
      router.push('/onboarding/preferences');
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
                  progress={0.5} 
                  color={isDarkMode ? '#9b95ff' : '#6055c5'} 
                  style={styles.progressBar}
                />
                <Text style={[
                  styles.stepIndicator,
                  { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                ]}>
                  Step 2/4
                </Text>
                <Text style={[
                  styles.title,
                  { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
                ]}>
                  {t('onboarding.birthDetailsTitle')}
                </Text>
                <Text style={[
                  styles.description,
                  { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                ]}>
                  {t('onboarding.birthDetailsDesc')}
                </Text>
              </View>
              
              <View style={styles.form}>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : null}
                
                <View style={styles.inputContainer}>
                  <Text style={[
                    styles.inputLabel,
                    { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
                  ]}>
                    {t('onboarding.birthDate')}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[
                      styles.dateInput,
                      { borderColor: isDarkMode ? '#3f4159' : '#d1d1d1' }
                    ]}
                  >
                    <Text style={{ 
                      color: isDarkMode ? '#ffffff' : '#1a1a2c',
                      fontSize: 16
                    }}>
                      {formatDate(birthDate)}
                    </Text>
                  </TouchableOpacity>
                  
                  {showDatePicker && (
                    <DateTimePicker
                      value={birthDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setBirthDate(selectedDate);
                        }
                      }}
                      maximumDate={new Date()}
                    />
                  )}
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={[
                    styles.inputLabel,
                    { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
                  ]}>
                    {t('onboarding.birthTime')}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={[
                      styles.dateInput,
                      { borderColor: isDarkMode ? '#3f4159' : '#d1d1d1' }
                    ]}
                  >
                    <Text style={{ 
                      color: isDarkMode ? '#ffffff' : '#1a1a2c',
                      fontSize: 16
                    }}>
                      {formatTime(birthTime)}
                    </Text>
                  </TouchableOpacity>
                  
                  {showTimePicker && (
                    <DateTimePicker
                      value={birthTime}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (selectedTime) {
                          setBirthTime(selectedTime);
                        }
                      }}
                    />
                  )}
                </View>
                
                <TextInput
                  label={t('onboarding.birthPlace')}
                  value={birthLocation}
                  onChangeText={setBirthLocation}
                  style={styles.input}
                  mode="outlined"
                  placeholder="City, Country"
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
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