import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { AppTheme } from '@/constants/theme';

const screenWidth = Dimensions.get('window').width;

interface Appointment {
  id: number;
  patient: string;
  time: string;
  type: string;
}

interface DashboardData {
  totalAppointment: number;
  totalUntreatedAppointment: number;
  totalTreatedAppointment: number;
  totalAvailableAtClinic: number;
  lastWeekTreatedData: Array<{ date: string; count: number }>;
  upcomingAppointments: Appointment[];
  performanceMetrics: {
    avgConsultationTime: string;
    patientSatisfaction: string;
    monthlyGrowth: string;
  };
}

const DoctorDashboard = () => {
  // Enhanced dummy data
  const dashboardData: DashboardData = {
    totalAppointment: 142,
    totalUntreatedAppointment: 28,
    totalTreatedAppointment: 114,
    totalAvailableAtClinic: 56,
    lastWeekTreatedData: [
      { date: "2025-03-18", count: 12 },
      { date: "2025-03-19", count: 18 },
      { date: "2025-03-20", count: 22 },
      { date: "2025-03-21", count: 15 },
      { date: "2025-03-22", count: 8 },
      { date: "2025-03-23", count: 6 },
      { date: "2025-03-24", count: 33 }
    ],
    upcomingAppointments: [
      { id: 1, patient: "John Doe", time: "09:30 AM", type: "Follow-up" },
      { id: 2, patient: "Sarah Smith", time: "10:15 AM", type: "Consultation" },
      { id: 3, patient: "Michael Johnson", time: "11:00 AM", type: "Check-up" }
    ],
    performanceMetrics: {
      avgConsultationTime: "12 mins",
      patientSatisfaction: "92%",
      monthlyGrowth: "+15%"
    }
  };

  // Destructure the data
  const {
    totalAppointment,
    totalUntreatedAppointment,
    totalTreatedAppointment,
    totalAvailableAtClinic,
    lastWeekTreatedData,
    upcomingAppointments,
    performanceMetrics
  } = dashboardData;

  // Prepare data for charts
  const lineChartData = {
    labels: lastWeekTreatedData.map(item => item.date.split('-')[2]), // Just show day
    datasets: [
      {
        data: lastWeekTreatedData.map(item => item.count),
        color: (opacity = 1) => `rgba(${hexToRgb(AppTheme.colors.appointmentBooked)}, ${opacity})`,
        strokeWidth: 3
      }
    ],
  };

  const pieChartData = [
    {
      name: "Treated",
      population: totalTreatedAppointment,
      color: AppTheme.colors.appointmentCompleted,
      legendFontColor: AppTheme.colors.gray600,
      legendFontSize: 12
    },
    {
      name: "Pending",
      population: totalUntreatedAppointment,
      color: AppTheme.colors.appointmentPending,
      legendFontColor: AppTheme.colors.gray600,
      legendFontSize: 12
    },
    {
      name: "Available",
      population: totalAvailableAtClinic,
      color: AppTheme.colors.success,
      legendFontColor: AppTheme.colors.gray600,
      legendFontSize: 12
    }
  ];

  const barChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [12, 18, 22, 15, 8, 6]
      }
    ]
  };

  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: AppTheme.colors.primaryLight }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with User Info */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.greetingText}>Good morning,</Text>
            <Text style={styles.doctorName}>Dr. Smith</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={AppTheme.colors.gray600} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Summary Cards with Icons */}
        <View style={styles.cardRow}>
          <View style={[styles.card, {backgroundColor: AppTheme.colors.appointmentBooked}]}>
            <View style={styles.cardIconContainer}>
              <FontAwesome5 name="calendar-alt" size={20} color="white" />
            </View>
            <Text style={styles.cardTitle}>Total Appointments</Text>
            <Text style={styles.cardValue}>{totalAppointment}</Text>
            <Text style={styles.cardSubText}>+12% from last week</Text>
          </View>
          
          <View style={[styles.card, {backgroundColor: AppTheme.colors.success}]}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="healing" size={20} color="white" />
            </View>
            <Text style={styles.cardTitle}>Treated</Text>
            <Text style={styles.cardValue}>{totalTreatedAppointment}</Text>
            <Text style={styles.cardSubText}>80% success rate</Text>
          </View>
        </View>
        
        <View style={styles.cardRow}>
          <View style={[styles.card, {backgroundColor: AppTheme.colors.appointmentPending}]}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="pending-actions" size={20} color="white" />
            </View>
            <Text style={styles.cardTitle}>Pending</Text>
            <Text style={styles.cardValue}>{totalUntreatedAppointment}</Text>
            <Text style={styles.cardSubText}>Avg. wait: 2 days</Text>
          </View>
          
          <View style={[styles.card, {backgroundColor: AppTheme.colors.info}]}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="event-available" size={20} color="white" />
            </View>
            <Text style={styles.cardTitle}>Available</Text>
            <Text style={styles.cardValue}>{totalAvailableAtClinic}</Text>
            <Text style={styles.cardSubText}>Next: Today 3 PM</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={[styles.metricsContainer, {backgroundColor: AppTheme.colors.white}]}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{performanceMetrics.avgConsultationTime}</Text>
              <Text style={styles.metricLabel}>Avg. Time</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{performanceMetrics.patientSatisfaction}</Text>
              <Text style={styles.metricLabel}>Satisfaction</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, {color: AppTheme.colors.success}]}>
                {performanceMetrics.monthlyGrowth}
              </Text>
              <Text style={styles.metricLabel}>Monthly Growth</Text>
            </View>
          </View>
        </View>
        
        {/* Weekly Trend Chart */}
        <View style={[styles.chartContainer, {backgroundColor: AppTheme.colors.white}]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Weekly Appointment Trend</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, {color: AppTheme.colors.primary}]}>View Details</Text>
            </TouchableOpacity>
          </View>
          <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: AppTheme.colors.white,
              backgroundGradientFrom: AppTheme.colors.gray100,
              backgroundGradientTo: AppTheme.colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${hexToRgb(AppTheme.colors.appointmentBooked)}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${hexToRgb(AppTheme.colors.gray700)}, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: AppTheme.colors.appointmentBooked
              },
              propsForBackgroundLines: {
                strokeDasharray: ""
              }
            }}
            bezier
            style={styles.chart}
            withVerticalLines={false}
            withHorizontalLines={false}
          />
        </View>
        
        {/* Appointment Distribution Pie Chart */}
        <View style={[styles.chartContainer, {backgroundColor: AppTheme.colors.white}]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Appointment Distribution</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, {color: AppTheme.colors.primary}]}>View Details</Text>
            </TouchableOpacity>
          </View>
          <PieChart
            data={pieChartData}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
        
        {/* Daily Average Bar Chart */}
        <View style={[styles.chartContainer, {backgroundColor: AppTheme.colors.white}]}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Daily Average</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, {color: AppTheme.colors.primary}]}>View Details</Text>
            </TouchableOpacity>
          </View>
          <BarChart
            data={barChartData}
            width={screenWidth - 80}
            height={200}
            chartConfig={{
              backgroundColor: AppTheme.colors.white,
              backgroundGradientFrom: AppTheme.colors.gray100,
              backgroundGradientTo: AppTheme.colors.white,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(${hexToRgb(AppTheme.colors.secondary)}, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(${hexToRgb(AppTheme.colors.gray700)}, ${opacity})`,
            }}
            style={styles.chart}
            yAxisLabel=""
            showBarTops={false}
            fromZero
          />
        </View>

        {/* Upcoming Appointments */}
        <View style={[styles.sectionContainer, {backgroundColor: AppTheme.colors.white}]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, {color: AppTheme.colors.primary}]}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              <View style={[styles.appointmentTime, {backgroundColor: AppTheme.colors.primaryLight}]}>
                <Text style={[styles.appointmentTimeText, {color: AppTheme.colors.primary}]}>{appointment.time}</Text>
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentPatient}>{appointment.patient}</Text>
                <Text style={styles.appointmentType}>{appointment.type}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={AppTheme.colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={[styles.sectionContainer, {backgroundColor: AppTheme.colors.white}]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, {backgroundColor: AppTheme.colors.primaryLight}]}>
                <MaterialIcons name="add" size={24} color={AppTheme.colors.primary} />
              </View>
              <Text style={styles.actionText}>New Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, {backgroundColor: AppTheme.colors.success + '20'}]}>
                <MaterialIcons name="medication" size={24} color={AppTheme.colors.success} />
              </View>
              <Text style={styles.actionText}>Prescribe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, {backgroundColor: AppTheme.colors.danger + '20'}]}>
                <MaterialIcons name="description" size={24} color={AppTheme.colors.danger} />
              </View>
              <Text style={styles.actionText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: AppTheme.spacing.md,
    paddingTop: AppTheme.spacing.md
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.lg
  },
  greetingText: {
    fontSize: 16,
    color: AppTheme.colors.gray500,
    marginBottom: AppTheme.spacing.xs
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '700',
    color: AppTheme.colors.gray800
  },
  notificationButton: {
    position: 'relative'
  },
  notificationBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.danger
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: AppTheme.spacing.md
  },
  card: {
    flex: 1,
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.md,
    marginHorizontal: AppTheme.spacing.xs,
    ...AppTheme.shadows.md
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm
  },
  cardTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: AppTheme.spacing.xs,
    fontWeight: '500'
  },
  cardValue: {
    fontSize: 24,
    color: 'white',
    fontWeight: '700',
    marginBottom: AppTheme.spacing.xs
  },
  cardSubText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  metricsContainer: {
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.md
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppTheme.colors.gray800,
    marginBottom: AppTheme.spacing.sm
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metricItem: {
    alignItems: 'center'
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: AppTheme.colors.gray800,
    marginBottom: AppTheme.spacing.xs
  },
  metricLabel: {
    fontSize: 14,
    color: AppTheme.colors.gray500
  },
  chartContainer: {
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.md
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppTheme.colors.gray800
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500'
  },
  chart: {
    borderRadius: AppTheme.borderRadius.lg
  },
  sectionContainer: {
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.md
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.gray200
  },
  appointmentTime: {
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.sm,
    marginRight: AppTheme.spacing.sm
  },
  appointmentTimeText: {
    fontWeight: '600'
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentPatient: {
    fontSize: 16,
    color: AppTheme.colors.gray800,
    marginBottom: AppTheme.spacing.xs
  },
  appointmentType: {
    fontSize: 14,
    color: AppTheme.colors.gray500
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  actionButton: {
    alignItems: 'center',
    flex: 1
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: AppTheme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm
  },
  actionText: {
    fontSize: 14,
    color: AppTheme.colors.gray600,
    textAlign: 'center'
  }
});

export default DoctorDashboard;