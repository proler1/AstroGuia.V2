export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  birthDetails?: BirthDetails;
  preferences?: UserPreferences;
}

export interface BirthDetails {
  date: string;
  time?: string;
  place: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface UserPreferences {
  language: 'en' | 'es' | 'pt';
  theme: 'light' | 'dark' | 'system';
  notifications: {
    dailyHoroscope: boolean;
    cosmicEvents: boolean;
  };
  interests: string[];
  zodiacSign?: ZodiacSign;
  risingSign?: ZodiacSign;
  moonSign?: ZodiacSign;
}

export type ZodiacSign = 
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export const zodiacSigns: ZodiacSign[] = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces'
];

export const getZodiacSignForDate = (month: number, day: number): ZodiacSign => {
  // Month is 0-indexed (0 = January, 11 = December)
  if ((month === 2 && day >= 21) || (month === 3 && day <= 19)) return 'aries';
  if ((month === 3 && day >= 20) || (month === 4 && day <= 20)) return 'taurus';
  if ((month === 4 && day >= 21) || (month === 5 && day <= 20)) return 'gemini';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 22)) return 'cancer';
  if ((month === 6 && day >= 23) || (month === 7 && day <= 22)) return 'leo';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'virgo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'libra';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 21)) return 'scorpio';
  if ((month === 10 && day >= 22) || (month === 11 && day <= 21)) return 'sagittarius';
  if ((month === 11 && day >= 22) || (month === 0 && day <= 19)) return 'capricorn';
  if ((month === 0 && day >= 20) || (month === 1 && day <= 18)) return 'aquarius';
  return 'pisces';
};