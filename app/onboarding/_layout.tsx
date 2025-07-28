import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function OnboardingLayout() {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode ? '#0f111a' : '#ffffff',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: t('onboarding.welcome') }} />
      <Stack.Screen name="personal-info" options={{ title: t('onboarding.personalInfoTitle') }} />
      <Stack.Screen name="birth-details" options={{ title: t('onboarding.birthDetailsTitle') }} />
      <Stack.Screen name="preferences" options={{ title: t('onboarding.preferencesTitle') }} />
    </Stack>
  );
}