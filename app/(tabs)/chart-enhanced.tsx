import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getFirestore } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  ZodiacSign,
  PlanetComponent,
  NatalChartWheel,
  AspectComponent,
  ElementDistribution
} from '../../src/components/astrology';
import { ChartData, Planet, PlanetPosition, HouseData, getAspectSymbol } from '../../src/models/NatalChart';

const { width } = Dimensions.get('window');

// Mock chart data
const mockChartData: ChartData = {
  planets: [
    { planet: 'sun', sign: 'leo', house: 10, degree: 15, isRetrograde: false },
    { planet: 'moon', sign: 'cancer', house: 9, degree: 3, isRetrograde: false },
    { planet: 'mercury', sign: 'virgo', house: 11, degree: 7, isRetrograde: true },
    { planet: 'venus', sign: 'leo', house: 10, degree: 22, isRetrograde: false },
    { planet: 'mars', sign: 'aries', house: 6, degree: 17, isRetrograde: false },
    { planet: 'jupiter', sign: 'sagittarius', house: 2, degree: 9, isRetrograde: false },
    { planet: 'saturn', sign: 'capricorn', house: 3, degree: 28, isRetrograde: true },
    { planet: 'uranus', sign: 'aquarius', house: 4, degree: 12, isRetrograde: false },
    { planet: 'neptune', sign: 'pisces', house: 5, degree: 19, isRetrograde: true },
    { planet: 'pluto', sign: 'scorpio', house: 1, degree: 5, isRetrograde: false }
  ],
  houses: [
    { number: 1, sign: 'libra', degree: 5 },
    { number: 2, sign: 'scorpio', degree: 3 },
    { number: 3, sign: 'sagittarius', degree: 1 },
    { number: 4, sign: 'capricorn', degree: 0 },
    { number: 5, sign: 'aquarius', degree: 2 },
    { number: 6, sign: 'pisces', degree: 5 },
    { number: 7, sign: 'aries', degree: 5 },
    { number: 8, sign: 'taurus', degree: 3 },
    { number: 9, sign: 'gemini', degree: 1 },
    { number: 10, sign: 'cancer', degree: 0 },
    { number: 11, sign: 'leo', degree: 2 },
    { number: 12, sign: 'virgo', degree: 5 }
  ],
  aspects: [
    { planet1: 'sun', planet2: 'venus', type: 'conjunction', orb: 7 },
    { planet1: 'sun', planet2: 'mercury', type: 'sextile', orb: 2 },
    { planet1: 'moon', planet2: 'neptune', type: 'trine', orb: 1 },
    { planet1: 'mars', planet2: 'jupiter', type: 'square', orb: 3 },
    { planet1: 'saturn', planet2: 'uranus', type: 'opposition', orb: 1 }
  ],
  ascendant: {
    sign: 'libra',
    degree: 5
  },
  dominantElements: [
    { element: 'fire', percentage: 35 },
    { element: 'earth', percentage: 20 },
    { element: 'air', percentage: 25 },
    { element: 'water', percentage: 20 }
  ]
};

