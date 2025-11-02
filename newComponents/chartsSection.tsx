// app/(tabs)/components/ChartsSection.tsx
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

import { styles } from '@/assets/styles/chartsSection.styles';
import { MedicalTheme } from '@/newConstants/theme';

const screenWidth = Dimensions.get('window').width;

interface Statistics {
  lastWeekTreatedData?: Array<{ date: string; count: number }>;
  totalTreatedAppointment?: number;
  totalAvailableAtClinic?: number;
  totalUntreatedAppointmentAndNotAvailable?: number;
}

interface ChartsSectionProps {
  statistics?: Statistics;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ statistics }) => {
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  // Line Chart Data
  const lineChartData = statistics?.lastWeekTreatedData ? {
    labels: statistics.lastWeekTreatedData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        data: statistics.lastWeekTreatedData.map(item => item.count),
        color: (opacity = 1) => `rgba(${hexToRgb(MedicalTheme.colors.primary[500])}, ${opacity})`,
        strokeWidth: 3
      }
    ]
  } : null;

  // Pie Chart Data
  const pieChartData = statistics ? [
    {
      name: "Treated",
      population: statistics.totalTreatedAppointment || 0,
      color: MedicalTheme.colors.success[500],
      legendFontColor: MedicalTheme.colors.text.secondary,
      legendFontSize: 12
    },
    {
      name: "Available",
      population: statistics.totalAvailableAtClinic || 0,
      color: MedicalTheme.colors.primary[400],
      legendFontColor: MedicalTheme.colors.text.secondary,
      legendFontSize: 12
    },
    {
      name: "Pending",
      population: statistics.totalUntreatedAppointmentAndNotAvailable || 0,
      color: MedicalTheme.colors.warning[500],
      legendFontColor: MedicalTheme.colors.text.secondary,
      legendFontSize: 12
    }
  ] : [];

  const chartConfig = {
    backgroundColor: MedicalTheme.colors.background.primary,
    backgroundGradientFrom: MedicalTheme.colors.background.primary,
    backgroundGradientTo: MedicalTheme.colors.background.primary,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(${hexToRgb(MedicalTheme.colors.primary[500])}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${hexToRgb(MedicalTheme.colors.text.primary)}, ${opacity})`,
    style: {
      borderRadius: MedicalTheme.borderRadius.lg
    },
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: MedicalTheme.colors.primary[500]
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: MedicalTheme.colors.border.light,
      strokeOpacity: 0.5
    }
  };

  return (
    <View style={styles.container}>
      {/* Weekly Trend Chart */}
      {lineChartData && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Appointment Trend</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - MedicalTheme.spacing[8]}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withVerticalLines={true}
            withHorizontalLines={true}
            withInnerLines={true}
          />
        </View>
      )}

      {/* Appointment Distribution */}
      {pieChartData.length > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Appointment Distribution</Text>
          <PieChart
            data={pieChartData}
            width={screenWidth - MedicalTheme.spacing[8]}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      )}
    </View>
  );
};

export default ChartsSection;