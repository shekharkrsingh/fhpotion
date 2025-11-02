// app/(tabs)/components/StatCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import { styles } from '@/assets/styles/statCard.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  color: 'primary' | 'success' | 'warning' | 'secondary';
  iconType: 'material' | 'fontawesome5';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  iconType,
}) => {
  const getColorValue = () => {
    switch (color) {
      case 'primary': return MedicalTheme.colors.primary;
      case 'success': return MedicalTheme.colors.success;
      case 'warning': return MedicalTheme.colors.warning;
      case 'secondary': return MedicalTheme.colors.secondary;
      default: return MedicalTheme.colors.primary;
    }
  };

  const colorSet = getColorValue();

  return (
    <View style={[styles.container, { backgroundColor: colorSet[500] }]}>
      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
        {iconType === 'material' ? (
          <MaterialIcons name={icon as any} size={20} color="white" />
        ) : (
          <FontAwesome5 name={icon as any} size={18} color="white" />
        )}
      </View>
      
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      
      {/* Decorative element */}
      <View style={[styles.decoration, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} />
    </View>
  );
};

export default StatCard;