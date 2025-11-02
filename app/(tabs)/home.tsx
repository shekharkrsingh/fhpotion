// app/(tabs)/index.tsx
import React from 'react';
import {
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { styles } from '@/assets/styles/dashboard.styles';
import { MedicalTheme } from '@/newConstants/theme';
import DashboardHeader from '@/newComponents/DashboardHeader';
import StatsCards from '@/newComponents/StatsCards';
import PerformanceMetrics from '@/newComponents/performanceMetrics';
import ChartsSection from '@/newComponents/chartsSection';
import UpcomingAppointments from '@/newComponents/upcomingAppointments';
import QuickActions from '@/newComponents/quickActions';
import LoadingState from '@/newComponents/loadingState';
import EmptyScreen from '@/newComponents/EmptyScreen';

const DoctorDashboard = () => {
  const profileData = useSelector((state: RootState) => state.profile);
  const { data: statistics, loading, error } = useSelector(
    (state: RootState) => state.statistics
  );

  const { data: upcomingAppointments, loading: upcomingAppointmentsLoading } = useSelector(
    (state: RootState) => state.appointments
  );

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - replace with actual refresh logic
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Check if we have meaningful data to display
  const hasData = statistics && (
    statistics.totalAppointment > 0 ||
    statistics.totalTreatedAppointment > 0 ||
    statistics.totalAvailableAtClinic > 0
  );

  if (loading && !refreshing) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyScreen
        type="error"
        onRefresh={onRefresh}
        refreshing={refreshing}
        actions={[
          {
            label: refreshing ? 'Retrying...' : 'Retry',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
          {
            label: 'Restart App',
            onPress: () => window.location.reload(),
            variant: 'outline',
            icon: 'restart-alt',
          },
        ]}
      />
    );
  }

  // Show empty state if no data
  if (!statistics && !loading) {
    return (
      <EmptyScreen
        type="no-data"
        onRefresh={onRefresh}
        refreshing={refreshing}
        title="Dashboard Data Unavailable"
        subtitle="We couldn't load your dashboard statistics. This might be because you don't have any appointments yet or there's a temporary service issue."
        actions={[
          {
            label: refreshing ? 'Refreshing...' : 'Refresh Dashboard',
            onPress: onRefresh,
            variant: 'primary',
            icon: 'refresh',
            disabled: refreshing,
          },
        ]}
      >
      </EmptyScreen>
    );
  }

  return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[MedicalTheme.colors.primary[500]]}
            tintColor={MedicalTheme.colors.primary[500]}
          />
        }
      >
        <DashboardHeader profileData={profileData} />
        <StatsCards statistics={statistics} />
        <PerformanceMetrics statistics={statistics} />
        <ChartsSection statistics={statistics} />
        <UpcomingAppointments 
          appointments={upcomingAppointments}
          loading={upcomingAppointmentsLoading}
        />
        <QuickActions />
      </ScrollView>
  );
};

export default DoctorDashboard;