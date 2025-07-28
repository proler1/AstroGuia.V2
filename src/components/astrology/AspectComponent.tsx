import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { AspectType, getAspectSymbol } from '../../models/NatalChart';

interface AspectComponentProps {
  type: AspectType;
  size?: 'small' | 'medium' | 'large';
  showName?: boolean;
  showSymbol?: boolean;
  color?: string;
  style?: any;
}

export const getAspectColor = (aspect: AspectType): string => {
  const colors: Record<AspectType, string> = {
    conjunction: '#8860d0',     // Purple
    opposition: '#d80000',      // Red
    trine: '#009933',           // Green
    square: '#d86300',          // Orange
    sextile: '#00aacc',         // Light Blue
    quincunx: '#cc7722',        // Dark Orange
    semisextile: '#66cccc',     // Teal
    semisquare: '#cc6666',      // Light Red
    sesquiquadrate: '#cc4400',  // Dark Red
  };

  return colors[aspect] || '#888888';
};

export const getAspectName = (aspect: AspectType): string => {
  const names: Record<AspectType, string> = {
    conjunction: 'Conjunction',
    opposition: 'Opposition',
    trine: 'Trine',
    square: 'Square',
    sextile: 'Sextile',
    quincunx: 'Quincunx',
    semisextile: 'Semi-sextile',
    semisquare: 'Semi-square',
    sesquiquadrate: 'Sesqui-quadrate',
  };

  return names[aspect] || aspect;
};

export const getAspectAngle = (aspect: AspectType): number => {
  const angles: Record<AspectType, number> = {
    conjunction: 0,
    opposition: 180,
    trine: 120,
    square: 90,
    sextile: 60,
    quincunx: 150,
    semisextile: 30,
    semisquare: 45,
    sesquiquadrate: 135,
  };

  return angles[aspect] || 0;
};

const AspectComponent: React.FC<AspectComponentProps> = ({
  type,
  size = 'medium',
  showName = true,
  showSymbol = true,
  color,
  style,
}) => {
  // Determine sizes based on the size prop
  const getSymbolSize = () => {
    switch (size) {
      case 'small': return 14;
      case 'large': return 24;
      default: return 18;
    }
  };
  
  const getNameSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 16;
      default: return 14;
    }
  };
  
  const aspectColor = color || getAspectColor(type);
  const aspectName = getAspectName(type);
  const aspectSymbol = getAspectSymbol(type);
  
  return (
    <View style={[styles.container, style]}>
      {showSymbol && (
        <Text style={[
          styles.symbol, 
          { fontSize: getSymbolSize(), color: aspectColor }
        ]}>
          {aspectSymbol}
        </Text>
      )}
      
      {showName && (
        <Text style={[
          styles.name,
          { fontSize: getNameSize(), color: aspectColor }
        ]}>
          {aspectName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontWeight: '500',
    marginRight: 4,
  },
  name: {
    fontWeight: '400',
  },
});

export default AspectComponent;