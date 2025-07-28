import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface DailyHoroscope {
  sign: string;
  date: string;
  text: string;
  mood: string;
  lucky_number: number;
  compatible_sign: string;
}

interface CosmicEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  imageUrl: string;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const db = getFirestore();
  
  const [loading, setLoading] = useState(true);
  const [dailyHoroscope, setDailyHoroscope] = useState<DailyHoroscope | null>(null);
  const [cosmicEvents, setCosmicEvents] = useState<CosmicEvent[]>([]);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Fetch daily horoscope for user's sign
          if (userData.zodiacSign) {
            // For now we'll use mock data until API integration
            setDailyHoroscope({
              sign: userData.zodiacSign,
              date: new Date().toLocaleDateString(),
              text: "Today brings a boost of energy and creativity. Focus on expressing yourself and don't shy away from taking the spotlight. Your confidence will attract positive attention.",
              mood: "Inspired",
              lucky_number: 7,
              compatible_sign: "Leo"
            });
          }
        }
        
        // For now, use mock cosmic events data
        setCosmicEvents([
          {
            id: '1',
            title: 'Full Moon in Scorpio',
            date: '2023-05-05',
            type: 'moon_phase',
            description: 'A powerful time for transformation and release. Embrace emotional depth.',
            imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d'
          },
          {
            id: '2',
            title: 'Mercury Retrograde',
            date: '2023-05-10',
            type: 'planet_retrograde',
            description: 'Communication challenges may arise. Double-check important messages.',
            imageUrl: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700'
          },
          {
            id: '3',
            title: 'Venus enters Cancer',
            date: '2023-05-07',
            type: 'planet_transit',
            description: 'A nurturing energy for relationships. Focus on emotional connections.',
            imageUrl: '/images/nurturing.jpg'
          }
        ]);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  const renderGreeting = () => {
    const hour = new Date().getHours();
    let greeting = t('home.goodMorning');
    
    if (hour >= 12 && hour < 18) {
      greeting = t('home.goodAfternoon');
    } else if (hour >= 18) {
      greeting = t('home.goodEvening');
    }
    
    return (
      <Text style={[styles.greeting, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
        {greeting}, {user?.displayName || t('home.stargazer')}
      </Text>
    );
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#9b95ff' : '#6055c5'} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
      <ScrollView>
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(500)}
        >
          {renderGreeting()}
          <Text style={[styles.date, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
        </Animated.View>
        
        {dailyHoroscope && (
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <Card 
              style={[styles.horoscopeCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}
              mode="elevated"
            >
              <Card.Content>
                <View style={styles.horoscopeHeader}>
                  <View>
                    <Text style={styles.horoscopeTitle}>
                      {t('home.dailyHoroscope')}
                    </Text>
                    <Text style={[styles.sign, { color: isDarkMode ? '#9b95ff' : '#6055c5' }]}>
                      {dailyHoroscope.sign.charAt(0).toUpperCase() + dailyHoroscope.sign.slice(1)}
                    </Text>
                  </View>
                  <Image 
                    source={require('/images/Aries.jpg')} 
                    style={styles.zodiacIcon}
                    resizeMode="contain"
                  />
                </View>
                
                <Text style={[styles.horoscopeText, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
                  {dailyHoroscope.text}
                </Text>
                
                <View style={styles.horoscopeDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('home.mood')}:</Text>
                    <Text style={styles.detailValue}>{dailyHoroscope.mood}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('home.luckyNumber')}:</Text>
                    <Text style={styles.detailValue}>{dailyHoroscope.lucky_number}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('home.compatibleWith')}:</Text>
                    <Text style={styles.detailValue}>{dailyHoroscope.compatible_sign}</Text>
                  </View>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="text"
                  textColor={isDarkMode ? '#9b95ff' : '#6055c5'}
                  onPress={() => {}}
                >
                  {t('home.readMore')}
                </Button>
              </Card.Actions>
            </Card>
          </Animated.View>
        )}
        
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.delay(500).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
              {t('home.cosmicEvents')}
            </Text>
            <TouchableOpacity>
              <Text style={{ color: isDarkMode ? '#9b95ff' : '#6055c5' }}>
                {t('common.seeAll')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsList}
          >
            {cosmicEvents.map((event) => (
              <Card 
                key={event.id} 
                style={styles.eventCard}
                mode="elevated"
              >
                <Card.Cover source={{ uri: event.imageUrl }} style={styles.eventImage} />
                <Card.Content>
                  <Text style={[styles.eventTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                    {event.title}
                  </Text>
                  <Text style={[styles.eventDate, { color: isDarkMode ? '#9b95ff' : '#6055c5' }]}>
                    {event.date}
                  </Text>
                  <Text numberOfLines={2} style={[styles.eventDescription, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
                    {event.description}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </Animated.View>
        
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.delay(700).duration(500)}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
              {t('home.quickTools')}
            </Text>
          </View>
          
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}>
              <MaterialCommunityIcons 
                name="zodiac-aries" 
                size={32} 
                color={isDarkMode ? '#9b95ff' : '#6055c5'} 
              />
              <Text style={[styles.toolTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                {t('home.compatibility')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}>
              <MaterialCommunityIcons 
                name="moon-waning-crescent" 
                size={32} 
                color={isDarkMode ? '#9b95ff' : '#6055c5'} 
              />
              <Text style={[styles.toolTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                {t('home.moonPhase')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}>
              <MaterialCommunityIcons 
                name="calendar-star" 
                size={32} 
                color={isDarkMode ? '#9b95ff' : '#6055c5'} 
              />
              <Text style={[styles.toolTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                {t('home.calendar')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.toolCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}>
              <MaterialCommunityIcons 
                name="cards" 
                size={32} 
                color={isDarkMode ? '#9b95ff' : '#6055c5'} 
              />
              <Text style={[styles.toolTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                {t('home.tarotDraw')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 16,
    marginTop: 4,
  },
  horoscopeCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 4,
  },
  horoscopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  horoscopeTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  sign: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  zodiacIcon: {
    width: 60,
    height: 60,
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  horoscopeDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '500',
    marginRight: 8,
  },
  detailValue: {
    fontWeight: '400',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventsList: {
    paddingHorizontal: 12,
  },
  eventCard: {
    width: 280,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  eventImage: {
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  toolCard: {
    width: '44%',
    margin: '3%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },
});