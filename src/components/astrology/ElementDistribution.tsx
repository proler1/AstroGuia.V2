import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ElementStrength } from '../../models/NatalChart';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { getElementIcon, getElementColor } from './ZodiacSign';

interface ElementDistributionProps {
  elements: ElementStrength[];
  compact?: boolean;
  style?: any;
}

const ElementDistribution: React.FC<ElementDistributionProps> = ({
  elements,
  compact = false,
  style,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  
  const getElementName = (element: 'fire' | 'earth' | 'air' | 'water'): string => {
    switch (element) {
      case 'fire': return t('elements.fire');
      case 'earth': return t('elements.earth');
      case 'air': return t('elements.air');
      case 'water': return t('elements.water');
      default: return element;
    }
  };
  
  // Sort elements by percentage descending
  const sortedElements = [...elements].sort((a, b) => b.percentage - a.percentage);
  
  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        {sortedElements.map((element) => (
          <View key={element.element} style={styles.compactElement}>
            <MaterialCommunityIcons
              name={getElementIcon(element.element)}
              size={16}
              color={getElementColor(element.element)}
              style={styles.compactIcon}
            />
            <ProgressBar
              progress={element.percentage / 100}
              color={getElementColor(element.element)}
              style={styles.compactProgressBar}
            />
            <Text style={styles.compactPercentage}>
              {element.percentage}%
            </Text>
          </View>
        ))}
      </View>
    );
  }
  
  return (
    <View style={[styles.container, style]}>
      {sortedElements.map((element) => (
        <View key={element.element} style={styles.elementRow}>
          <View style={styles.elementLabelContainer}>
            <MaterialCommunityIcons
              name={getElementIcon(element.element)}
              size={24}
              color={getElementColor(element.element)}
              style={styles.icon}
            />
            <Text style={[
              styles.elementLabel, 
              { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
            ]}>
              {getElementName(element.element)}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={element.percentage / 100}
              color={getElementColor(element.element)}
              style={styles.progressBar}
            />
            <Text style={[
              styles.percentage,
              { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
            ]}>
              {element.percentage}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    gap: 12,
  },
  elementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  icon: {
    marginRight: 8,
  },
  elementLabel: {
    fontSize: 14,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  percentage: {
    width: 36,
    fontSize: 14,
    textAlign: 'right',
  },
  compactContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  compactElement: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactIcon: {
    marginRight: 4,
  },
  compactProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  compactPercentage: {
    fontSize: 12,
    width: 28,
    textAlign: 'right',
  },
});

export default ElementDistribution;