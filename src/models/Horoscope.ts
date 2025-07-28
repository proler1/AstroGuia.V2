import { ZodiacSign } from './User';

export interface DailyHoroscope {
  sign: ZodiacSign;
  date: string;
  description: string;
  mood: string;
  color: string;
  luckyNumber: number;
  compatibility: ZodiacSign;
  rating: {
    love: number;
    career: number;
    wellness: number;
    overall: number;
  };
}

export interface CosmicEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'retrograde' | 'fullMoon' | 'newMoon' | 'eclipse' | 'transit' | 'other';
  affectedSigns: ZodiacSign[];
  impact: 'low' | 'medium' | 'high';
  imageUrl?: string;
}

export interface MoonPhase {
  date: string;
  phase: 'new' | 'waxingCrescent' | 'firstQuarter' | 'waxingGibbous' | 
         'full' | 'waningGibbous' | 'lastQuarter' | 'waningCrescent';
  illumination: number; // 0-100
  description: string;
}

export interface CompatibilityResult {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  overall: number; // 0-100
  details: {
    love: number;
    friendship: number;
    communication: number;
    trust: number;
  };
  description: string;
  advice: string;
}