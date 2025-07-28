import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import { Text, Avatar, Button, Switch, Divider, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, updateUserProfile } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  
  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert(t('common.error'), t('profile.logoutError'));
    }
  };
  
  const handleUploadProfileImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('profile.permissionDenied'));
        return;
      }
      
      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets[0].uri) {
        setLoading(true);
        
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop() || '/images/profile.jpg';
        
        // Convert image to blob
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Upload to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `profile_images/${user?.uid}/${fileName}`);
        
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update user profile
        await updateUserProfile({ photoURL: downloadURL });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(t('common.error'), t('profile.uploadError'));
      setLoading(false);
    }
  };
  
  const getZodiacSignIcon = (sign: string): string => {
    // Default to aries if no sign is available
    const lowerCaseSign = sign?.toLowerCase() || 'aries';
    return `zodiac-${lowerCaseSign}`;
  };
  
  // TODO: Fetch from user profile in real app
  const userZodiacSign = 'libra';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
      <ScrollView>
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(500)}
        >
          <View style={styles.profileImageContainer}>
            <Avatar.Image
              size={100}
              source={
                user?.photoURL 
                  ? { uri: user.photoURL } 
                  : require('/images/defaultavatar.jpg')
              }
              style={styles.profileImage}
            />
            
            <TouchableOpacity 
              style={[
                styles.editImageButton,
                { backgroundColor: isDarkMode ? '#6055c5' : '#9b95ff' }
              ]}
              onPress={handleUploadProfileImage}
              disabled={loading}
            >
              <MaterialCommunityIcons name="pencil" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
            {user?.displayName || t('profile.anonymous')}
          </Text>
          
          <View style={styles.zodiacContainer}>
            <MaterialCommunityIcons 
              name={getZodiacSignIcon(userZodiacSign)}
              size={24} 
              color={isDarkMode ? '#9b95ff' : '#6055c5'} 
            />
            <Text style={[styles.zodiacText, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
              {userZodiacSign.charAt(0).toUpperCase() + userZodiacSign.slice(1)}
            </Text>
          </View>
          
          <Text style={[styles.email, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
            {user?.email}
          </Text>
        </Animated.View>
        
        <Animated.View 
          style={[styles.section, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}
          entering={FadeIn.delay(200).duration(500)}
        >
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
              {t('profile.darkMode')}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              color={isDarkMode ? '#9b95ff' : '#6055c5'}
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <List.Section title={t('profile.language')} titleStyle={{ color: isDarkMode ? '#ffffff' : '#1a1a2c' }}>
            <List.Item
              title="English"
              onPress={() => handleLanguageChange('en')}
              left={props => <List.Icon {...props} icon="flag" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              right={props => 
                i18n.language === 'en' ? 
                <List.Icon {...props} icon="check" color={isDarkMode ? '#9b95ff' : '#6055c5'} /> : 
                null
              }
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
            
            <List.Item
              title="Español"
              onPress={() => handleLanguageChange('es')}
              left={props => <List.Icon {...props} icon="flag" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              right={props => 
                i18n.language === 'es' ? 
                <List.Icon {...props} icon="check" color={isDarkMode ? '#9b95ff' : '#6055c5'} /> : 
                null
              }
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
            
            <List.Item
              title="Português"
              onPress={() => handleLanguageChange('pt')}
              left={props => <List.Icon {...props} icon="flag" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              right={props => 
                i18n.language === 'pt' ? 
                <List.Icon {...props} icon="check" color={isDarkMode ? '#9b95ff' : '#6055c5'} /> : 
                null
              }
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
          </List.Section>
        </Animated.View>
        
        <Animated.View 
          style={[styles.section, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}
          entering={FadeIn.delay(400).duration(500)}
        >
          <List.Section title={t('profile.account')} titleStyle={{ color: isDarkMode ? '#ffffff' : '#1a1a2c' }}>
            <List.Item
              title={t('profile.editProfile')}
              onPress={() => {}}
              left={props => <List.Icon {...props} icon="account-edit" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
            
            <List.Item
              title={t('profile.notifications')}
              onPress={() => {}}
              left={props => <List.Icon {...props} icon="bell" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
            
            <List.Item
              title={t('profile.privacy')}
              onPress={() => {}}
              left={props => <List.Icon {...props} icon="shield-lock" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
          </List.Section>
        </Animated.View>
        
        <Animated.View 
          style={[styles.section, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}
          entering={FadeIn.delay(600).duration(500)}
        >
          <List.Section title={t('profile.support')} titleStyle={{ color: isDarkMode ? '#ffffff' : '#1a1a2c' }}>
            <List.Item
              title={t('profile.helpCenter')}
              onPress={() => {}}
              left={props => <List.Icon {...props} icon="help-circle" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
            
            <List.Item
              title={t('profile.contactUs')}
              onPress={() => {}}
              left={props => <List.Icon {...props} icon="email" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
            
            <List.Item
              title={t('profile.about')}
              onPress={() => {}}
              left={props => <List.Icon {...props} icon="information" color={isDarkMode ? '#9b95ff' : '#6055c5'} />}
              titleStyle={{ color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }}
            />
          </List.Section>
        </Animated.View>
        
        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor={isDarkMode ? '#6055c5' : '#9b95ff'}
          >
            {t('profile.logout')}
          </Button>
        </View>
        
        <Text style={[styles.versionText, { color: isDarkMode ? '#717191' : '#a0a0a0' }]}>
          {t('profile.version')} 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    backgroundColor: '#e0e8ff',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  zodiacContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  zodiacText: {
    fontSize: 16,
    marginLeft: 8,
  },
  email: {
    fontSize: 16,
  },
  section: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
  },
  logoutContainer: {
    padding: 16,
  },
  logoutButton: {
    borderRadius: 8,
  },
  versionText: {
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 12,
  },
});