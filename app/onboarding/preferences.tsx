import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ProgressBar, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import Animated, { FadeIn } from 'react-native-reanimated';

interface InterestCategory {
  id: string;
  items: string[];
}

export default function PreferencesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { updateUserProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Define interest categories
  const interestCategories: InterestCategory[] = [
    {
      id: 'astrology_types',
      items: ['Western Astrology', 'Vedic Astrology', 'Chinese Astrology', 'Mayan Astrology']
    },
    {
      id: 'celestial',
      items: ['Planets', 'Moon Phases', 'Eclipses', 'Meteor Showers', 'Constellations']
    },
    {
      id: 'practices',
      items: ['Meditation', 'Tarot', 'Crystals', 'Numerology', 'Chakras', 'Manifestation']
    },
    {
      id: 'life_areas',
      items: ['Career', 'Relationships', 'Health', 'Personal Growth', 'Finances']
    }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(item => item !== interest)
        : [...prev, interest]
    );
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateUserProfile({ interests: selectedInterests });
      // Navigate to the main app
      router.replace('/(tabs)');
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
                progress={0.75} 
                color={isDarkMode ? '#9b95ff' : '#6055c5'} 
                style={styles.progressBar}
              />
              <Text style={[
                styles.stepIndicator,
                { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
              ]}>
                Step 3/4
              </Text>
              <Text style={[
                styles.title,
                { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
              ]}>
                {t('onboarding.preferencesTitle')}
              </Text>
              <Text style={[
                styles.description,
                { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
              ]}>
                {t('onboarding.preferencesDesc')}
              </Text>
            </View>
            
            <View style={styles.form}>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
              
              {interestCategories.map((category) => (
                <View key={category.id} style={styles.categoryContainer}>
                  <View style={styles.interestsContainer}>
                    {category.items.map((interest) => (
                      <Chip
                        key={interest}
                        selected={selectedInterests.includes(interest)}
                        onPress={() => toggleInterest(interest)}
                        style={[
                          styles.chip,
                          selectedInterests.includes(interest) && {
                            backgroundColor: isDarkMode ? '#6055c5' : '#9b95ff'
                          }
                        ]}
                        textStyle={{
                          color: selectedInterests.includes(interest) 
                            ? '#ffffff' 
                            : isDarkMode ? '#e0e0e0' : '#1a1a2c'
                        }}
                      >
                        {interest}
                      </Chip>
                    ))}
                  </View>
                </View>
              ))}
              
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
                  onPress={handleFinish}
                  loading={loading}
                  disabled={loading}
                  style={[styles.button, styles.nextButton]}
                  contentStyle={styles.buttonContent}
                >
                  {t('common.finish')}
                </Button>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    margin: 4,
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