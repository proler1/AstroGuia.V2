import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../src/contexts/ThemeContext';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function OnboardingWelcome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <LinearGradient
        colors={isDarkMode 
          ? ['#191c2d', '#0f111a'] 
          : ['#e0e8ff', '#ffffff']}
        style={styles.container}
      >
        <Animated.View 
          style={styles.content}
          entering={FadeIn.duration(800)}
        >
          <View style={styles.header}>
            <Image
              source={require('/images/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Animated.Text 
              style={[
                styles.appTitle, 
                { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
              ]}
              entering={FadeInDown.delay(300).duration(800)}
            >
              {t('onboarding.welcome')}
            </Animated.Text>
          </View>

          <Animated.View 
            style={styles.starsIllustration}
            entering={FadeIn.delay(600).duration(1000)}
          >
            <Image
              source={require('/images/stars.jpg')}
              style={styles.starsImage}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View 
            style={styles.footer}
            entering={FadeInDown.delay(900).duration(800)}
          >
            <Text style={[
              styles.description,
              { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
            ]}>
              Discover the cosmos within you through personalized astrological insights
            </Text>
            
            <Button
              mode="contained"
              onPress={() => router.push('/onboarding/personal-info')}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              {t('common.continue')}
            </Button>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  starsIllustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  starsImage: {
    width: '100%',
    height: 300,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
});