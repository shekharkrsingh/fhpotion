// app/(tabs)/components/PerformanceMetrics.tsx
import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '@/assets/styles/performanceMetrics.styles';
import { MedicalTheme } from '@/newConstants/theme';

interface Statistics {
  lastActiveDayAppointments?: number;
  lastActiveDayTreatedAppointments?: number;
  lastActiveDayPercentageTreatedAppointments?: number; // Added to match backend DTO
}

interface PerformanceMetricsProps {
  statistics?: Statistics;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ statistics }) => {
  // Use backend's calculated percentage if available, otherwise calculate locally
  const successRate = statistics?.lastActiveDayPercentageTreatedAppointments !== undefined
    ? Math.round(statistics.lastActiveDayPercentageTreatedAppointments) + "%"
    : statistics?.lastActiveDayAppointments && statistics.lastActiveDayTreatedAppointments
    ? Math.round((statistics.lastActiveDayTreatedAppointments / statistics.lastActiveDayAppointments) * 100) + "%"
    : "0%";

  const metrics = [
    {
      label: "Today's Appointments",
      value: statistics?.lastActiveDayAppointments || 0,
      color: MedicalTheme.colors.text.primary,
    },
    {
      label: "Treated Today",
      value: statistics?.lastActiveDayTreatedAppointments || 0,
      color: MedicalTheme.colors.text.primary,
    },
    {
      label: "Success Rate",
      value: successRate,
      color: MedicalTheme.colors.success[500],
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Performance</Text>
      <View style={styles.grid}>
        {metrics.map((metric, index) => (
          <View key={index} style={styles.metricItem}>
            <Text style={[styles.value, { color: metric.color }]}>
              {metric.value}
            </Text>
            <Text style={styles.label}>
              {metric.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PerformanceMetrics;