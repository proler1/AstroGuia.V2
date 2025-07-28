import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Card, Text, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

export interface CosmicEventData {
  id: string;
  title: string;
  date: string;
  type: 'moon_phase' | 'planet_retrograde' | 'planet_transit' | 'solar_eclipse' | 'lunar_eclipse' | 'other';
  description: string;
  imageUrl: string;
}

interface CosmicEventCardProps {
  event: CosmicEventData;
  onPress?: () => void;
  compact?: boolean;
  style?: any;
}

const CosmicEventCard: React.FC<CosmicEventCardProps> = ({
  event,
  onPress,
  compact = false,
  style
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const cardBgColor = isDarkMode ? '#191c2d' : '#f5f8ff';
  
  const getEventTypeIcon = (type: string): string => {
    switch (type) {
      case 'moon_phase': return 'moon-waning-crescent';
      case 'planet_retrograde': return 'arrow-u-left-top';
      case 'planet_transit': return 'orbit';
      case 'solar_eclipse': return 'weather-sunny-off';
      case 'lunar_eclipse': return 'moon-waning-gibbous';
      default: return 'star-four-points';
    }
  };
  
  const getEventTypeColor = (type: string): string => {
    switch (type) {
      case 'moon_phase': return '#9b95ff';
      case 'planet_retrograde': return '#ff5252';
      case 'planet_transit': return '#4caf50';
      case 'solar_eclipse': return '#ff9800';
      case 'lunar_eclipse': return '#7e57c2';
      default: return '#2196f3';
    }
  };
  
  const getEventTypeName = (type: string): string => {
    switch (type) {
      case 'moon_phase': return t('cosmicEvents.moonPhase');
      case 'planet_retrograde': return t('cosmicEvents.retrograde');
      case 'planet_transit': return t('cosmicEvents.transit');
      case 'solar_eclipse': return t('cosmicEvents.solarEclipse');
      case 'lunar_eclipse': return t('cosmicEvents.lunarEclipse');
      default: return t('cosmicEvents.event');
    }
  };
  
  // Use local image if URL starts with /images/
  const getImageSource = (): any => {
    if (event.imageUrl.startsWith('/images/')) {
      try {
        // Remove the leading slash and try to require the image
        const path = event.imageUrl.substring(1);
        // This is a hack to make it work with dynamic requires
        // In a real app, you would need to handle this differently
        return { uri: event.imageUrl };
      } catch (error) {
        // Fallback to a placeholder if image not found
        return { uri: 'https://via.placeholder.com/300x150' };
      }
    }
    // Regular URL
    return { uri: event.imageUrl };
  };
  
  if (compact) {
    return (
      <TouchableOpacity onPress={onPress}>
        <Card style={[styles.compactCard, { backgroundColor: cardBgColor }, style]} mode="elevated">
          <Card.Cover source={getImageSource()} style={styles.compactCover} />
          <View style={styles.compactTypeContainer}>
            <Chip 
              compact
              icon={() => (
                <MaterialCommunityIcons 
                  name={getEventTypeIcon(event.type)} 
                  size={14} 
                  color="#ffffff"
                />
              )}
              style={{ backgroundColor: getEventTypeColor(event.type) }}
              textStyle={{ color: "#ffffff", fontSize: 10 }}
            >
              {getEventTypeName(event.type)}
            </Chip>
          </View>
          <Card.Content style={styles.compactContent}>
            <Text 
              numberOfLines={1}
              style={[styles.compactTitle, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}
            >
              {event.title}
            </Text>
            <Text style={[styles.compactDate, { color: isDarkMode ? '#9b95ff' : '#6055c5' }]}>
              {event.date}
            </Text>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }
  
  return (
    <Card style={[styles.card, { backgroundColor: cardBgColor }, style]} mode="elevated">
      <Card.Cover source={getImageSource()} style={styles.cover} />
      <View style={styles.typeContainer}>
        <Chip 
          icon={() => (
            <MaterialCommunityIcons 
              name={getEventTypeIcon(event.type)} 
              size={16} 
              color="#ffffff"
            />
          )}
          style={{ backgroundColor: getEventTypeColor(event.type) }}
          textStyle={{ color: "#ffffff" }}
        >
          {getEventTypeName(event.type)}
        </Chip>
      </View>
      <Card.Content>
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
          {event.title}
        </Text>
        <Text style={[styles.date, { color: isDarkMode ? '#9b95ff' : '#6055c5' }]}>
          {event.date}
        </Text>
        <Text 
          style={[styles.description, { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }]}
          numberOfLines={4}
        >
          {event.description}
        </Text>
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="text"
          textColor={isDarkMode ? '#9b95ff' : '#6055c5'}
          onPress={onPress}
        >
          {t('common.readMore')}
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    margin: 8,
  },
  cover: {
    height: 180,
  },
  typeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  compactCard: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 180,
    margin: 6,
  },
  compactCover: {
    height: 100,
  },
  compactTypeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  compactContent: {
    padding: 12,
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  compactDate: {
    fontSize: 12,
  }
});

export default CosmicEventCard;