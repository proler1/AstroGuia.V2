import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { Article, ArticleCategory, articleCategories } from '../models/Learn';

export class LearnService {
  // Get articles by category
  static async getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
    try {
      const articlesQuery = query(
        collection(firestore, 'articles'),
        where('category', '==', category),
        orderBy('publishedDate', 'desc')
      );
      
      const articleDocs = await getDocs(articlesQuery);
      
      if (!articleDocs.empty) {
        return articleDocs.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id
          } as Article;
        });
      }
      
      // Return mock data if no articles found
      return this.getMockArticles(category);
    } catch (error: any) {
      console.error(`Error getting articles for category ${category}:`, error);
      // Return mock data in case of error
      return this.getMockArticles(category);
    }
  }
  
  // Get a single article by ID
  static async getArticleById(id: string): Promise<Article | null> {
    try {
      const articleDoc = await getDoc(doc(firestore, 'articles', id));
      
      if (articleDoc.exists()) {
        return {
          ...articleDoc.data(),
          id: articleDoc.id
        } as Article;
      }
      
      return null;
    } catch (error: any) {
      console.error(`Error getting article ${id}:`, error);
      throw error;
    }
  }
  
  // Get featured articles
  static async getFeaturedArticles(): Promise<Article[]> {
    try {
      const articlesQuery = query(
        collection(firestore, 'articles'),
        where('featured', '==', true),
        orderBy('publishedDate', 'desc'),
        limit(5)
      );
      
      const articleDocs = await getDocs(articlesQuery);
      
      if (!articleDocs.empty) {
        return articleDocs.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id
          } as Article;
        });
      }
      
      // Return mock featured articles if none found
      return this.getMockFeaturedArticles();
    } catch (error: any) {
      console.error('Error getting featured articles:', error);
      // Return mock data in case of error
      return this.getMockFeaturedArticles();
    }
  }
  
  // Get all article categories
  static getCategories() {
    return articleCategories;
  }
  
  // Mock data functions for development and fallback
  private static getMockArticles(category: ArticleCategory): Article[] {
    const baseArticles = [
      {
        id: `${category}_1`,
        title: 'Understanding the Basics',
        description: 'An introduction to the foundational concepts',
        readTime: 5,
        imageUrl: 'https://via.placeholder.com/300x200',
        isPremium: false,
        author: 'AstroGuía Team',
        publishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['beginner', 'fundamentals']
      },
      {
        id: `${category}_2`,
        title: 'Advanced Techniques',
        description: 'Dive deeper into complex astrological concepts',
        readTime: 10,
        imageUrl: 'https://via.placeholder.com/300x200',
        isPremium: true,
        author: 'Dr. Stella Cosmos',
        publishedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['advanced', 'techniques']
      },
      {
        id: `${category}_3`,
        title: 'Historical Perspectives',
        description: 'The evolution of astrological practices through history',
        readTime: 8,
        imageUrl: 'https://via.placeholder.com/300x200',
        isPremium: false,
        author: 'Prof. Luna Star',
        publishedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['history', 'traditions']
      }
    ];
    
    // Customize content based on category
    return baseArticles.map(article => {
      let content = '';
      switch (category) {
        case 'basics':
          content = `# Introduction to Astrology\n\nAstrology is the study of the movements and relative positions of celestial bodies interpreted as having an influence on human affairs and the natural world.\n\n## Key Concepts\n\n- **Zodiac Signs**: The 12 segments of the celestial sphere centered on the ecliptic.\n- **Houses**: The 12 divisions of the celestial sphere based on the Earth's daily rotation.\n- **Planets**: Celestial bodies that move through the zodiac, representing different aspects of personality and life.\n\n## How to Get Started\n\nBegin by learning about your Sun sign, Moon sign, and Ascendant (Rising) sign. These three elements form the core of your astrological profile and offer insights into your personality, emotions, and outward expression.`;
          break;
        case 'planets':
          content = `# The Planets in Astrology\n\nIn astrology, each planet represents different aspects of our personality and life experience.\n\n## Inner Planets\n\n- **Sun**: Core identity and ego\n- **Moon**: Emotions and subconscious\n- **Mercury**: Communication and thinking\n- **Venus**: Love and values\n- **Mars**: Energy and action\n\n## Outer Planets\n\n- **Jupiter**: Growth and expansion\n- **Saturn**: Discipline and responsibility\n- **Uranus**: Innovation and rebellion\n- **Neptune**: Dreams and spirituality\n- **Pluto**: Transformation and power\n\n## Their Influence\n\nThe position of each planet in your birth chart reveals how these energies manifest in your life and personality.`;
          break;
        case 'signs':
          content = `# The 12 Zodiac Signs\n\nEach zodiac sign has unique qualities, strengths, and challenges.\n\n## Fire Signs\n\n- **Aries**: The Pioneer\n- **Leo**: The Leader\n- **Sagittarius**: The Explorer\n\n## Earth Signs\n\n- **Taurus**: The Builder\n- **Virgo**: The Analyzer\n- **Capricorn**: The Achiever\n\n## Air Signs\n\n- **Gemini**: The Communicator\n- **Libra**: The Diplomat\n- **Aquarius**: The Visionary\n\n## Water Signs\n\n- **Cancer**: The Nurturer\n- **Scorpio**: The Transformer\n- **Pisces**: The Mystic\n\n## Your Sign\n\nYour Sun sign is determined by the position of the Sun at your birth and represents your core personality traits.`;
          break;
        case 'houses':
          content = `# Understanding Astrological Houses\n\nThe 12 houses in astrology represent different areas of life experience.\n\n## The Personal Houses (1-6)\n\n- **First House**: Self-image and approach to life\n- **Second House**: Values and resources\n- **Third House**: Communication and learning\n- **Fourth House**: Home and family\n- **Fifth House**: Creativity and pleasure\n- **Sixth House**: Work and health\n\n## The Interpersonal Houses (7-12)\n\n- **Seventh House**: Partnerships\n- **Eighth House**: Transformation and shared resources\n- **Ninth House**: Higher learning and exploration\n- **Tenth House**: Career and public image\n- **Eleventh House**: Community and aspirations\n- **Twelfth House**: Spirituality and the unconscious\n\nThe sign on each house cusp and planets within a house color your experiences in these areas of life.`;
          break;
        case 'aspects':
          content = `# Planetary Aspects in Astrology\n\nAspects are angles formed between planets that reveal how different parts of ourselves interact.\n\n## Major Aspects\n\n- **Conjunction (0°)**: Intensification and merging of energies\n- **Opposition (180°)**: Tension and awareness through relationships\n- **Trine (120°)**: Harmonious flow and natural talents\n- **Square (90°)**: Challenges that motivate growth\n- **Sextile (60°)**: Opportunities for cooperation\n\n## Minor Aspects\n\n- **Quincunx (150°)**: Adjustment and integration\n- **Semi-sextile (30°)**: Subtle connections\n- **Semi-square (45°)**: Mild irritation\n- **Sesquiquadrate (135°)**: Internal tension\n\n## Orbs\n\nAn orb is the number of degrees by which an aspect can deviate from being exact while still being considered valid.`;
          break;
        case 'transits':
          content = `# Understanding Astrological Transits\n\nTransits occur when planets in the sky form aspects to the planets in your birth chart.\n\n## Key Transit Effects\n\n- **Personal Planet Transits** (Sun, Moon, Mercury, Venus, Mars): These quick-moving planets create short-term effects lasting days to weeks.\n- **Social Planet Transits** (Jupiter, Saturn): These create medium-term effects lasting months to years, often relating to growth and structure in life.\n- **Outer Planet Transits** (Uranus, Neptune, Pluto): These slow-moving planets create generational effects and major life transformations lasting years.\n\n## Interpreting Transits\n\nWhen interpreting transits, consider:\n1. The nature of the transiting planet\n2. The nature of the natal planet being aspected\n3. The house position of both planets\n4. The type of aspect being formed`;
          break;
        default:
          content = `# Exploring Astrology\n\nAstrology offers a rich framework for understanding ourselves and our place in the cosmos.\n\n## Beyond the Basics\n\nOnce you understand the core elements of astrology (planets, signs, houses, and aspects), you can begin to explore more specialized topics:\n\n- **Asteroids**: Minor celestial bodies like Ceres, Juno, Vesta, and Pallas\n- **Fixed Stars**: Powerful stars outside our solar system with specific influences\n- **Lunar Nodes**: Points where the Moon's orbit intersects the ecliptic, revealing karmic patterns\n- **Arabic Parts**: Mathematical points calculated from important chart positions\n\n## Modern Applications\n\nAstrology continues to evolve with applications in psychological insight, timing of events, relationship compatibility, and personal growth.`;
      }
      
      return {
        ...article,
        category,
        content
      } as Article;
    });
  }
  
  private static getMockFeaturedArticles(): Article[] {
    return [
      {
        id: 'featured_1',
        title: 'Understanding Mercury Retrograde',
        description: 'What it really means when Mercury goes retrograde and how to navigate this period',
        content: `# Mercury Retrograde: Separating Fact from Fiction\n\nMercury retrograde is perhaps the most talked-about astrological event, often blamed for everything from communication mishaps to technological failures. But what's the real story?\n\n## What Is Mercury Retrograde?\n\nMercury retrograde is an optical illusion where Mercury appears to move backward in its orbit from our perspective on Earth. This occurs 3-4 times per year for about 3 weeks each time.\n\n## The Astrological Significance\n\nIn astrology, Mercury governs communication, travel, contracts, and technology. When retrograde, these areas may experience challenges or require revision.\n\n## How to Navigate Mercury Retrograde\n\n- **Re-words**: Review, reflect, revise, rethink, reconsider\n- Double-check important communications\n- Back up your data\n- Build extra time into travel plans\n- Use this time for reflection rather than new beginnings\n\n## The Benefits\n\nMercury retrograde isn't all bad! It's an excellent time for:\n- Finishing old projects\n- Reconnecting with people from your past\n- Revising and improving existing work\n- Introspection and meditation\n\nRemember, Mercury retrograde doesn't cause problems—it simply highlights areas that may already need attention.`,
        category: 'planets',
        readTime: 7,
        imageUrl: 'https://via.placeholder.com/400x300',
        isPremium: false,
        author: 'Dr. Stella Cosmos',
        publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['mercury', 'retrograde', 'practical tips']
      },
      {
        id: 'featured_2',
        title: 'The Four Elements in Astrology',
        description: 'How fire, earth, air, and water shape our personalities and relationships',
        content: `# The Four Elements: The Building Blocks of Astrology\n\nThe twelve zodiac signs are divided into four elemental groups: Fire, Earth, Air, and Water. Understanding these elements helps decode personality traits and compatibility.\n\n## Fire Signs (Aries, Leo, Sagittarius)\n\n**Keywords**: Passionate, Dynamic, Spontaneous\n\nFire signs bring enthusiasm and inspiration. They're action-oriented, confident, and often take the lead. Their challenges include impatience and occasionally being self-centered.\n\n## Earth Signs (Taurus, Virgo, Capricorn)\n\n**Keywords**: Practical, Reliable, Grounded\n\nEarth signs excel at manifesting ideas into reality. They're methodical, sensual, and value security. Their challenges include stubbornness and sometimes being too cautious.\n\n## Air Signs (Gemini, Libra, Aquarius)\n\n**Keywords**: Intellectual, Social, Objective\n\nAir signs are communicative and conceptual thinkers. They value ideas, social connection, and fairness. Their challenges include detachment and overthinking.\n\n## Water Signs (Cancer, Scorpio, Pisces)\n\n**Keywords**: Emotional, Intuitive, Empathetic\n\nWater signs navigate through feeling and intuition. They're deeply compassionate and psychologically perceptive. Their challenges include mood fluctuations and absorbing others' emotions.\n\n## Elemental Balance\n\nMost people have a mix of elements in their birth chart. Understanding your elemental composition can help you recognize your natural strengths and areas for growth.`,
        category: 'basics',
        readTime: 8,
        imageUrl: 'https://via.placeholder.com/400x300',
        isPremium: false,
        author: 'Prof. Luna Star',
        publishedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['elements', 'personality', 'compatibility']
      },
      {
        id: 'featured_3',
        title: 'Saturn Return: Your Quarter-Life Crisis Explained',
        description: 'What happens when Saturn returns to its birth position and how to use this transit for growth',
        content: `# Saturn Return: Coming of Age in the Cosmos\n\nSaturn takes approximately 29.5 years to complete one orbit around the Sun. When it returns to the position it held when you were born—your "Saturn Return"—it often coincides with significant life transitions.\n\n## First Saturn Return (Ages 27-30)\n\nOften called the "quarter-life crisis," this period marks the transition to true adulthood. You may experience:\n\n- Career changes or advancement\n- Serious relationship decisions\n- Reassessment of life goals\n- Increased responsibilities\n- Letting go of youth and accepting adult accountability\n\n## Saturn's Lessons\n\nSaturn represents:\n- Structure and limitation\n- Discipline and responsibility\n- Authority and mastery\n- Time and maturation\n\nDuring your Saturn Return, these themes come into sharp focus.\n\n## Navigating Your Saturn Return\n\n1. **Face reality**: Be honest about what's working and what isn't\n2. **Establish boundaries**: Learn to say no to what doesn't serve your long-term goals\n3. **Build foundations**: Invest in what you want to last\n4. **Take responsibility**: Own your choices and their consequences\n5. **Develop patience**: Real achievement takes time\n\n## The Reward\n\nWhile potentially challenging, your Saturn Return is ultimately about maturation. Those who do the work often emerge with greater clarity, purpose, and authenticity.`,
        category: 'transits',
        readTime: 10,
        imageUrl: 'https://via.placeholder.com/400x300',
        isPremium: true,
        author: 'Dr. Stella Cosmos',
        publishedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['saturn return', 'life transitions', 'personal growth']
      }
    ];
  }
}