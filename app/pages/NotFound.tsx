import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/contexts/ThemeContext';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDarkMode } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }
    ]}>
      <MaterialCommunityIcons 
        name="map-marker-question" 
        size={100} 
        color={isDarkMode ? '#9b95ff' : '#6055c5'} 
      />
      
      <Text style={[
        styles.title,
        { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
      ]}>
        {t('common.pageNotFound')}
      </Text>
      
      <Text style={[
        styles.message,
        { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
      ]}>
        {t('common.pageNotFoundMessage')}
      </Text>
      
      <Button
        mode="contained"
        onPress={() => router.replace('/')}
        style={styles.button}
      >
        {t('common.backToHome')}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 16,
  },
});