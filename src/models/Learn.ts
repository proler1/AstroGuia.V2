export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: ArticleCategory;
  readTime: number; // in minutes
  imageUrl: string;
  isPremium: boolean;
  author?: string;
  publishedDate: string;
  tags: string[];
}

export type ArticleCategory = 
  | 'basics'
  | 'planets'
  | 'signs'
  | 'houses'
  | 'aspects'
  | 'transits'
  | 'other';
  
export interface ArticleCategoryInfo {
  id: ArticleCategory;
  title: string;
  description: string;
  iconName: string;
}

export const articleCategories: ArticleCategoryInfo[] = [
  {
    id: 'basics',
    title: 'Basics',
    description: 'Fundamental concepts of astrology',
    iconName: 'school'
  },
  {
    id: 'planets',
    title: 'Planets',
    description: 'Planetary influences and meanings',
    iconName: 'public'
  },
  {
    id: 'signs',
    title: 'Zodiac Signs',
    description: 'Characteristics of the 12 zodiac signs',
    iconName: 'star'
  },
  {
    id: 'houses',
    title: 'Houses',
    description: 'The 12 houses and their significance',
    iconName: 'home'
  },
  {
    id: 'aspects',
    title: 'Aspects',
    description: 'Planetary relationships and their effects',
    iconName: 'timeline'
  },
  {
    id: 'transits',
    title: 'Transits',
    description: 'How planetary movements affect you',
    iconName: 'sync'
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Additional astrological topics',
    iconName: 'more_horiz'
  }
];