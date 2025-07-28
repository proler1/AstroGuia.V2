import { collection, doc, getDoc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { 
  NatalChart, ChartData, PlanetPosition, HouseData, 
  Aspect, Planet, ZodiacSign, ElementStrength, 
  ChartInterpretation, PlanetInterpretation, HouseInterpretation, AspectInterpretation
} from '../models/NatalChart';
import { BirthDetails } from '../models/User';

export class NatalChartService {
  // Create a new natal chart for a user
  static async createNatalChart(userId: string, birthDetails: BirthDetails): Promise<NatalChart> {
    try {
      // In a real app, this would call an astronomy API with birth details to calculate positions
      // For now, we'll generate mock data
      const chartData = await this.calculateChartData(birthDetails);
      const interpretation = await this.generateChartInterpretation(chartData);
      
      const newChart: NatalChart = {
        id: `chart_${userId}_${Date.now()}`,
        userId,
        createdAt: new Date().toISOString(),
        birthDetails: {
          date: birthDetails.date,
          time: birthDetails.time,
          place: birthDetails.location,
          latitude: birthDetails.latitude || 0,
          longitude: birthDetails.longitude || 0,
          timezone: birthDetails.timezone || 'UTC',
        },
        chartData,
        interpretation
      };
      
      // Save to Firestore
      await setDoc(doc(firestore, 'natalCharts', newChart.id), newChart);
      
      return newChart;
    } catch (error: any) {
      console.error('Error creating natal chart:', error);
      throw error;
    }
  }
  
  // Get a user's natal chart by ID
  static async getNatalChart(chartId: string): Promise<NatalChart | null> {
    try {
      const chartDoc = await getDoc(doc(firestore, 'natalCharts', chartId));
      
      if (chartDoc.exists()) {
        return chartDoc.data() as NatalChart;
      }
      
      return null;
    } catch (error: any) {
      console.error(`Error getting natal chart ${chartId}:`, error);
      throw error;
    }
  }
  
  // Get all natal charts for a user
  static async getUserNatalCharts(userId: string): Promise<NatalChart[]> {
    try {
      const chartsQuery = query(
        collection(firestore, 'natalCharts'),
        where('userId', '==', userId)
      );
      
      const chartDocs = await getDocs(chartsQuery);
      
      if (!chartDocs.empty) {
        return chartDocs.docs.map(doc => doc.data() as NatalChart);
      }
      
      return [];
    } catch (error: any) {
      console.error(`Error getting natal charts for user ${userId}:`, error);
      throw error;
    }
  }
  
  // Calculate chart data from birth details
  private static async calculateChartData(birthDetails: BirthDetails): Promise<ChartData> {
    // In a real app, this would use astronomical calculations based on birth data
    // For now, we generate realistic mock data
    
    const zodiacSigns: ZodiacSign[] = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    const planets: Planet[] = [
      'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter',
      'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'northNode'
    ];
    
    // Determine sun sign based on birth date
    let sunSign: ZodiacSign = 'aries'; // Default
    
    if (birthDetails.date) {
      const birthDate = new Date(birthDetails.date);
      const month = birthDate.getMonth() + 1; // getMonth() is 0-indexed
      const day = birthDate.getDate();
      
      // Simple algorithm to determine sun sign
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = 'aries';
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = 'taurus';
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sunSign = 'gemini';
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sunSign = 'cancer';
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = 'leo';
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = 'virgo';
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunSign = 'libra';
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunSign = 'scorpio';
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunSign = 'sagittarius';
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = 'capricorn';
      else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = 'aquarius';
      else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) sunSign = 'pisces';
    }
    
    // Generate planet positions
    const planetPositions: PlanetPosition[] = planets.map(planet => {
      // Sun position is based on birth date, others are random but plausible
      const sign = planet === 'sun' ? sunSign : zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
      
      return {
        planet,
        sign,
        house: Math.floor(Math.random() * 12) + 1, // 1-12
        degree: Math.floor(Math.random() * 30), // 0-29
        isRetrograde: planet !== 'sun' && planet !== 'moon' && Math.random() > 0.7 // Randomly retrograde except sun/moon
      };
    });
    
    // Generate houses
    const ascSign = zodiacSigns[Math.floor(Math.random() * zodiacSigns.length)];
    const houses: HouseData[] = [];
    
    for (let i = 0; i < 12; i++) {
      const houseNum = i + 1;
      const signIndex = (zodiacSigns.indexOf(ascSign) + i) % 12;
      
      houses.push({
        number: houseNum,
        sign: zodiacSigns[signIndex],
        degree: Math.floor(Math.random() * 30) // 0-29
      });
    }
    
    // Generate aspects
    const aspects: Aspect[] = [];
    const aspectTypes = ['conjunction', 'opposition', 'trine', 'square', 'sextile'] as const;
    
    // Create some meaningful aspects between planets
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        // Only create an aspect with a 40% chance
        if (Math.random() > 0.6) {
          aspects.push({
            planet1: planets[i],
            planet2: planets[j],
            type: aspectTypes[Math.floor(Math.random() * aspectTypes.length)],
            orb: Math.random() * 5 // 0-5 degrees
          });
        }
      }
    }
    
    // Calculate dominant elements
    const elementCounts = {
      fire: 0,
      earth: 0,
      air: 0,
      water: 0
    };
    
    // Count elements by planet positions
    planetPositions.forEach(position => {
      const sign = position.sign;
      
      if (['aries', 'leo', 'sagittarius'].includes(sign)) elementCounts.fire++;
      else if (['taurus', 'virgo', 'capricorn'].includes(sign)) elementCounts.earth++;
      else if (['gemini', 'libra', 'aquarius'].includes(sign)) elementCounts.air++;
      else if (['cancer', 'scorpio', 'pisces'].includes(sign)) elementCounts.water++;
    });
    
    // Convert counts to percentages
    const total = planetPositions.length;
    const dominantElements: ElementStrength[] = [
      { element: 'fire', percentage: Math.round((elementCounts.fire / total) * 100) },
      { element: 'earth', percentage: Math.round((elementCounts.earth / total) * 100) },
      { element: 'air', percentage: Math.round((elementCounts.air / total) * 100) },
      { element: 'water', percentage: Math.round((elementCounts.water / total) * 100) }
    ];
    
    return {
      planets: planetPositions,
      houses,
      aspects,
      ascendant: {
        sign: ascSign,
        degree: Math.floor(Math.random() * 30) // 0-29
      },
      dominantElements
    };
  }
  
  // Generate interpretations for a natal chart
  private static async generateChartInterpretation(chartData: ChartData): Promise<ChartInterpretation> {
    const planetInterpretations: PlanetInterpretation[] = chartData.planets.map(planet => {
      return {
        planet: planet.planet,
        sign: planet.sign,
        house: planet.house,
        description: this.getPlanetInterpretation(planet.planet, planet.sign, planet.house, planet.isRetrograde)
      };
    });
    
    const houseInterpretations: HouseInterpretation[] = chartData.houses.map(house => {
      return {
        house: house.number,
        sign: house.sign,
        description: this.getHouseInterpretation(house.number, house.sign)
      };
    });
    
    const aspectInterpretations: AspectInterpretation[] = chartData.aspects.map(aspect => {
      return {
        planet1: aspect.planet1,
        planet2: aspect.planet2,
        type: aspect.type,
        description: this.getAspectInterpretation(aspect.planet1, aspect.planet2, aspect.type)
      };
    });
    
    // Generate an overall summary based on dominant elements and key planets
    const summary = this.generateChartSummary(chartData);
    
    return {
      summary,
      planets: planetInterpretations,
      houses: houseInterpretations,
      aspects: aspectInterpretations
    };
  }
  
  private static getPlanetInterpretation(planet: Planet, sign: ZodiacSign, house: number, isRetrograde: boolean): string {
    // These would be more detailed in a real app with a database of interpretations
    const planetDescriptions = {
      sun: `Your Sun in ${sign} represents your core identity and ego. It reflects how you express your individuality and vitality.`,
      moon: `Your Moon in ${sign} represents your emotional nature, subconscious, and intuitive self.`,
      mercury: `Mercury in ${sign} shapes how you think, communicate, and process information.`,
      venus: `Venus in ${sign} influences your approach to love, beauty, and what you value.`,
      mars: `Mars in ${sign} determines how you assert yourself, take action, and express desires.`,
      jupiter: `Jupiter in ${sign} affects your philosophy, growth opportunities, and how you experience abundance.`,
      saturn: `Saturn in ${sign} relates to your sense of responsibility, limitations, and life lessons.`,
      uranus: `Uranus in ${sign} influences how you express individuality and where you seek freedom.`,
      neptune: `Neptune in ${sign} shapes your spirituality, dreams, and where boundaries may be blurred.`,
      pluto: `Pluto in ${sign} represents areas of transformation, power dynamics, and rebirth.`,
      chiron: `Chiron in ${sign} points to your deepest wounds and greatest healing potential.`,
      northNode: `Your North Node in ${sign} indicates your soul's growth direction in this lifetime.`
    };
    
    const houseDescription = `Being in House ${house}, this energy manifests in the area of ${this.getHouseArea(house)}.`;
    const retrogradeNote = isRetrograde ? ` Since it's retrograde, these energies may be more internalized or require revisiting past issues.` : '';
    
    return `${planetDescriptions[planet]} ${houseDescription}${retrogradeNote}`;
  }
  
  private static getHouseInterpretation(houseNumber: number, sign: ZodiacSign): string {
    return `Your ${this.getOrdinal(houseNumber)} House is in ${sign}, which influences how you approach ${this.getHouseArea(houseNumber)}. The qualities of ${sign} color your experiences in this area of life.`;
  }
  
  private static getAspectInterpretation(planet1: Planet, planet2: Planet, type: string): string {
    const aspectDescriptions = {
      conjunction: 'merges and intensifies these energies, creating a powerful focus',
      opposition: 'creates tension and awareness between these areas, requiring balance',
      trine: 'allows these energies to flow harmoniously, creating natural talents',
      square: 'creates dynamic tension and challenges that motivate growth',
      sextile: 'offers opportunities for these energies to cooperate with some effort',
      quincunx: 'requires adjustment between these seemingly unrelated areas',
      semisextile: 'creates a subtle connection requiring awareness to utilize',
      semisquare: 'produces mild irritation that can motivate small adjustments',
      sesquiquadrate: 'creates persistent tension that demands creative resolution'
    };
    
    return `Your ${planet1} ${type} ${planet2} ${aspectDescriptions[type as keyof typeof aspectDescriptions]}. This affects how your ${this.getPlanetDomain(planet1)} interacts with your ${this.getPlanetDomain(planet2)}.`;
  }
  
  private static getHouseArea(houseNumber: number): string {
    const houseAreas = [
      'self-image and personal identity',
      'values, possessions, and resources',
      'communication, learning, and siblings',
      'home, family, and foundations',
      'creativity, pleasure, and children',
      'health, daily routines, and service',
      'partnerships and relationships',
      'transformation, shared resources, and intimacy',
      'philosophy, higher learning, and travel',
      'career, public reputation, and achievement',
      'friendships, groups, and hopes',
      'spirituality, unconscious, and hidden matters'
    ];
    
    return houseAreas[houseNumber - 1];
  }
  
  private static getPlanetDomain(planet: Planet): string {
    const domains = {
      sun: 'core identity and purpose',
      moon: 'emotional nature',
      mercury: 'communication style',
      venus: 'approach to love and values',
      mars: 'drive and assertion',
      jupiter: 'growth and expansion',
      saturn: 'discipline and responsibility',
      uranus: 'innovation and individuality',
      neptune: 'spirituality and inspiration',
      pluto: 'transformation and power',
      chiron: 'wounds and healing process',
      northNode: 'life path and purpose'
    };
    
    return domains[planet] || planet;
  }
  
  private static getOrdinal(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = n % 100;
    return n + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
  }
  
  private static generateChartSummary(chartData: ChartData): string {
    // Find dominant element
    const dominant = [...chartData.dominantElements].sort((a, b) => b.percentage - a.percentage)[0];
    
    // Find sun, moon, and ascendant
    const sun = chartData.planets.find(p => p.planet === 'sun');
    const moon = chartData.planets.find(p => p.planet === 'moon');
    const ascendant = chartData.ascendant;
    
    // Generate summary
    let summary = `Your natal chart shows a predominance of ${dominant.element} energy (${dominant.percentage}%), suggesting you are naturally ${this.getElementalTraits(dominant.element)}. `;
    
    if (sun) {
      summary += `With your Sun in ${sun.sign}, your core essence expresses through ${this.getSignTraits(sun.sign)}. `;
    }
    
    if (moon) {
      summary += `Your Moon in ${moon.sign} indicates that emotionally you are ${this.getSignTraits(moon.sign)}. `;
    }
    
    if (ascendant) {
      summary += `Your ${ascendant.sign} Ascendant shapes how others perceive you: ${this.getSignTraits(ascendant.sign)}. `;
    }
    
    // Add a note about significant aspects if present
    const significantAspects = chartData.aspects.filter(a => 
      (a.planet1 === 'sun' || a.planet1 === 'moon' || a.planet2 === 'sun' || a.planet2 === 'moon') && 
      (a.type === 'conjunction' || a.type === 'opposition' || a.type === 'square')
    );
    
    if (significantAspects.length > 0) {
      summary += `Your chart contains ${significantAspects.length} significant aspects involving your Sun or Moon, highlighting important dynamics in your personality and life path.`;
    } else {
      summary += `Your chart shows a relatively balanced interaction between your core energies.`;
    }
    
    return summary;
  }
  
  private static getElementalTraits(element: string): string {
    const traits = {
      fire: 'passionate, action-oriented, and dynamic',
      earth: 'practical, grounded, and dependable',
      air: 'intellectual, communicative, and socially oriented',
      water: 'emotional, intuitive, and empathetic'
    };
    
    return traits[element as keyof typeof traits] || 'balanced';
  }
  
  private static getSignTraits(sign: ZodiacSign): string {
    const traits = {
      aries: 'assertive, pioneering, and direct',
      taurus: 'reliable, sensual, and resource-conscious',
      gemini: 'curious, versatile, and communicative',
      cancer: 'nurturing, protective, and emotionally intuitive',
      leo: 'creative, generous, and proud',
      virgo: 'analytical, precise, and service-oriented',
      libra: 'harmonious, partnership-focused, and fair-minded',
      scorpio: 'intense, transformative, and deeply perceptive',
      sagittarius: 'optimistic, philosophical, and freedom-loving',
      capricorn: 'ambitious, disciplined, and achievement-oriented',
      aquarius: 'innovative, humanitarian, and independent',
      pisces: 'compassionate, imaginative, and spiritually attuned'
    };
    
    return traits[sign] || 'balanced';
  }
}