export default function ChartScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const db = getFirestore();
  
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'planets' | 'houses' | 'aspects'>('chart');
  
  useEffect(() => {
    const fetchUserNatalChart = async () => {
      if (!user) return;
      
      try {
        // In a real app, we would fetch the birth details and calculate the chart
        // or fetch from a database if previously calculated
        
        // For now, just use mock data after a delay to simulate API call
        setTimeout(() => {
          setChartData(mockChartData);
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error("Error fetching natal chart:", error);
        setLoading(false);
      }
    };
    
    fetchUserNatalChart();
  }, [user]);
  
  const renderChartTab = () => (
    <View style={styles.chartTabContainer}>
      <View style={styles.chartWheelContainer}>
        {chartData && (
          <NatalChartWheel 
            chartData={chartData} 
            darkMode={isDarkMode}
          />
        )}
      </View>
      
      <Card style={[styles.chartInfoCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}>
        <Card.Content>
          <View style={styles.chartInfoRow}>
            <Text style={styles.chartInfoLabel}>{t('chart.ascendant')}:</Text>
            <View style={styles.chartInfoValue}>
              <ZodiacSign
                sign={chartData?.ascendant.sign || 'aries'}
                size="medium"
                showSymbol={true}
                showName={true}
              />
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.dominantElements}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
              {t('chart.dominantElements')}
            </Text>
            
            {chartData && (
              <ElementDistribution 
                elements={chartData.dominantElements} 
              />
            )}
          </View>
        </Card.Content>
      </Card>
      
      <Card style={[styles.interpretationCard, { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }]}>
        <Card.Content>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
            {t('chart.chartInterpretation')}
          </Text>
          
          <Text style={[styles.interpretationText, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
            With your Leo Sun and Cancer Moon, you have a unique blend of confident self-expression and emotional sensitivity. Your Libra Ascendant gives you a charming, diplomatic presence.
            {'\n\n'}
            Your chart shows a strong tenth house emphasis, highlighting career ambitions and public recognition. Mercury retrograde in Virgo suggests a methodical, analytical mind that may sometimes get caught in details.
          </Text>
          
          <Button
            mode="contained"
            style={styles.fullReportButton}
            onPress={() => {}}
          >
            {t('chart.getFullReport')}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
  
  const renderPlanetsTab = () => (
    <View style={styles.tabContent}>
      {chartData?.planets.map((position) => (
        <Card 
          key={position.planet} 
          style={[
            styles.planetCard, 
            { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
          ]}
        >
          <Card.Content style={styles.planetCardContent}>
            <View style={styles.planetIconContainer}>
              <PlanetComponent
                planet={position.planet}
                isRetrograde={position.isRetrograde}
                size="large"
                showName={false}
              />
            </View>
            
            <View style={styles.planetInfo}>
              <Text style={[styles.planetName, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                <PlanetComponent
                  planet={position.planet}
                  showIcon={false}
                  showSymbol={false}
                  size="medium"
                />
              </Text>
              
              <View style={styles.planetDetails}>
                <View style={styles.planetPositionDetail}>
                  <MaterialCommunityIcons
                    name="zodiac-sign"
                    size={16}
                    color={isDarkMode ? '#9b95ff' : '#6055c5'}
                    style={{ marginRight: 4 }}
                  />
                  <ZodiacSign 
                    sign={position.sign}
                    size="small"
                  />
                  <Text style={{ marginLeft: 4 }}>
                    {position.degree}°
                  </Text>
                </View>
                
                <View style={styles.planetPositionDetail}>
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={16}
                    color={isDarkMode ? '#9b95ff' : '#6055c5'}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.planetDetail, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
                    {t('chart.house')} {position.house}
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
  
  const renderHousesTab = () => (
    <View style={styles.tabContent}>
      {chartData?.houses.map((house) => (
        <Card 
          key={house.number} 
          style={[
            styles.houseCard, 
            { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
          ]}
        >
          <Card.Content style={styles.houseCardContent}>
            <View style={styles.houseNumberContainer}>
              <Text style={styles.houseNumber}>{house.number}</Text>
            </View>
            
            <View style={styles.houseInfo}>
              <ZodiacSign 
                sign={house.sign}
                size="medium"
              />
              <Text style={{ marginLeft: 4, color: isDarkMode ? '#9b95ff' : '#6055c5' }}>
                {house.degree}°
              </Text>
              
              <Text style={[styles.houseDescription, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c', marginTop: 8 }]}>
                {getHouseDescription(house.number)}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
  
  const renderAspectsTab = () => (
    <View style={styles.tabContent}>
      {chartData?.aspects.map((aspect, index) => (
        <Card 
          key={`aspect-${index}`} 
          style={[
            styles.aspectCard, 
            { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
          ]}
        >
          <Card.Content style={styles.aspectCardContent}>
            <View style={styles.aspectTypeContainer}>
              <AspectComponent
                type={aspect.type}
                size="large"
                showName={false}
              />
            </View>
            
            <View style={styles.aspectInfo}>
              <View style={styles.aspectHeader}>
                <Text style={[styles.aspectTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
                  <AspectComponent
                    type={aspect.type}
                    showSymbol={false}
                    size="medium"
                  />
                </Text>
                <Text style={[styles.aspectOrb, { color: isDarkMode ? '#9b95ff' : '#6055c5' }]}>
                  {aspect.orb}° {t('chart.orb')}
                </Text>
              </View>
              
              <View style={styles.aspectPlanets}>
                <View style={styles.aspectPlanet}>
                  <PlanetComponent
                    planet={aspect.planet1}
                    size="medium"
                  />
                </View>
                <Text style={styles.aspectConnector}>⟷</Text>
                <View style={styles.aspectPlanet}>
                  <PlanetComponent
                    planet={aspect.planet2}
                    size="medium"
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
  
  // Helper function to get house descriptions
  const getHouseDescription = (houseNumber: number): string => {
    const descriptions: Record<number, string> = {
      1: t('chart.house1Desc'),
      2: t('chart.house2Desc'),
      3: t('chart.house3Desc'),
      4: t('chart.house4Desc'),
      5: t('chart.house5Desc'),
      6: t('chart.house6Desc'),
      7: t('chart.house7Desc'),
      8: t('chart.house8Desc'),
      9: t('chart.house9Desc'),
      10: t('chart.house10Desc'),
      11: t('chart.house11Desc'),
      12: t('chart.house12Desc')
    };
    
    // Fallback descriptions
    const fallbacks: Record<number, string> = {
      1: "Self, identity, appearance",
      2: "Values, possessions, resources",
      3: "Communication, siblings, local environment",
      4: "Home, family, roots",
      5: "Creativity, romance, children",
      6: "Health, daily routines, service",
      7: "Partnerships, marriage, contracts",
      8: "Transformation, shared resources, intimacy",
      9: "Higher education, philosophy, travel",
      10: "Career, public image, authority",
      11: "Friends, groups, hopes and wishes",
      12: "Spirituality, unconscious, hidden things"
    };
    
    return descriptions[houseNumber] || fallbacks[houseNumber] || "";
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#9b95ff' : '#6055c5'} />
        <Text style={[styles.loadingText, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}>
          {t('chart.calculatingChart')}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
          {t('chart.natalChart')}
        </Text>
      </View>
      
      <View style={styles.tabsContainer}>
        <Button
          mode={activeTab === 'chart' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('chart')}
          style={styles.tabButton}
        >
          {t('chart.chart')}
        </Button>
        
        <Button
          mode={activeTab === 'planets' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('planets')}
          style={styles.tabButton}
        >
          {t('chart.planets')}
        </Button>
        
        <Button
          mode={activeTab === 'houses' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('houses')}
          style={styles.tabButton}
        >
          {t('chart.houses')}
        </Button>
        
        <Button
          mode={activeTab === 'aspects' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('aspects')}
          style={styles.tabButton}
        >
          {t('chart.aspects')}
        </Button>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.content}
          entering={FadeIn.duration(500)}
        >
          {activeTab === 'chart' && renderChartTab()}
          {activeTab === 'planets' && renderPlanetsTab()}
          {activeTab === 'houses' && renderHousesTab()}
          {activeTab === 'aspects' && renderAspectsTab()}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  chartTabContainer: {
    gap: 16,
  },
  chartWheelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  chartInfoCard: {
    borderRadius: 16,
    marginBottom: 16,
  },
  chartInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartInfoLabel: {
    fontSize: 16,
    fontWeight: '500',
    width: '35%',
  },
  chartInfoValue: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  dominantElements: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  interpretationCard: {
    borderRadius: 16,
  },
  interpretationText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  fullReportButton: {
    borderRadius: 8,
  },
  tabContent: {
    gap: 12,
  },
  planetCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  planetCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planetIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  planetInfo: {
    flex: 1,
  },
  planetName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planetDetails: {
    gap: 8,
  },
  planetPositionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planetDetail: {
    fontSize: 14,
  },
  houseCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  houseCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  houseNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6055c5',
    marginRight: 16,
  },
  houseNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  houseInfo: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  houseSign: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  houseDescription: {
    fontSize: 14,
    width: '100%',
  },
  aspectCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  aspectCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aspectTypeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  aspectInfo: {
    flex: 1,
  },
  aspectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aspectTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  aspectOrb: {
    fontSize: 14,
  },
  aspectPlanets: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aspectPlanet: {
    flex: 1,
  },
  aspectConnector: {
    fontSize: 20,
    marginHorizontal: 8,
  },
});