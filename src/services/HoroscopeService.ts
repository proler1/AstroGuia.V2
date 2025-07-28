import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { DailyHoroscope, CosmicEvent, MoonPhase, CompatibilityResult } from '../models/Horoscope';
import { ZodiacSign } from '../models/User';

export class HoroscopeService {
  // Get daily horoscope for a specific sign
  static async getDailyHoroscope(sign: ZodiacSign): Promise<DailyHoroscope | null> {
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const horoscopeRef = doc(firestore, 'dailyHoroscopes', `${sign}_${dateStr}`);
      const horoscopeDoc = await getDoc(horoscopeRef);
      
      if (horoscopeDoc.exists()) {
        return horoscopeDoc.data() as DailyHoroscope;
      }
      
      // If no horoscope found for today, return mock data
      return this.getMockDailyHoroscope(sign);
    } catch (error: any) {
      console.error(`Error getting daily horoscope for ${sign}:`, error);
      // Return mock data in case of error
      return this.getMockDailyHoroscope(sign);
    }
  }
  
  // Get cosmic events for the current month
  static async getCosmicEvents(): Promise<CosmicEvent[]> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
      
      const eventsQuery = query(
        collection(firestore, 'cosmicEvents'),
        where('startDate', '>=', startOfMonth),
        where('startDate', '<=', endOfMonth),
        orderBy('startDate', 'asc')
      );
      
      const eventDocs = await getDocs(eventsQuery);
      
      if (!eventDocs.empty) {
        return eventDocs.docs.map(doc => doc.data() as CosmicEvent);
      }
      
      // Return mock data if no events found
      return this.getMockCosmicEvents();
    } catch (error: any) {
      console.error('Error getting cosmic events:', error);
      // Return mock data in case of error
      return this.getMockCosmicEvents();
    }
  }
  
  // Get current moon phase
  static async getCurrentMoonPhase(): Promise<MoonPhase> {
    try {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      const moonPhaseRef = doc(firestore, 'moonPhases', dateStr);
      const moonPhaseDoc = await getDoc(moonPhaseRef);
      
      if (moonPhaseDoc.exists()) {
        return moonPhaseDoc.data() as MoonPhase;
      }
      
      // Return mock data if no moon phase found
      return this.getMockMoonPhase();
    } catch (error: any) {
      console.error('Error getting current moon phase:', error);
      // Return mock data in case of error
      return this.getMockMoonPhase();
    }
  }
  
  // Get compatibility between two signs
  static async getCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): Promise<CompatibilityResult> {
    try {
      // Sort signs alphabetically to ensure consistent document ID
      const signs = [sign1, sign2].sort();
      const compatibilityRef = doc(firestore, 'compatibility', `${signs[0]}_${signs[1]}`);
      const compatibilityDoc = await getDoc(compatibilityRef);
      
      if (compatibilityDoc.exists()) {
        return compatibilityDoc.data() as CompatibilityResult;
      }
      
      // Return mock data if no compatibility found
      return this.getMockCompatibility(sign1, sign2);
    } catch (error: any) {
      console.error(`Error getting compatibility for ${sign1} and ${sign2}:`, error);
      // Return mock data in case of error
      return this.getMockCompatibility(sign1, sign2);
    }
  }
  
  // Mock data functions for development and fallback
  private static getMockDailyHoroscope(sign: ZodiacSign): DailyHoroscope {
    const today = new Date().toISOString().split('T')[0];
    const compatibilities: ZodiacSign[] = ['libra', 'gemini', 'aquarius', 'leo', 'sagittarius', 'aries'];
    
    return {
      sign,
      date: today,
      description: `Today brings an opportunity for personal growth, ${sign}. Trust your instincts and be open to unexpected connections. Your natural talents will be recognized by someone important.`,
      mood: 'Optimistic',
      color: '#4287f5',
      luckyNumber: Math.floor(Math.random() * 100),
      compatibility: compatibilities[Math.floor(Math.random() * compatibilities.length)],
      rating: {
        love: Math.floor(Math.random() * 5) + 1,
        career: Math.floor(Math.random() * 5) + 1,
        wellness: Math.floor(Math.random() * 5) + 1,
        overall: Math.floor(Math.random() * 5) + 1
      }
    };
  }
  
  private static getMockCosmicEvents(): CosmicEvent[] {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    return [
      {
        id: 'cosmic-1',
        title: 'Mercury Retrograde',
        description: 'Mercury retrograde can disrupt communication, travel, and technology. Take extra care with important conversations and double-check details.',
        startDate: new Date(year, month, 5).toISOString(),
        endDate: new Date(year, month, 25).toISOString(),
        type: 'retrograde',
        affectedSigns: ['gemini', 'virgo', 'libra'],
        impact: 'high'
      },
      {
        id: 'cosmic-2',
        title: 'Full Moon in Sagittarius',
        description: 'This full moon illuminates your need for adventure and expansion. A perfect time for spiritual growth and exploring new philosophies.',
        startDate: new Date(year, month, 14).toISOString(),
        endDate: new Date(year, month, 14).toISOString(),
        type: 'fullMoon',
        affectedSigns: ['sagittarius', 'gemini', 'pisces'],
        impact: 'medium'
      },
      {
        id: 'cosmic-3',
        title: 'Venus enters Leo',
        description: 'When Venus moves into Leo, romance becomes more passionate and creative. Express your feelings boldly and embrace the spotlight.',
        startDate: new Date(year, month, 18).toISOString(),
        endDate: new Date(year, month + 1, 12).toISOString(),
        type: 'transit',
        affectedSigns: ['leo', 'aries', 'sagittarius'],
        impact: 'medium'
      }
    ];
  }
  
  private static getMockMoonPhase(): MoonPhase {
    const today = new Date().toISOString().split('T')[0];
    const phases: MoonPhase['phase'][] = [
      'new', 'waxingCrescent', 'firstQuarter', 'waxingGibbous',
      'full', 'waningGibbous', 'lastQuarter', 'waningCrescent'
    ];
    const randomPhase = phases[Math.floor(Math.random() * phases.length)];
    
    const descriptions = {
      'new': 'A time for new beginnings and setting intentions.',
      'waxingCrescent': 'Growing energy - good for taking action on intentions.',
      'firstQuarter': 'A time of challenge and decision making.',
      'waxingGibbous': 'Refinement and perfection of projects.',
      'full': 'Maximum illumination - time for completion and celebration.',
      'waningGibbous': 'Gratitude and sharing with others.',
      'lastQuarter': 'Release what no longer serves you.',
      'waningCrescent': 'Rest, reflection, and preparation for the new cycle.'
    };
    
    return {
      date: today,
      phase: randomPhase,
      illumination: randomPhase === 'full' ? 100 : randomPhase === 'new' ? 0 : Math.floor(Math.random() * 99) + 1,
      description: descriptions[randomPhase]
    };
  }
  
  private static getMockCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): CompatibilityResult {
    // Helper function to calculate random score based on element compatibility
    const getElementCompatibilityScore = (s1: ZodiacSign, s2: ZodiacSign): number => {
      const elementMap = {
        aries: 'fire', leo: 'fire', sagittarius: 'fire',
        taurus: 'earth', virgo: 'earth', capricorn: 'earth',
        gemini: 'air', libra: 'air', aquarius: 'air',
        cancer: 'water', scorpio: 'water', pisces: 'water'
      };
      
      const element1 = elementMap[s1];
      const element2 = elementMap[s2];
      
      if (element1 === element2) return Math.floor(Math.random() * 20) + 70; // Same element: 70-90
      
      // Complementary elements
      if ((element1 === 'fire' && element2 === 'air') || 
          (element1 === 'air' && element2 === 'fire') || 
          (element1 === 'earth' && element2 === 'water') || 
          (element1 === 'water' && element2 === 'earth')) {
        return Math.floor(Math.random() * 20) + 70; // Complementary: 70-90
      }
      
      // Challenging combinations
      if ((element1 === 'fire' && element2 === 'water') || 
          (element1 === 'water' && element2 === 'fire') || 
          (element1 === 'earth' && element2 === 'air') || 
          (element1 === 'air' && element2 === 'earth')) {
        return Math.floor(Math.random() * 30) + 40; // Challenging: 40-70
      }
      
      // Neutral combinations
      return Math.floor(Math.random() * 40) + 50; // 50-90
    };
    
    const baseScore = getElementCompatibilityScore(sign1, sign2);
    const variation = 15; // Maximum variation around base score
    
    const loveScore = Math.min(100, Math.max(1, baseScore + (Math.random() * variation * 2 - variation)));
    const friendshipScore = Math.min(100, Math.max(1, baseScore + (Math.random() * variation * 2 - variation)));
    const communicationScore = Math.min(100, Math.max(1, baseScore + (Math.random() * variation * 2 - variation)));
    const trustScore = Math.min(100, Math.max(1, baseScore + (Math.random() * variation * 2 - variation)));
    
    const overall = Math.round((loveScore + friendshipScore + communicationScore + trustScore) / 4);
    
    let description = '';
    let advice = '';
    
    if (overall >= 80) {
      description = `${sign1.charAt(0).toUpperCase() + sign1.slice(1)} and ${sign2.charAt(0).toUpperCase() + sign2.slice(1)} have a natural harmony and understanding. This pairing benefits from strong mutual attraction and complementary qualities.`;
      advice = 'Nurture this connection by appreciating your differences as much as your similarities.';
    } else if (overall >= 60) {
      description = `${sign1.charAt(0).toUpperCase() + sign1.slice(1)} and ${sign2.charAt(0).toUpperCase() + sign2.slice(1)} have a good foundation for a relationship with some work required. You balance each other in important ways.`;
      advice = 'Focus on communication to overcome occasional misunderstandings.';
    } else if (overall >= 40) {
      description = `${sign1.charAt(0).toUpperCase() + sign1.slice(1)} and ${sign2.charAt(0).toUpperCase() + sign2.slice(1)} face some challenges in understanding each other's perspectives. This relationship requires patience.`;
      advice = 'Try to appreciate your different approaches to life rather than seeing them as obstacles.';
    } else {
      description = `${sign1.charAt(0).toUpperCase() + sign1.slice(1)} and ${sign2.charAt(0).toUpperCase() + sign2.slice(1)} have significantly different ways of experiencing life. This pairing requires substantial effort and compromise.`;
      advice = 'If committed to making this work, focus on respecting your fundamental differences.';
    }
    
    return {
      sign1,
      sign2,
      overall,
      details: {
        love: Math.round(loveScore),
        friendship: Math.round(friendshipScore),
        communication: Math.round(communicationScore),
        trust: Math.round(trustScore)
      },
      description,
      advice
    };
  }
}