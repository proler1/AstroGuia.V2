import { ZodiacSign } from './User';

export interface NatalChart {
  id: string;
  userId: string;
  createdAt: string;
  birthDetails: {
    date: string;
    time: string | null;
    place: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  chartData: ChartData;
  interpretation?: ChartInterpretation;
}

export interface ChartData {
  planets: PlanetPosition[];
  houses: HouseData[];
  aspects: Aspect[];
  ascendant: {
    sign: ZodiacSign;
    degree: number;
  };
  dominantElements: ElementStrength[];
}

export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  house: number;
  degree: number;
  isRetrograde: boolean;
}

export type Planet = 
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'
  | 'chiron'
  | 'northNode';

export interface HouseData {
  number: number; // 1-12
  sign: ZodiacSign;
  degree: number;
}

export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  orb: number; // Difference from exact aspect in degrees
}

export type AspectType = 
  | 'conjunction'
  | 'opposition'
  | 'trine'
  | 'square'
  | 'sextile'
  | 'quincunx'
  | 'semisextile'
  | 'semisquare'
  | 'sesquiquadrate';

export interface ElementStrength {
  element: 'fire' | 'earth' | 'air' | 'water';
  percentage: number; // 0-100
}

export interface ChartInterpretation {
  summary: string;
  planets: PlanetInterpretation[];
  houses: HouseInterpretation[];
  aspects: AspectInterpretation[];
}

export interface PlanetInterpretation {
  planet: Planet;
  sign: ZodiacSign;
  house: number;
  description: string;
}

export interface HouseInterpretation {
  house: number;
  sign: ZodiacSign;
  description: string;
}

export interface AspectInterpretation {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  description: string;
}

export const getPlanetSymbol = (planet: Planet): string => {
  switch (planet) {
    case 'sun': return '☉';
    case 'moon': return '☽';
    case 'mercury': return '☿';
    case 'venus': return '♀';
    case 'mars': return '♂';
    case 'jupiter': return '♃';
    case 'saturn': return '♄';
    case 'uranus': return '♅';
    case 'neptune': return '♆';
    case 'pluto': return '♇';
    case 'chiron': return '⚷';
    case 'northNode': return '☊';
    default: return '';
  }
};

export const getZodiacSymbol = (sign: ZodiacSign): string => {
  switch (sign) {
    case 'aries': return '♈';
    case 'taurus': return '♉';
    case 'gemini': return '♊';
    case 'cancer': return '♋';
    case 'leo': return '♌';
    case 'virgo': return '♍';
    case 'libra': return '♎';
    case 'scorpio': return '♏';
    case 'sagittarius': return '♐';
    case 'capricorn': return '♑';
    case 'aquarius': return '♒';
    case 'pisces': return '♓';
    default: return '';
  }
};

export const getAspectSymbol = (aspect: AspectType): string => {
  switch (aspect) {
    case 'conjunction': return '☌';
    case 'opposition': return '☍';
    case 'trine': return '△';
    case 'square': return '□';
    case 'sextile': return '⚹';
    case 'quincunx': return '⚻';
    case 'semisextile': return '⚺';
    case 'semisquare': return '∠';
    case 'sesquiquadrate': return '⚼';
    default: return '';
  }
};