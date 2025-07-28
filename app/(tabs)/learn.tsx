import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Card, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface LearningCategory {
  id: string;
  name: string;
  icon: string;
}

interface LearningArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  readingTime: number;
  premium: boolean;
}

export default function LearnScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const categories: LearningCategory[] = [
    { id: 'basics', name: t('learn.categories.basics'), icon: 'star-outline' },
    { id: 'planets', name: t('learn.categories.planets'), icon: 'earth' },
    { id: 'signs', name: t('learn.categories.signs'), icon: 'zodiac-aries' },
    { id: 'houses', name: t('learn.categories.houses'), icon: 'home-outline' },
    { id: 'aspects', name: t('learn.categories.aspects'), icon: 'connection' },
    { id: 'transits', name: t('learn.categories.transits'), icon: 'orbit' }
  ];
  
  const articles: LearningArticle[] = [
    {
      id: '1',
      title: t('learn.articles.intro.title'),
      description: t('learn.articles.intro.desc'),
      imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0',
      categoryId: 'basics',
      readingTime: 5,
      premium: false
    },
    {
      id: '2',
      title: t('learn.articles.planets.title'),
      description: t('learn.articles.planets.desc'),
      imageUrl: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700',
      categoryId: 'planets',
      readingTime: 8,
      premium: false
    },
    {
      id: '3',
      title: t('learn.articles.signs.title'),
      description: t('learn.articles.signs.desc'),
      imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d',
      categoryId: 'signs',
      readingTime: 10,
      premium: false
    },
    {
      id: '4',
      title: t('learn.articles.houses.title'),
      description: t('learn.articles.houses.desc'),
      imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25',
      categoryId: 'houses',
      readingTime: 7,
      premium: false
    },
    {
      id: '5',
      title: t('learn.articles.aspects.title'),
      description: t('learn.articles.aspects.desc'),
      imageUrl: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031',
      categoryId: 'aspects',
      readingTime: 12,
      premium: true
    },
    {
      id: '6',
      title: t('learn.articles.transits.title'),
      description: t('learn.articles.transits.desc'),
      imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401',
      categoryId: 'transits',
      readingTime: 15,
      premium: true
    }
  ];
  
  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.categoryId === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (categoryId: string) => {
    setLoading(true);
    setSelectedCategory(currentCategory => 
      currentCategory === categoryId ? null : categoryId
    );
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
          {t('learn.title')}
        </Text>
        
        <Searchbar
          placeholder={t('learn.searchPlaceholder')}
          onChangeText={handleSearch}
          value={searchQuery}
          style={[
            styles.searchBar, 
            { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
          ]}
          iconColor={isDarkMode ? '#9b95ff' : '#6055c5'}
          inputStyle={{ color: isDarkMode ? '#ffffff' : '#1a1a2c' }}
          placeholderTextColor={isDarkMode ? '#717191' : '#a0a0a0'}
        />
      </View>
      
      <View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && {
                  backgroundColor: isDarkMode ? '#6055c5' : '#9b95ff'
                }
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <MaterialCommunityIcons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.id 
                  ? '#ffffff' 
                  : isDarkMode ? '#9b95ff' : '#6055c5'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id 
                  ? { color: '#ffffff' } 
                  : { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkMode ? '#9b95ff' : '#6055c5'} />
          </View>
        ) : filteredArticles.length > 0 ? (
          <Animated.View 
            style={styles.articlesContainer}
            entering={FadeIn.duration(500)}
          >
            {filteredArticles.map((article, index) => (
              <Animated.View 
                key={article.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
              >
                <TouchableOpacity activeOpacity={0.7}>
                  <Card style={[
                    styles.articleCard,
                    { backgroundColor: isDarkMode ? '#191c2d' : '#ffffff' }
                  ]}>
                    <Card.Cover 
                      source={{ uri: article.imageUrl }} 
                      style={styles.articleImage}
                    />
                    <Card.Content style={styles.articleContent}>
                      <View style={styles.articleHeader}>
                        <Text style={[
                          styles.articleTitle,
                          { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
                        ]}>
                          {article.title}
                        </Text>
                        
                        {article.premium && (
                          <Chip 
                            icon="star" 
                            style={styles.premiumChip}
                            textStyle={{ color: '#ffffff', fontSize: 12 }}
                          >
                            {t('learn.premium')}
                          </Chip>
                        )}
                      </View>
                      
                      <Text 
                        style={[
                          styles.articleDescription,
                          { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                        ]}
                        numberOfLines={2}
                      >
                        {article.description}
                      </Text>
                      
                      <View style={styles.articleFooter}>
                        <View style={styles.readingTime}>
                          <MaterialCommunityIcons 
                            name="clock-outline" 
                            size={14} 
                            color={isDarkMode ? '#9b95ff' : '#6055c5'} 
                          />
                          <Text style={[
                            styles.readingTimeText,
                            { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                          ]}>
                            {article.readingTime} {t('learn.minuteRead')}
                          </Text>
                        </View>
                        
                        <Text style={[
                          styles.readMore,
                          { color: isDarkMode ? '#9b95ff' : '#6055c5' }
                        ]}>
                          {t('common.readMore')}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        ) : (
          <View style={styles.noResultsContainer}>
            <MaterialCommunityIcons 
              name="magnify-close" 
              size={60} 
              color={isDarkMode ? '#717191' : '#a0a0a0'} 
            />
            <Text style={[
              styles.noResultsText,
              { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
            ]}>
              {t('learn.noResults')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 12,
    elevation: 0,
    height: 50,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    marginHorizontal: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryText: {
    fontSize: 14,
    marginLeft: 6,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    paddingTop: 40,
    alignItems: 'center',
  },
  articlesContainer: {
    paddingVertical: 16,
  },
  articleCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  articleImage: {
    height: 160,
  },
  articleContent: {
    padding: 12,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    paddingRight: 12,
  },
  premiumChip: {
    backgroundColor: '#ffc107',
    height: 24,
  },
  articleDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingTimeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  noResultsText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});