import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const getTabBarIconColor = (focused: boolean) => {
    if (focused) {
      return isDarkMode ? '#9b95ff' : '#6055c5';
    }
    return isDarkMode ? '#717191' : '#a0a0a0';
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDarkMode ? '#9b95ff' : '#6055c5',
        tabBarInactiveTintColor: isDarkMode ? '#717191' : '#a0a0a0',
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#191c2d' : '#ffffff',
          borderTopColor: isDarkMode ? '#2a2d42' : '#e5e5e5',
        },
        headerStyle: {
          backgroundColor: isDarkMode ? '#191c2d' : '#ffffff',
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#1a1a2c',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons 
              name="home" 
              size={size} 
              color={getTabBarIconColor(focused)} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chart"
        options={{
          title: t('tabs.chart'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons 
              name="chart-bubble" 
              size={size} 
              color={getTabBarIconColor(focused)} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="learn"
        options={{
          title: t('tabs.learn'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons 
              name="book-open-variant" 
              size={size} 
              color={getTabBarIconColor(focused)} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          title: t('tabs.community'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons 
              name="forum" 
              size={size} 
              color={getTabBarIconColor(focused)} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons 
              name="account" 
              size={size} 
              color={getTabBarIconColor(focused)} 
            />
          ),
        }}
      />
    </Tabs>
  );
}